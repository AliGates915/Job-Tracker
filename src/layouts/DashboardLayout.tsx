import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, FileText, BarChart3, Bell, User, Settings, LogOut, Menu, X, Search, ChevronDown, Clock,
} from "lucide-react";
import NotificationPanel from "@/components/NotificationPanel";
import { notificationService } from "@/services/notificationService";
import { authService } from "@/services/authService";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Applications", icon: Briefcase, path: "/applications" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Reminders", icon: Clock, path: "/reminders" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  
  // Get user data from auth service
  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  // Get user ID from user data or localStorage
  const userId = user?._id || localStorage.getItem("userId") || "69dfd8c8689cf343da30f2cd";

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "JD";
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "JD";
  };

  // Get user display name
  const getUserName = () => {
    if (!user) return "John Doe";
    return user.fullName || user.name || user.email?.split("@")[0] || "User";
  };

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getNotifications(userId, true);
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-accent-foreground text-lg">JobTracker</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="p-2 rounded-lg hover:bg-muted relative transition-colors"
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
                )}
              </button>
              <NotificationPanel 
                open={notifOpen} 
                onClose={() => setNotifOpen(false)}
                userId={userId}
                onNotificationCountChange={setUnreadCount}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  {getUserName()}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 w-48 bg-card rounded-xl card-shadow-lg border border-border z-50 overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{getUserName()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email || ""}</p>
                    </div>
                    {/* <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setProfileOpen(false)}>Profile</Link> */}
                    <Link to="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setProfileOpen(false)}>Settings</Link>
                    <hr className="my-1 border-border" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;