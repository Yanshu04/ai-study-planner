import { useMemo } from "react";
import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock3, AlertTriangle } from "lucide-react";

type Suggestion = {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  status: "not_started" | "in_progress" | "difficult";
  daysUntilExam: number;
  recommendedHours: number;
  reason: string;
  color: string;
  score: number;
};

const PRIORITY_WEIGHT: Record<"low" | "medium" | "high", number> = {
  low: 1,
  medium: 2,
  high: 3.5,
};

const STATUS_WEIGHT: Record<"not_started" | "in_progress" | "difficult", number> = {
  not_started: 1.5,
  in_progress: 2.25,
  difficult: 3.25,
};

function getUrgencyWeight(daysUntilExam: number): number {
  if (daysUntilExam <= 3) return 5;
  if (daysUntilExam <= 7) return 4;
  if (daysUntilExam <= 14) return 3;
  if (daysUntilExam <= 30) return 2;
  return 1;
}

function buildReason(status: Suggestion["status"], daysUntilExam: number, retryCount: number): string {
  const urgency =
    daysUntilExam <= 3
      ? "Exam is very close"
      : daysUntilExam <= 7
      ? "Exam is coming soon"
      : "Build progress early";

  const statusReason =
    status === "difficult"
      ? "topic marked difficult"
      : status === "in_progress"
      ? "already in progress"
      : "not started yet";

  if (retryCount > 0) {
    return `${urgency}, ${statusReason}, retried ${retryCount}x`;
  }

  return `${urgency}, ${statusReason}`;
}

export function SmartSuggestionsPanel() {
  const { subjects, dailyHours } = useStudyStore();

  const suggestions = useMemo(() => {
    const today = new Date();

    const candidates = subjects.flatMap(subject => {
      const daysUntilExam = Math.max(
        0,
        Math.ceil((new Date(subject.examDate + "T00:00:00").getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      );

      return subject.topics
        .filter(topic => topic.status !== "completed")
        .map(topic => {
          const remainingHours = Math.max(0.5, topic.estimatedHours - topic.hoursStudied);
          const status = topic.status as "not_started" | "in_progress" | "difficult";

          const score =
            getUrgencyWeight(daysUntilExam) * 2 +
            STATUS_WEIGHT[status] * 2 +
            PRIORITY_WEIGHT[topic.priority] * 1.5 +
            Math.min(topic.retryCount, 4) +
            subject.difficulty * 0.8 +
            Math.min(remainingHours, 4) * 0.5;

          return {
            subjectId: subject.id,
            subjectName: subject.name,
            topicId: topic.id,
            topicName: topic.name,
            status,
            daysUntilExam,
            reason: buildReason(status, daysUntilExam, topic.retryCount),
            color: subject.color,
            score,
          };
        });
    });

    if (candidates.length === 0) return [] as Suggestion[];

    const ranked = candidates.sort((a, b) => b.score - a.score).slice(0, 4);
    const scoreTotal = ranked.reduce((sum, item) => sum + item.score, 0);

    return ranked.map(item => {
      const ratio = scoreTotal > 0 ? item.score / scoreTotal : 0;
      const rawHours = Math.max(0.5, Math.min(2.5, Math.round(ratio * dailyHours * 2) / 2));

      return {
        ...item,
        recommendedHours: rawHours,
      };
    });
  }, [subjects, dailyHours]);

  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
          <CardDescription>What to study today based on exam proximity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add subjects and topics to generate personalized suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
          <CardDescription>What to study today based on exam proximity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All topics are completed. Nice work.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>Prioritized for today using exam proximity, difficulty, and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((item, index) => (
            <div key={`${item.subjectId}-${item.topicId}`} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <p className="text-sm font-semibold text-foreground truncate">
                      {index + 1}. {item.topicName}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.subjectName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary" className="mb-2">
                    <Clock3 className="h-3 w-3 mr-1" />
                    {item.recommendedHours}h
                  </Badge>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {item.daysUntilExam === 0 ? "Exam day" : `${item.daysUntilExam}d left`}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Suggestions are guidance, not strict rules. Adjust based on your energy and deadlines.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
