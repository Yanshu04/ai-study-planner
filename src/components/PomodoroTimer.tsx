import { useState, useEffect, useCallback } from "react";
import { useStudyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { sendBrowserNotification, requestNotificationPermission } from "@/lib/helpers";

export function PomodoroTimer() {
  const { preferences } = useStudyStore();
  const workMinutes = preferences.pomodoroWorkMinutes;
  const breakMinutes = preferences.pomodoroBreakMinutes;

  const [seconds, setSeconds] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const totalSeconds = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  useEffect(() => {
    setSeconds(isBreak ? breakMinutes * 60 : workMinutes * 60);
  }, [workMinutes, breakMinutes, isBreak]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (!isBreak) {
            setSessionsCompleted(s => s + 1);
            if (preferences.enableNotifications) {
              sendBrowserNotification("Focus Session Complete! 🎉", {
                body: "Take a break and recharge!",
                icon: "/graduation-cap.svg",
              });
            }
            setIsBreak(true);
            return breakMinutes * 60;
          } else {
            if (preferences.enableBreakAlerts) {
              sendBrowserNotification("Break Time Over! ⏰", {
                body: "Time to focus again!",
                icon: "/graduation-cap.svg",
              });
            }
            setIsBreak(false);
            return workMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak, workMinutes, breakMinutes, preferences.enableNotifications, preferences.enableBreakAlerts]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(workMinutes * 60);
  }, [workMinutes]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-6 shadow-sm text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        {isBreak ? <Coffee className="h-5 w-5 text-secondary" /> : <Play className="h-5 w-5 text-primary" />}
        <h3 className="font-display font-semibold text-foreground">
          {isBreak ? "Break Time" : "Focus Session"}
        </h3>
      </div>

      {/* Circular progress */}
      <div className="relative mx-auto mb-6 h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={isBreak ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-bold text-foreground tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{sessionsCompleted} sessions</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "outline" : "default"}
          size="lg"
          className="gap-2"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={reset} variant="ghost" size="lg">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
