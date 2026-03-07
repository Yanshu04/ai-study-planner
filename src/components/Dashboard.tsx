import { useStudyStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Clock, Target, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { predictStudyHours } from "@/lib/scheduler";

const CHART_COLORS = [
  "hsl(168, 55%, 38%)",
  "hsl(35, 90%, 55%)",
  "hsl(260, 50%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 60%, 50%)",
  "hsl(142, 60%, 40%)",
];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { subjects, getStats } = useStudyStore();
  const stats = getStats();

  const subjectData = subjects.map(s => ({
    name: s.name,
    hours: s.topics.reduce((sum, t) => sum + t.hoursStudied, 0),
    remaining: s.topics.filter(t => t.status !== "completed").length,
    color: s.color,
  }));

  const statusData = [
    { name: "Completed", value: stats.topicsCompleted, color: "hsl(142, 60%, 40%)" },
    { name: "Remaining", value: stats.topicsTotal - stats.topicsCompleted, color: "hsl(220, 13%, 88%)" },
  ].filter(d => d.value > 0);

  // ML predictions
  const predictions = subjects.map(s => {
    const daysLeft = Math.ceil((new Date(s.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const remaining = s.topics.filter(t => t.status !== "completed").length;
    const hoursStudied = s.topics.reduce((sum, t) => sum + t.hoursStudied, 0);
    const estimatedScore = Math.min(100, Math.round(50 + hoursStudied * 3 - s.difficulty * 5));
    return {
      name: s.name,
      recommended: predictStudyHours(s.difficulty, remaining, estimatedScore, daysLeft),
      color: s.color,
    };
  });

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-display text-lg">No data yet</p>
        <p className="text-sm">Add subjects and log study hours to see your dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Clock} label="Hours Studied" value={stats.totalHoursStudied} color="bg-primary/15 text-primary" />
        <StatCard icon={Target} label="Completion" value={`${stats.completionPercentage}%`} color="bg-success/15 text-success" />
        <StatCard icon={BookOpen} label="Topics Done" value={`${stats.topicsCompleted}/${stats.topicsTotal}`} color="bg-accent/15 text-accent" />
        <StatCard icon={Flame} label="Streak" value={`${stats.currentStreak}d`} color="bg-secondary/15 text-secondary" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Study Hours Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold text-foreground mb-4">Study Hours by Subject</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {subjectData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Pie */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-display font-semibold text-foreground mb-4">Overall Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            {statusData.map(d => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ML Predictions */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display font-semibold text-foreground mb-1">🤖 AI Recommended Daily Hours</h3>
        <p className="text-xs text-muted-foreground mb-4">Based on difficulty, remaining topics, and estimated performance</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map(p => (
            <div key={p.name} className="flex items-center gap-3 rounded-md bg-muted/40 px-4 py-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
              </div>
              <span className="text-lg font-display font-bold text-primary">{p.recommended}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
