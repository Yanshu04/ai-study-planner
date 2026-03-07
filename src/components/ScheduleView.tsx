import { useStudyStore } from "@/lib/store";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";

export function ScheduleView() {
  const { schedule, subjects } = useStudyStore();

  if (schedule.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-display text-lg">No schedule generated</p>
        <p className="text-sm">Add subjects and topics to generate your study plan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.slice(0, 14).map((day, idx) => {
        const dateObj = new Date(day.date + "T00:00:00");
        const isToday = day.date === new Date().toISOString().split("T")[0];
        
        return (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`rounded-lg border p-4 ${isToday ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isToday && <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />}
                <h4 className="font-display font-semibold text-foreground">
                  {dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </h4>
                {isToday && <span className="text-xs font-medium text-primary">Today</span>}
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {day.totalHours}h total
              </span>
            </div>

            <div className="space-y-2">
              {day.sessions.map((session, si) => (
                <div key={si} className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2">
                  <div className="h-8 w-1 rounded-full" style={{ backgroundColor: session.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{session.subjectName}</p>
                    {session.topicName && (
                      <p className="text-xs text-muted-foreground truncate">{session.topicName}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{session.hours}h</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
