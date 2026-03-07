import { useState } from "react";
import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame, Target, Book } from "lucide-react";

export function AchievementsPanel() {
  const { getAchievements } = useStudyStore();
  const achievements = getAchievements();
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  const iconMap: Record<string, React.ReactNode> = {
    "🎯": <Target className="h-6 w-6" />,
    "💯": <Star className="h-6 w-6" />,
    "🔥": <Flame className="h-6 w-6" />,
    "🏆": <Trophy className="h-6 w-6" />,
    "✨": <Zap className="h-6 w-6" />,
    "🦉": <Book className="h-6 w-6" />,
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
        <CardDescription>{unlockedCount} of {achievements.length} unlocked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg border p-3 text-center transition-all ${
                achievement.unlockedAt
                  ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-950"
                  : "border-muted bg-muted/50 opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className="text-xs font-medium">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              {achievement.unlockedAt && (
                <Badge variant="secondary" className="mt-2 text-xs">Unlocked</Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
