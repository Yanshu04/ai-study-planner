import { Subject, DailyGoal, PerformanceData } from "./types";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function calculateDaysUntilExam(examDate: string): number {
  const today = new Date();
  const exam = new Date(examDate + "T00:00:00");
  const daysLeft = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

export function getExamStatus(examDate: string): "upcoming" | "soon" | "critical" | "passed" {
  const daysLeft = calculateDaysUntilExam(examDate);
  if (daysLeft <= 0) return "passed";
  if (daysLeft <= 7) return "critical";
  if (daysLeft <= 30) return "soon";
  return "upcoming";
}

export function estimateExamScore(hoursStudied: number, difficulty: number, topicsCompleted: number, topicsTotal: number): number {
  const completionPercentage = topicsTotal > 0 ? (topicsCompleted / topicsTotal) * 100 : 0;
  const baseScore = 50;
  const hoursBonus = Math.min(40, hoursStudied * 0.3);
  const completionBonus = (completionPercentage / 100) * 10;
  const difficultyPenalty = difficulty * 2;
  
  return Math.min(100, Math.max(0, Math.round(baseScore + hoursBonus + completionBonus - difficultyPenalty)));
}

export function exportStudyPlanAsJSON(subjects: Subject[]): string {
  return JSON.stringify({ subjects, exportDate: new Date().toISOString() }, null, 2);
}

export function exportStudyPlanAsCSV(subjects: Subject[]): string {
  let csv = "Subject,Topic,Status,Hours Studied,Estimated Hours,Priority\n";
  
  subjects.forEach(subject => {
    subject.topics.forEach((topic, index) => {
      const row = [
        index === 0 ? subject.name : "",
        `"${topic.name}"`,
        topic.status,
        topic.hoursStudied,
        topic.estimatedHours,
        topic.priority,
      ].join(",");
      csv += row + "\n";
    });
  });
  
  return csv;
}

export function exportStudyPlanAsPDF(subjects: Subject[]) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.text("Study Plan Export", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Export date
  pdf.setFontSize(10);
  pdf.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;

  // Table data
  const tableData: any[] = [];
  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      tableData.push([
        subject.name,
        topic.name,
        topic.status,
        `${topic.hoursStudied}h`,
        `${topic.estimatedHours}h`,
        topic.priority,
      ]);
    });
  });

  (pdf as any).autoTable({
    startY: yPosition,
    head: [["Subject", "Topic", "Status", "Hours Studied", "Estimated", "Priority"]],
    body: tableData,
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
    },
  });

  pdf.save("study-plan.pdf");
}

export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generatePerformanceData(subjects: Subject[]): PerformanceData[] {
  const today = new Date();
  const data: PerformanceData[] = [];

  // Generate last 30 days of performance data
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const hoursStudied = subjects.reduce((sum, s) => 
      sum + s.topics.reduce((topicSum, t) => topicSum + (t.hoursStudied > 0 ? Math.random() * 2 : 0), 0), 0
    );

    const topicsCompleted = subjects.reduce((sum, s) =>
      sum + s.topics.filter(t => t.status === "completed").length, 0
    );

    data.push({
      date: dateStr,
      hoursStudied: Math.round(hoursStudied * 10) / 10,
      topicsCompleted,
    });
  }

  return data;
}

export function getTopicsNeedingReview(subjects: Subject[]): Array<{subjectName: string; topicName: string; difficulty: string}> {
  const topics: Array<{subjectName: string; topicName: string; difficulty: string}> = [];
  
  subjects.forEach(subject => {
    subject.topics
      .filter(t => t.status === "difficult")
      .forEach(topic => {
        topics.push({
          subjectName: subject.name,
          topicName: topic.name,
          difficulty: `${topic.priority} - ${topic.retryCount} retries`,
        });
      });
  });

  return topics;
}
