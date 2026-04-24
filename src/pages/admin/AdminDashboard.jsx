// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Users, Briefcase, TrendingUp, Activity } from "lucide-react";
import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}/10`}>
        <Icon className={`h-6 w-6 text-${color}`} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    monthlyApplications: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get analytics data
      const analyticsResponse = await adminService.getAdminStats();
      
      // Get all users to count them
      const usersResponse = await authService.getAllUsers();
      
      setStats({
        totalUsers: usersResponse.users?.length || 0,
        totalApplications: analyticsResponse.totalApplications || 0,
        monthlyApplications: analyticsResponse.monthlyApplications?.reduce((sum, month) => sum + month.count, 0) || 0,
        activeUsers: usersResponse.users?.filter(u => u.isActive !== false).length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all users and applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users}
            color="primary"
          />
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplications} 
            icon={Briefcase}
            color="success"
          />
          <StatCard 
            title="Monthly Applications" 
            value={stats.monthlyApplications} 
            icon={TrendingUp}
            color="warning"
          />
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers} 
            icon={Activity}
            color="info"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;