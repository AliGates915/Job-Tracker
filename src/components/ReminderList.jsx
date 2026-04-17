import { useState, useEffect } from "react";
import { Bell, Calendar, Clock, Mail, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const ReminderList = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);
  
  const fetchReminders = async () => {
    try {
      const response = await axios.get(`/api/reminders?userId=${userId}`);
      setReminders(response.data.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getTypeIcon = (type) => {
    switch (type) {
      case "interview":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "follow-up":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "deadline":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEmailStatusIcon = (reminder) => {
    if (reminder.emailSent) {
      return <CheckCircle className="h-4 w-4 text-green-500" title="Email sent" />;
    } else if (reminder.status === "failed") {
      return <XCircle className="h-4 w-4 text-red-500" title="Email failed" />;
    } else {
      return <Mail className="h-4 w-4 text-gray-400" title="Email pending" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">No Reminders</h3>
        <p className="text-muted-foreground">
          When you schedule interviews or follow-ups, they'll appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Upcoming Reminders</h2>
        <div className="text-sm text-muted-foreground">
          {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}
        </div>
      </div>
      
      {reminders.map((reminder) => (
        <div
          key={reminder._id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getTypeIcon(reminder.type)}
              <div>
                <h3 className="font-medium text-card-foreground">{reminder.title}</h3>
                {reminder.description && (
                  <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(reminder.reminderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(reminder.reminderDate).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getEmailStatusIcon(reminder)}
                    <span className="text-xs text-muted-foreground">
                      {reminder.emailSent ? "Email sent" : reminder.status === "failed" ? "Failed" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {reminder.applicationId && (
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">
                  {reminder.applicationId.companyName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {reminder.applicationId.position}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1
                  ${reminder.applicationId.status === "Interview" ? "bg-blue-100 text-blue-700" :
                    reminder.applicationId.status === "Offer" ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"}`}>
                  {reminder.applicationId.status}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderList;