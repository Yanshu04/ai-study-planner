import { Subject, DaySchedule, StudySession, StudyPlanConfig } from "./types";

const DIFFICULTY_WEIGHT = 3;
const URGENCY_WEIGHT = 2;
const DIFFICULT_TOPIC_BONUS = 1.5;

function calculatePriority(subject: Subject, today: Date): number {
  const examDate = new Date(subject.examDate);
  const daysRemaining = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const urgency = Math.max(0, 10 - daysRemaining / 3);
  
  const incompletTopics = subject.topics.filter(t => t.status !== "completed").length;
  const difficultTopics = subject.topics.filter(t => t.status === "difficult").length;
  
  const topicLoad = incompletTopics > 0 ? incompletTopics / subject.topics.length : 0;
  
  return (
    subject.difficulty * DIFFICULTY_WEIGHT +
    urgency * URGENCY_WEIGHT +
    difficultTopics * DIFFICULT_TOPIC_BONUS +
    topicLoad * 2
  );
}

export function generateSchedule(config: StudyPlanConfig): DaySchedule[] {
  const { subjects, dailyHours, startDate } = config;
  const activeSubjects = subjects.filter(s => {
    const hasIncomplete = s.topics.some(t => t.status !== "completed");
    return hasIncomplete;
  });

  if (activeSubjects.length === 0) return [];

  // Find the latest exam date
  const latestExam = new Date(Math.max(...activeSubjects.map(s => new Date(s.examDate).getTime())));
  const start = new Date(startDate);
  const totalDays = Math.max(1, Math.ceil((latestExam.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const scheduleDays = Math.min(totalDays, 30); // Cap at 30 days

  const schedule: DaySchedule[] = [];

  for (let d = 0; d < scheduleDays; d++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + d);

    // Calculate priorities for this day
    const priorities = activeSubjects.map(s => ({
      subject: s,
      priority: calculatePriority(s, currentDate),
    }));
    priorities.sort((a, b) => b.priority - a.priority);

    const totalPriority = priorities.reduce((sum, p) => sum + p.priority, 0);
    
    const sessions: StudySession[] = [];
    let remainingHours = dailyHours;

    for (const { subject, priority } of priorities) {
      if (remainingHours <= 0) break;
      
      const allocatedHours = Math.round((priority / totalPriority) * dailyHours * 2) / 2; // Round to 0.5
      const hours = Math.min(allocatedHours, remainingHours, 3); // Cap per subject per day
      
      if (hours >= 0.5) {
        // Find next incomplete topic
        const nextTopic = subject.topics.find(t => t.status !== "completed");
        sessions.push({
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: nextTopic?.id,
          topicName: nextTopic?.name,
          hours,
          color: subject.color,
        });
        remainingHours -= hours;
      }
    }

    schedule.push({
      date: currentDate.toISOString().split("T")[0],
      sessions,
      totalHours: dailyHours - remainingHours,
    });
  }

  return schedule;
}

// Simple linear regression prediction for recommended study hours
export function predictStudyHours(
  difficulty: number,
  topicsRemaining: number,
  pastScore: number,
  daysUntilExam: number
): number {
  // Trained coefficients (simulated from the example dataset)
  const intercept = 2.0;
  const diffCoef = 1.2;
  const topicsCoef = 0.5;
  const scoreCoef = -0.03;
  const daysCoef = -0.05;

  const predicted =
    intercept +
    diffCoef * difficulty +
    topicsCoef * topicsRemaining +
    scoreCoef * pastScore +
    daysCoef * Math.max(0, daysUntilExam);

  return Math.max(1, Math.round(predicted * 2) / 2); // Min 1 hour, round to 0.5
}

export const SUBJECT_COLORS = [
  "hsl(168, 55%, 38%)", // teal
  "hsl(35, 90%, 55%)",  // amber
  "hsl(260, 50%, 55%)", // purple
  "hsl(0, 72%, 51%)",   // red
  "hsl(200, 60%, 50%)", // blue
  "hsl(142, 60%, 40%)", // green
  "hsl(320, 60%, 50%)", // pink
  "hsl(45, 80%, 50%)",  // gold
];
