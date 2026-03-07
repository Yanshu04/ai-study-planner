import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

export function StudyCalendarView() {
  const { performanceHistory } = useStudyStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const getStudyDataForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return performanceHistory.find(d => d.date === dateStr);
  };

  const allDays = [];
  let dayIndex = 0;
  
  // Fill in starting days from previous month
  const startDay = start.getDay();
  for (let i = 0; i < startDay; i++) {
    allDays.push(null);
  }

  // Add all days of current month
  for (const day of days) {
    allDays.push(day);
  }

  // Fill remaining spots
  while (allDays.length % 7 !== 0) {
    allDays.push(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Study Calendar
        </CardTitle>
        <CardDescription>{format(currentMonth, "MMMM yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-3 py-1 text-sm rounded-md hover:bg-muted"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm rounded-md hover:bg-muted"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-3 py-1 text-sm rounded-md hover:bg-muted"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}

            {allDays.map((day, idx) => {
              const data = day ? getStudyDataForDate(day as Date) : null;
              const isToday = day && isSameDay(day as Date, new Date());
              const isOtherMonth = !day || !isSameMonth(day as Date, currentMonth);

              return (
                <div
                  key={idx}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                    isOtherMonth
                      ? "text-muted-foreground/30"
                      : isToday
                      ? "bg-primary text-primary-foreground"
                      : data && data.hoursStudied > 0
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {day && <div>{day.getDate()}</div>}
                  {data && data.hoursStudied > 0 && (
                    <div className="text-xs">{data.hoursStudied}h</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 text-xs pt-4 border-t">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/20" />
              <span>Studied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
