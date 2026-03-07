import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { calculateDaysUntilExam, getExamStatus, formatDate } from "@/lib/helpers";

export function ExamCountdownPanel() {
  const { subjects } = useStudyStore();
  
  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Exam Countdown
          </CardTitle>
          <CardDescription>Track your upcoming exams</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No exams scheduled yet</p>
        </CardContent>
      </Card>
    );
  }

  const sortedSubjects = [...subjects].sort((a, b) => 
    new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Exam Countdown
        </CardTitle>
        <CardDescription>Your upcoming exams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedSubjects.map((subject, idx) => {
            const daysLeft = calculateDaysUntilExam(subject.examDate);
            const status = getExamStatus(subject.examDate);

            const statusConfig = {
              upcoming: { color: "bg-blue-100 dark:bg-blue-950", textColor: "text-blue-600", label: "Upcoming" },
              soon: { color: "bg-yellow-100 dark:bg-yellow-950", textColor: "text-yellow-600", label: "Soon" },
              critical: { color: "bg-red-100 dark:bg-red-950", textColor: "text-red-600", label: "Critical" },
              passed: { color: "bg-green-100 dark:bg-green-950", textColor: "text-green-600", label: "Passed" },
            };

            const config = statusConfig[status];

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-lg border p-3 ${config.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(subject.examDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${config.textColor}`}>{daysLeft}</p>
                    <Badge variant="outline" className={`text-xs ${config.textColor}`}>
                      {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${config.label}`}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
