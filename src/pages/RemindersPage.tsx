// frontend/src/pages/RemindersPage.tsx
import { useState, useEffect } from "react";
import { Calendar, Clock, AlertTriangle, MessageSquare, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  reminderDate: string;
  type: string;
  applicationId: {
    companyName: string;
    position: string;
    status: string;
  };
  status: string;
  emailSent: boolean;
}

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  interview: { icon: Calendar, color: "bg-warning/10 text-warning", label: "Interview" },
  "follow-up": { icon: MessageSquare, color: "bg-info/10 text-info", label: "Follow-up" },
  deadline: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive", label: "Deadline" },
};

const RemindersPage = () => {
  const { userId, token } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/reminders?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const remindersData = response.data.data || response.data;
      setReminders(Array.isArray(remindersData) ? remindersData : []);
    } catch (err: any) {
      console.error('Error fetching reminders:', err);
      setError(err.response?.data?.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upcoming interviews, follow-ups, and deadlines
          </p>
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>

        {sortedReminders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No reminders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Reminders will appear when you add applications with Screening, Interview, or Offer status
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {sortedReminders.map((reminder) => {
                const config = typeConfig[reminder.type] || typeConfig["follow-up"];
                const Icon = config.icon;
                return (
                  <div key={reminder._id} className="relative flex gap-4 ml-0">
                    <div className={`relative z-10 w-12 h-12 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 bg-card rounded-xl border border-border card-shadow p-5 hover:card-shadow-hover transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color} mb-2`}>
                            {config.label}
                          </span>
                          <h3 className="font-semibold text-card-foreground">{reminder.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                          {reminder.applicationId && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {reminder.applicationId.companyName} - {reminder.applicationId.position}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(reminder.reminderDate)} at {formatTime(reminder.reminderDate)}</span>
                          </div>
                          {reminder.emailSent && (
                            <span className="text-xs text-green-600">Email sent ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RemindersPage;