import { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Settings, BellOff } from "lucide-react";
import { notificationService } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onNotificationCountChange?: (count: number) => void;
}

const NotificationPanel = ({ open, onClose, userId, onNotificationCountChange }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (open && userId) {
      fetchNotifications();
    }
  }, [open, userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(userId);
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
        if (onNotificationCountChange) {
          onNotificationCountChange(response.unreadCount);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId, userId);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId, userId);
      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "interview":
        return "🎯";
      case "follow-up":
        return "📌";
      case "deadline":
        return "⏰";
      default:
        return "📢";
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-96 bg-card rounded-xl card-shadow-lg border border-border z-50 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {unreadCount} new
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => {/* Navigate to settings */}}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Notification settings"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`group p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                  !notification.read ? "bg-accent/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium text-card-foreground ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 rounded hover:bg-muted"
                            title="Mark as read"
                          >
                            <CheckCheck className="h-3 w-3 text-muted-foreground" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-1 rounded hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;