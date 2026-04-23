// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { Briefcase, Send, Users, Award, XCircle, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { dashboardService } from "@/services/dashboardService";
import { authService } from "@/services/authService";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getUser();
      const userId = user?._id || localStorage.getItem("userId");
      
      if (!userId) {
        throw new Error("User not found");
      }
      
      const response = await dashboardService.getDashboardData(userId);
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-destructive mb-4">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentApplications, quickStats } = dashboardData || {
    stats: { total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 },
    recentApplications: [],
    quickStats: {}
  };

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
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">
                            {app.company?.[0] || "?"}
                          </div>
                          <span className="font-medium text-sm text-card-foreground">{app.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{app.position}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedDate}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No applications yet. Start by adding your first application!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <h2 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Quick Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-xl font-bold text-card-foreground mt-1">{quickStats.responseRate || 0}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Applications with updates</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="text-xl font-bold text-card-foreground mt-1">{quickStats.avgResponseTime || "0 days"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">From application to update</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Interview Rate</p>
              <p className="text-xl font-bold text-card-foreground mt-1">{quickStats.interviewRate || "0%"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stats.interviews} of {stats.total} applications</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Offer Rate</p>
              <p className="text-xl font-bold text-card-foreground mt-1">{quickStats.offerRate || "0%"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stats.offers} of {stats.interviews} interviews</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;