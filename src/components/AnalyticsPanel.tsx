import { useStudyStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { generatePerformanceData } from "@/lib/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHART_COLORS = [
  "hsl(168, 55%, 38%)",
  "hsl(35, 90%, 55%)",
  "hsl(260, 50%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 60%, 50%)",
  "hsl(142, 60%, 40%)",
];

export function AnalyticsPanel() {
  const { subjects, getStats } = useStudyStore();
  const stats = getStats();

  const performanceData = generatePerformanceData(subjects);
  
  const subjectHoursData = Object.entries(stats.hoursPerSubject).map(([name, hours]) => ({
    name,
    hours,
  }));

  const statusData = [
    { name: "Completed", value: stats.topicsCompleted },
    { name: "Remaining", value: stats.topicsTotal - stats.topicsCompleted },
  ].filter(d => d.value > 0);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analytics
        </CardTitle>
        <CardDescription>Visualize your study progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="subjects" className="text-xs">Subjects</TabsTrigger>
            <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hoursStudied" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="subjects" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="status" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
