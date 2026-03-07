export interface Subject {
  id: string;
  name: string;
  difficulty: number; // 1-5
  examDate: string; // ISO date
  topics: Topic[];
  color: string;
}

export interface Topic {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "difficult" | "completed";
  estimatedHours: number;
  hoursStudied: number;
  priority: "low" | "medium" | "high";
  notes: string;
  studyTips: string[];
  retryCount: number;
}

export interface StudyNote {
  id: string;
  topicId: string;
  subjectId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  subjectId: string;
  subjectName: string;
  topicId?: string;
  topicName?: string;
  hours: number;
  color: string;
}

export interface DaySchedule {
  date: string;
  sessions: StudySession[];
  totalHours: number;
}

export interface StudyStats {
  totalHoursStudied: number;
  topicsCompleted: number;
  topicsTotal: number;
  currentStreak: number;
  completionPercentage: number;
  hoursPerSubject: Record<string, number>;
}

export interface StudyPlanConfig {
  subjects: Subject[];
  dailyHours: number;
  startDate: string;
}

export interface PredictionInput {
  difficulty: number;
  topicsRemaining: number;
  pastScore: number;
  daysUntilExam: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: string;
}

export interface DailyGoal {
  id: string;
  date: string;
  targetHours: number;
  hoursLogged: number;
  completed: boolean;
}

export interface PerformanceData {
  date: string;
  hoursStudied: number;
  topicsCompleted: number;
}

export interface SubjectEfficiency {
  subjectId: string;
  subjectName: string;
  hoursStudied: number;
  topicsCompleted: number;
  estimatedScore: number;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  enableNotifications: boolean;
  enableBreakAlerts: boolean;
  enableExamWarning: boolean;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  notificationTime?: string; // HH:MM format
}

export interface StudyAction {
  id: string;
  type: "addSubject" | "logHours" | "updateTopic" | "deleteSubject" | "addNote";
  timestamp: string;
  data: Record<string, any>;
}

export interface SubjectCreateInput {
  year: number;
  semester: number;
}

