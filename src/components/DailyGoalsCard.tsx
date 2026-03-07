import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Target, Plus, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function DailyGoalsCard() {
  const { getDailyGoal, setDailyGoal } = useStudyStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const goal = getDailyGoal(today);
  const [inputValue, setInputValue] = useState(goal?.targetHours.toString() || "");

  const handleSetGoal = () => {
    const hours = parseFloat(inputValue);
    if (hours > 0) {
      setDailyGoal(today, hours);
      setInputValue("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Today's Goal
        </CardTitle>
        <CardDescription>Set and track your daily study target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {goal ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Target: {goal.targetHours}h</span>
                {goal.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (goal.hoursLogged / goal.targetHours) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{goal.hoursLogged}h / {goal.targetHours}h logged</p>
            </motion.div>
          ) : (
            <p className="text-sm text-muted-foreground">No goal set for today</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Hours"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            step="0.5"
          />
          <Button onClick={handleSetGoal} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
