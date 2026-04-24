// pages/admin/AdminApplications.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, Trash2, Building2, Briefcase, Calendar, User, Filter } from "lucide-react";
import { adminService } from "@/services/adminService";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await adminService.getAllApplications();
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await adminService.deleteApplication(id);
        await fetchApplications();
        alert("Application deleted successfully");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application");
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Applied: "bg-blue-100 text-blue-800",
      Interview: "bg-orange-100 text-orange-800",
      Offer: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Pending: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-2xl font-bold text-foreground">All Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all job applications across all users
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job title, company, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <div key={app._id} className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{app.jobTitle}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{app.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteApplication(app._id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{app.userId?.fullName || app.userId?.email || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                {app.location && (
                  <span className="text-xs text-muted-foreground">{app.location}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No applications found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminApplications;