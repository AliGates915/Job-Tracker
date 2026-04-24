// pages/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, Trash2, User, Mail, Calendar, Briefcase, AlertCircle, X } from "lucide-react";
import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserApps, setShowUserApps] = useState(false);
  const [userApplications, setUserApplications] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}" and all their applications? This action cannot be undone.`)) {
      setDeleting(true);
      try {
        await adminService.deleteUserWithApplications(userId);
        await fetchUsers();
        alert("User and all applications deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.message || "Failed to delete user");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleViewApplications = async (userId) => {
    try {
      const response = await adminService.getUserApplications(userId);
      setUserApplications(response.data || []);
      setSelectedUser(users.find(u => u._id === userId));
      setShowUserApps(true);
    } catch (error) {
      console.error("Error fetching user applications:", error);
      alert(error.message);
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (confirm("Delete this application?")) {
      try {
        await adminService.deleteApplication(appId);
        // Refresh the applications list
        setUserApplications(userApplications.filter(a => a._id !== appId));
        alert("Application deleted successfully");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert(error.message || "Failed to delete application");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      Interview: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      Pending: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
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
          <h1 className="text-2xl font-bold text-foreground">All Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all registered users and their applications
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {user.fullName || user.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewApplications(user._id)}
                          className="p-1.5 rounded-lg hover:bg-muted text-primary transition-colors"
                          title="View Applications"
                        >
                          <Briefcase className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.fullName || user.email)}
                          disabled={deleting}
                          className="p-1.5 rounded-lg hover:bg-muted text-destructive transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>

        {/* User Applications Modal */}
        {showUserApps && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Applications - {selectedUser.fullName || selectedUser.email}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {userApplications.length} applications
                  </p>
                </div>
                <button
                  onClick={() => setShowUserApps(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                {userApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No applications found for this user</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userApplications.map((app) => (
                      <div key={app._id} className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{app.jobTitle}</h3>
                            <p className="text-sm text-muted-foreground">{app.companyName}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Applied: {new Date(app.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteApplication(app._id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;