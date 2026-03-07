import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getTopicsNeedingReview } from "@/lib/helpers";

export function DifficultTopicsPanel() {
  const { subjects } = useStudyStore();
  const difficultTopics = getTopicsNeedingReview(subjects);

  if (difficultTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Topics Needing Review
          </CardTitle>
          <CardDescription>Topics marked as difficult</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No difficult topics yet. Great job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <AlertCircle className="h-5 w-5" />
          Topics Needing Review
        </CardTitle>
        <CardDescription>{difficultTopics.length} topics need attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {difficultTopics.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-3 border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{topic.topicName}</p>
                  <p className="text-xs text-muted-foreground">{topic.subjectName}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {topic.difficulty}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
