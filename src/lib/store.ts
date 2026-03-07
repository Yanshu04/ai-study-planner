import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Subject, DaySchedule, StudyStats, Achievement, DailyGoal, StudyNote, PerformanceData, UserPreferences, StudyAction } from "./types";
import { generateSchedule, SUBJECT_COLORS } from "./scheduler";

interface StudyStore {
  // Core data
  subjects: Subject[];
  dailyHours: number;
  schedule: DaySchedule[];
  studyStreak: number;
  lastStudyDate: string | null;
  
  // New features
  achievements: Achievement[];
  dailyGoals: DailyGoal[];
  notes: StudyNote[];
  performanceHistory: PerformanceData[];
  preferences: UserPreferences;
  actionHistory: StudyAction[];
  actionHistoryIndex: number;
  
  // Core actions
  addSubject: (name: string, difficulty: number, examDate: string, topics: string[]) => void;
  removeSubject: (id: string) => void;
  updateTopicStatus: (subjectId: string, topicId: string, status: "not_started" | "in_progress" | "difficult" | "completed") => void;
  logStudyHours: (subjectId: string, topicId: string, hours: number) => void;
  setDailyHours: (hours: number) => void;
  regenerateSchedule: () => void;
  getStats: () => StudyStats;
  
  // New feature actions
  updateTopicPriority: (subjectId: string, topicId: string, priority: "low" | "medium" | "high") => void;
  updateTopicNotes: (subjectId: string, topicId: string, notes: string) => void;
  addStudyNote: (topicId: string, subjectId: string, content: string) => void;
  deleteStudyNote: (noteId: string) => void;
  setDailyGoal: (date: string, targetHours: number) => void;
  getDailyGoal: (date: string) => DailyGoal | undefined;
  checkAndUnlockAchievements: () => void;
  getAchievements: () => Achievement[];
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  getPerformanceHistory: () => PerformanceData[];
  incrementTopicRetry: (subjectId: string, topicId: string) => void;
  undo: () => void;
  redo: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "1", name: "First Steps", description: "Study for 1 hour", icon: "🎯", condition: "totalHours >= 1" },
  { id: "2", name: "Century", description: "Study for 100 hours", icon: "💯", condition: "totalHours >= 100" },
  { id: "3", name: "On Fire", description: "Maintain a 7-day streak", icon: "🔥", condition: "streak >= 7" },
  { id: "4", name: "Topic Master", description: "Complete 10 topics", icon: "🏆", condition: "topicsCompleted >= 10" },
  { id: "5", name: "Evening Owl", description: "Study after 8 PM", icon: "🦉", condition: "lateStudy" },
  { id: "6", name: "Perfect Day", description: "Complete daily goal", icon: "✨", condition: "dailyGoalComplete" },
];

