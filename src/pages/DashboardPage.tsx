import { Briefcase, Send, Users, Award, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { stats, applications } from "@/data/mockData";

const DashboardPage = () => {
  const recentApps = applications.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your job application progress</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Applications" value={stats.total} icon={Briefcase} color="primary" />
          <StatCard title="Applied" value={stats.applied} icon={Send} color="info" />
          <StatCard title="Interviews" value={stats.interviews} icon={Users} color="warning" />
          <StatCard title="Offers" value={stats.offers} icon={Award} color="success" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="destructive" />
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-card-foreground">Recent Applications</h2>
            <a href="/applications" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Company", "Position", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">
                          {app.company[0]}
                        </div>
                        <span className="font-medium text-sm text-card-foreground">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.position}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedDate}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <h2 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Quick Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Response Rate", value: "68%", sub: "+5% this month" },
              { label: "Avg. Response Time", value: "4.2 days", sub: "Faster than avg" },
              { label: "Interview Rate", value: "26%", sub: "12 of 47 apps" },
              { label: "Offer Rate", value: "42%", sub: "5 of 12 interviews" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-card-foreground mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
