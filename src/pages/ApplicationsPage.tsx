// src/pages/ApplicationsPage.jsx
import { useState, useEffect } from "react";
import { Search, Filter, Plus, ExternalLink, Edit2, Trash2, Eye, ChevronDown } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import ApplicationModal from "@/components/ApplicationModal";
import { applicationService } from "@/services/applicationService";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);

  // Fetch applications on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
  try {
    setLoading(true);
    const data = await applicationService.getAll();
    // Ensure data is an array
    setApplications(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load applications:", error);
    setApplications([]); // Set to empty array on error
  } finally {
    setLoading(false);
  }
};



  const handleSave = async (formData) => {
    try {
      if (editApp) {
        // Update existing
        await applicationService.update(editApp._id, formData);
      } else {
        // Create new
        await applicationService.create(formData);
      }
      await loadApplications(); // Refresh list
      setModalOpen(false);
      setEditApp(null);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationService.delete(id);
        await loadApplications();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Filter and sort
  const filtered = applications
    .filter((app) => {
      const matchSearch = app.companyName?.toLowerCase().includes(search.toLowerCase()) ||
                          app.position?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || app.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      if (sortBy === "company") return (a.companyName || "").localeCompare(b.companyName || "");
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} applications found</p>
          </div>
          <button
            onClick={() => { setEditApp(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add New Application
          </button>
        </div>

        {/* Filters (unchanged) */}
        <div className="bg-card rounded-xl border border-border card-shadow p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company or role..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                  {["All", "Applied", "Screening", "Interview", "Offer", "Rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-8 py-2 rounded-lg bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="company">Sort by Company</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Company", "Position", "Applied", "Status", "Contact", "Link", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No applications found</td></tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold flex-shrink-0">
                            {app.companyName?.[0] || "?"}
                          </div>
                          <span className="font-medium text-sm text-card-foreground">{app.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{app.position}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{new Date(app.appliedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{app.contactPerson}</td>
                      <td className="px-6 py-4">
                        {app.jobLink && (
                          <a href={app.jobLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Edit"
                            onClick={() => { setEditApp(app); setModalOpen(true); }}
                          >
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(app._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditApp(null); }}
        application={editApp}
        onSave={handleSave}
        userId={null} // Pass userId if needed for document uploads
      />
    </DashboardLayout>
  );
};

export default ApplicationsPage;