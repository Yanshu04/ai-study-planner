import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SubjectForm } from "@/components/SubjectForm";
import { SubjectList } from "@/components/SubjectList";
import { ScheduleView } from "@/components/ScheduleView";
import { Dashboard } from "@/components/Dashboard";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { DailyGoalsCard } from "@/components/DailyGoalsCard";
import { ExamCountdownPanel } from "@/components/ExamCountdownPanel";
import { DifficultTopicsPanel } from "@/components/DifficultTopicsPanel";
import { MotivationQuoteCard } from "@/components/MotivationQuoteCard";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import { ExportDialog } from "@/components/ExportDialog";
import { StudyCalendarView } from "@/components/StudyCalendarView";
import { QuickAddFAB } from "@/components/QuickAddFAB";
import { SmartSuggestionsPanel } from "@/components/SmartSuggestionsPanel";
import { useStudyStore } from "@/lib/store";
import { GraduationCap, CalendarDays, LayoutDashboard, BookOpen, Timer, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { dailyHours, setDailyHours, preferences } = useStudyStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState<"light" | "dark" | "system">(preferences.theme);

  // Apply theme on mount and when preferences change
  useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.toggle("dark", isDark);
      html.classList.toggle("light", !isDark);
    } else {
      html.classList.toggle("dark", theme === "dark");
      html.classList.toggle("light", theme === "light");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">AI Study Planner</h1>
              <p className="text-xs text-muted-foreground">Smart scheduling powered by ML</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Label className="text-xs text-muted-foreground">Daily hours: {dailyHours}h</Label>
              <Slider
                value={[dailyHours]}
                onValueChange={v => setDailyHours(v[0])}
                min={1}
                max={12}
                step={0.5}
                className="w-32"
              />
            </div>
            <ExportDialog />
            <PreferencesDialog />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start gap-1 bg-muted/50 p-1 overflow-x-auto">
            <TabsTrigger value="dashboard" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <BookOpen className="h-4 w-4" /> Subjects
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <CalendarDays className="h-4 w-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <BarChart3 className="h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Timer className="h-4 w-4" /> Pomodoro
            </TabsTrigger>
          </TabsList>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <TabsContent value="dashboard" className="space-y-6 mt-0">
              <MotivationQuoteCard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DailyGoalsCard />
                <ExamCountdownPanel />
              </div>
              <SmartSuggestionsPanel />
              <DifficultTopicsPanel />
              <Dashboard />
              <AchievementsPanel />
              <StudyCalendarView />
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6 mt-0">
              <SubjectForm />
              <SubjectList />
            </TabsContent>

            <TabsContent value="schedule" className="mt-0">
              <ScheduleView />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsPanel />
            </TabsContent>

            <TabsContent value="pomodoro" className="mt-0 max-w-md mx-auto">
              <PomodoroTimer />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>

      {/* Quick Add FAB */}
      <QuickAddFAB />
    </div>
  );
};

export default Index;
