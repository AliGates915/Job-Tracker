import { notifications } from "@/data/mockData";

const NotificationPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-80 bg-card rounded-xl card-shadow-lg border border-border z-50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-card-foreground">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/30" : ""}`}>
              <div className="flex items-start gap-3">
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                <div className={!n.read ? "" : "ml-5"}>
                  <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
