import { useState } from "react";
import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Sun, Monitor } from "lucide-react";

export function PreferencesDialog() {
  const { preferences, setPreferences } = useStudyStore();
  const [theme, setTheme] = useState(preferences.theme);
  const [workMinutes, setWorkMinutes] = useState(preferences.pomodoroWorkMinutes);
  const [breakMinutes, setBreakMinutes] = useState(preferences.pomodoroBreakMinutes);

  const handleSave = () => {
    setPreferences({
      theme: theme as "light" | "dark" | "system",
      pomodoroWorkMinutes: workMinutes,
      pomodoroBreakMinutes: breakMinutes,
      enableNotifications: preferences.enableNotifications,
      enableBreakAlerts: preferences.enableBreakAlerts,
      enableExamWarning: preferences.enableExamWarning,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>Customize your study experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t)}
                  className="gap-2"
                >
                  {t === "light" && <Sun className="h-4 w-4" />}
                  {t === "dark" && <Moon className="h-4 w-4" />}
                  {t === "system" && <Monitor className="h-4 w-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Pomodoro Settings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pomodoro Timer</Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Work Session</span>
                <span className="font-semibold">{workMinutes}min</span>
              </div>
              <Slider
                value={[workMinutes]}
                onValueChange={(v) => setWorkMinutes(v[0])}
                min={5}
                max={60}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Break Duration</span>
                <span className="font-semibold">{breakMinutes}min</span>
              </div>
              <Slider
                value={[breakMinutes]}
                onValueChange={(v) => setBreakMinutes(v[0])}
                min={1}
                max={30}
                step={1}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Notifications</Label>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Notifications</span>
              <Switch
                checked={preferences.enableNotifications}
                onCheckedChange={(checked) => setPreferences({ enableNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Break Time Alerts</span>
              <Switch
                checked={preferences.enableBreakAlerts}
                onCheckedChange={(checked) => setPreferences({ enableBreakAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Exam Warning</span>
              <Switch
                checked={preferences.enableExamWarning}
                onCheckedChange={(checked) => setPreferences({ enableExamWarning: checked })}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
