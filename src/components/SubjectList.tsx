import { useStudyStore } from "@/lib/store";
import { Trash2, Calendar, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Topic } from "@/lib/types";

const statusColors: Record<Topic["status"], string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/15 text-primary",
  difficult: "bg-destructive/15 text-destructive",
  completed: "bg-success/15 text-success",
};

const statusLabels: Record<Topic["status"], string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  difficult: "Difficult",
  completed: "Completed",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function SubjectList() {
  const { subjects, removeSubject, updateTopicStatus, updateTopicPriority } = useStudyStore();

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Flame className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-display">No subjects yet</p>
        <p className="text-sm">Add your first subject to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject, idx) => {
        const completed = subject.topics.filter(t => t.status === "completed").length;
        const progress = subject.topics.length > 0 ? (completed / subject.topics.length) * 100 : 0;
        const daysLeft = Math.ceil((new Date(subject.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        return (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                <div>
                  <h3 className="font-display font-semibold text-foreground">{subject.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Exam passed"}
                    </span>
                    <span>Difficulty: {"★".repeat(subject.difficulty)}{"☆".repeat(5 - subject.difficulty)}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeSubject(subject.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Progress value={progress} className="h-2 mb-3" />
            <p className="text-xs text-muted-foreground mb-3">{completed}/{subject.topics.length} topics completed</p>

            <div className="space-y-2">
              {subject.topics.map(topic => (
                <div key={topic.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColors[topic.status] + " border-0 text-xs"}>
                      {statusLabels[topic.status]}
                    </Badge>
                    <Badge className={`text-xs ${priorityColors[topic.priority]}`}>
                      {topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1)}
                    </Badge>
                    <span className="text-sm text-foreground">{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={topic.priority}
                      onValueChange={(v) => updateTopicPriority(subject.id, topic.id, v as "low" | "medium" | "high")}
                    >
                      <SelectTrigger className="w-28 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={topic.status}
                      onValueChange={(v) => updateTopicStatus(subject.id, topic.id, v as Topic["status"])}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="difficult">Difficult</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
