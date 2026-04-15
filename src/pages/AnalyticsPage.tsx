import DashboardLayout from "@/layouts/DashboardLayout";
import { analyticsData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList } from "recharts";

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border card-shadow p-6">
    <h3 className="font-semibold text-card-foreground mb-4">{title}</h3>
    {children}
  </div>
);

const AnalyticsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize your application data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Applications">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(214, 20%, 90%)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)" }} />
                <Bar dataKey="applications" fill="hsl(225, 73%, 57%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Industry Breakdown">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analyticsData.industry} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {analyticsData.industry.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(214, 20%, 90%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {analyticsData.industry.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Application Success Rate">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.successRate} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" width={80} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(214, 20%, 90%)" }} />
                <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Interview Conversion">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.interviewConversion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(214, 20%, 90%)" }} />
                <Line type="monotone" dataKey="interviews" stroke="hsl(225, 73%, 57%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="offers" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-primary rounded" /> Interviews</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-success rounded" /> Offers</div>
          </div>
        </ChartCard>
      </div>
    </div>
  </DashboardLayout>
);

export default AnalyticsPage;