const INITIAL_PREFERENCES: UserPreferences = {
  theme: "system",
  enableNotifications: true,
  enableBreakAlerts: true,
  enableExamWarning: true,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  notificationTime: "09:00",
};

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      subjects: [],
      dailyHours: 4,
      schedule: [],
      studyStreak: 0,
      lastStudyDate: null,
      achievements: INITIAL_ACHIEVEMENTS,
      dailyGoals: [],
      notes: [],
      performanceHistory: [],
      preferences: INITIAL_PREFERENCES,
      actionHistory: [],
      actionHistoryIndex: -1,

      addSubject: (name, difficulty, examDate, topicNames) => {
        const state = get();
        const colorIndex = state.subjects.length % SUBJECT_COLORS.length;
        const subject: Subject = {
          id: crypto.randomUUID(),
          name,
          difficulty,
          examDate,
          color: SUBJECT_COLORS[colorIndex],
          topics: topicNames.map(t => ({
            id: crypto.randomUUID(),
            name: t,
            status: "not_started",
            estimatedHours: difficulty * 1.5,
            hoursStudied: 0,
            priority: "medium",
            notes: "",
            studyTips: [],
            retryCount: 0,
          })),
        };
        
        const newAction: StudyAction = {
          id: crypto.randomUUID(),
          type: "addSubject",
          timestamp: new Date().toISOString(),
          data: { subject },
        };
        
        set(s => ({
          subjects: [...s.subjects, subject],
          actionHistory: [...s.actionHistory.slice(0, s.actionHistoryIndex + 1), newAction],
          actionHistoryIndex: s.actionHistoryIndex + 1,
        }));
        get().regenerateSchedule();
        get().checkAndUnlockAchievements();
      },

      removeSubject: (id) => {
        set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) }));
        get().regenerateSchedule();
      },

      updateTopicStatus: (subjectId, topicId, status) => {
        set(s => ({
          subjects: s.subjects.map(sub =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.map(t => t.id === topicId ? { ...t, status } : t) }
              : sub
          ),
        }));
        get().regenerateSchedule();
        get().checkAndUnlockAchievements();
      },

      logStudyHours: (subjectId, topicId, hours) => {
        const today = new Date().toISOString().split("T")[0];
        set(s => {
          const newStreak = s.lastStudyDate === today ? s.studyStreak
            : s.lastStudyDate === new Date(Date.now() - 86400000).toISOString().split("T")[0]
              ? s.studyStreak + 1 : 1;
          
          const updatedSubjects = s.subjects.map(sub =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.map(t => t.id === topicId ? { ...t, hoursStudied: t.hoursStudied + hours } : t) }
              : sub
          );

          const newAction: StudyAction = {
            id: crypto.randomUUID(),
            type: "logHours",
            timestamp: new Date().toISOString(),
            data: { subjectId, topicId, hours },
          };

          return {
            subjects: updatedSubjects,
            studyStreak: newStreak,
            lastStudyDate: today,
            actionHistory: [...s.actionHistory.slice(0, s.actionHistoryIndex + 1), newAction],
            actionHistoryIndex: s.actionHistoryIndex + 1,
          };
        });
        get().checkAndUnlockAchievements();
      },

      setDailyHours: (hours) => {
        set({ dailyHours: hours });
        get().regenerateSchedule();
      },

      regenerateSchedule: () => {
        const state = get();
        const schedule = generateSchedule({
          subjects: state.subjects,
          dailyHours: state.dailyHours,
          startDate: new Date().toISOString().split("T")[0],
        });
        set({ schedule });
      },

      getStats: () => {
        const state = get();
        const allTopics = state.subjects.flatMap(s => s.topics);
        const completed = allTopics.filter(t => t.status === "completed").length;
        const totalHours = allTopics.reduce((sum, t) => sum + t.hoursStudied, 0);
        
        const hoursPerSubject: Record<string, number> = {};
        state.subjects.forEach(s => {
          hoursPerSubject[s.name] = s.topics.reduce((sum, t) => sum + t.hoursStudied, 0);
        });

        return {
          totalHoursStudied: totalHours,
          topicsCompleted: completed,
          topicsTotal: allTopics.length,
          currentStreak: state.studyStreak,
          completionPercentage: allTopics.length > 0 ? Math.round((completed / allTopics.length) * 100) : 0,
          hoursPerSubject,
        };
      },

      updateTopicPriority: (subjectId, topicId, priority) => {
        set(s => ({
          subjects: s.subjects.map(sub =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.map(t => t.id === topicId ? { ...t, priority } : t) }
              : sub
          ),
        }));
      },

      updateTopicNotes: (subjectId, topicId, notes) => {
        set(s => ({
          subjects: s.subjects.map(sub =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.map(t => t.id === topicId ? { ...t, notes } : t) }
              : sub
          ),
        }));
      },

      addStudyNote: (topicId, subjectId, content) => {
        const note: StudyNote = {
          id: crypto.randomUUID(),
          topicId,
          subjectId,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(s => ({ notes: [...s.notes, note] }));
      },

      deleteStudyNote: (noteId) => {
        set(s => ({ notes: s.notes.filter(n => n.id !== noteId) }));
      },

      setDailyGoal: (date, targetHours) => {
        set(s => {
          const existing = s.dailyGoals.find(g => g.date === date);
          if (existing) {
            return {
              dailyGoals: s.dailyGoals.map(g => g.date === date ? { ...g, targetHours } : g),
            };
          }
          return {
            dailyGoals: [...s.dailyGoals, {
              id: crypto.randomUUID(),
              date,
              targetHours,
              hoursLogged: 0,
              completed: false,
            }],
          };
        });
      },

      getDailyGoal: (date) => {
        return get().dailyGoals.find(g => g.date === date);
      },

      checkAndUnlockAchievements: () => {
        const state = get();
        const stats = get().getStats();
        
        set(s => ({
          achievements: s.achievements.map(a => {
            if (a.unlockedAt) return a;
            
            let unlocked = false;
            if (a.condition.includes("totalHours")) {
              const hours = parseInt(a.condition.match(/\d+/)?.[0] || "0");
              unlocked = stats.totalHoursStudied >= hours;
            } else if (a.condition.includes("streak")) {
              const streak = parseInt(a.condition.match(/\d+/)?.[0] || "0");
              unlocked = stats.currentStreak >= streak;
            } else if (a.condition.includes("topicsCompleted")) {
              const topics = parseInt(a.condition.match(/\d+/)?.[0] || "0");
              unlocked = stats.topicsCompleted >= topics;
            }
            
            return unlocked ? { ...a, unlockedAt: new Date().toISOString() } : a;
          }),
        }));
      },

      getAchievements: () => {
        return get().achievements;
      },

      setPreferences: (prefs) => {
        set(s => ({
          preferences: { ...s.preferences, ...prefs },
        }));
      },

      getPerformanceHistory: () => {
        return get().performanceHistory;
      },

      incrementTopicRetry: (subjectId, topicId) => {
        set(s => ({
          subjects: s.subjects.map(sub =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.map(t => t.id === topicId ? { ...t, retryCount: t.retryCount + 1 } : t) }
              : sub
          ),
        }));
      },

      undo: () => {
        const state = get();
        if (state.actionHistoryIndex > 0) {
          set(s => ({ actionHistoryIndex: s.actionHistoryIndex - 1 }));
        }
      },

      redo: () => {
        const state = get();
        if (state.actionHistoryIndex < state.actionHistory.length - 1) {
          set(s => ({ actionHistoryIndex: s.actionHistoryIndex + 1 }));
        }
      },
    }),
    { name: "ai-study-planner" }
  )
);
