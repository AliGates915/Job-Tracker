import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { User, Bell, Shield, Palette, Mail } from "lucide-react";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: ""
  });

  useEffect(() => {
    // Get user data from auth service
    const userData = authService.getUser();
    setUser(userData);
    if (userData) {
      setProfileData({
        fullName: userData.fullName || userData.name || "",
        phone: userData.phone || ""
      });
    }

    // Fetch notification settings
    if (userData?._id) {
      fetchNotificationSettings(userData._id);
      fetchEmailNotificationStatus(userData._id);
    }
  }, []);

  const fetchNotificationSettings = async (userId: string) => {
    try {
      const response = await notificationService.getNotificationSettings(userId);
      if (response.success) {
        setNotificationsEnabled(response.data.notificationsEnabled);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  const fetchEmailNotificationStatus = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/reminders/users/${userId}/email-notifications`);
      if (response.data.success) {
        setEmailNotifications(response.data.data.emailNotificationsEnabled);
      }
    } catch (error) {
      console.error("Error fetching email notification status:", error);
    }
  };

  const handleToggleEmailNotifications = async (enabled: boolean) => {
    if (!user?._id) return;

    setEmailSaving(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/reminders/users/${user._id}/email-notifications`,
        { enabled }
      );
      
      if (response.data.success) {
        setEmailNotifications(enabled);
        // Show success message
        const message = enabled 
          ? "Email notifications enabled successfully" 
          : "Email notifications disabled successfully";
        // You can add a toast notification here if you have one
        console.log(message);
      }
    } catch (error: any) {
      console.error("Error toggling email notifications:", error);
      alert(error.response?.data?.message || "Failed to update email notification settings");
    } finally {
      setEmailSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Here you would call your API to update user profile
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await notificationService.toggleNotifications(user._id, enabled);
      if (response.success) {
        setNotificationsEnabled(enabled);
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const userId = user?._id || localStorage.getItem("userId");

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <User className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your email"
                disabled
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your phone number"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Email Notification Section - NEW */}
        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <Mail className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Email Notifications</h2>
              <p className="text-xs text-muted-foreground">Control email reminders for your job applications</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <div>
                <span className="text-sm text-card-foreground font-medium">Email Reminders</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receive email notifications for interview schedules, follow-ups, and application deadlines
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">• Interview reminders</p>
                  <p className="text-xs text-muted-foreground">• Follow-up notifications</p>
                  <p className="text-xs text-muted-foreground">• Application deadline alerts</p>
                  <p className="text-xs text-muted-foreground">• Status update notifications</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleEmailNotifications(!emailNotifications)}
                disabled={emailSaving}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  emailNotifications ? "bg-primary" : "bg-muted"
                } ${emailSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    emailNotifications ? "right-1" : "left-1"
                  }`} 
                />
              </button>
            </label>
            
            {emailSaving && (
              <div className="text-xs text-muted-foreground text-center">
                Updating email preferences...
              </div>
            )}
            
            {!emailNotifications && (
              <div className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Email notifications are currently disabled. You won't receive email reminders about your job applications.
                </p>
              </div>
            )}
            
            {emailNotifications && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-800 dark:text-green-300">
                  ✅ Email notifications are enabled. You'll receive timely reminders about your job applications.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* In-App Notification Preferences Section */}
        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">In-App Notifications</h2>
              <p className="text-xs text-muted-foreground">Configure in-app notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <div>
                <span className="text-sm text-card-foreground">Push Notifications</span>
                <p className="text-xs text-muted-foreground">Receive notifications within the app</p>
              </div>
              <button
                onClick={() => handleToggleNotifications(!notificationsEnabled)}
                disabled={loading}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    notificationsEnabled ? "right-1" : "left-1"
                  }`} 
                />
              </button>
            </label>

            </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <Palette className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground">Customize your theme preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-sm text-card-foreground">Dark mode</span>
              <div className="relative w-11 h-6 rounded-full bg-muted">
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;