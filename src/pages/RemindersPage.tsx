import { Calendar, Clock, AlertTriangle, MessageSquare } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { reminders } from "@/data/mockData";

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  interview: { icon: Calendar, color: "bg-warning/10 text-warning", label: "Interview" },
  followup: { icon: MessageSquare, color: "bg-info/10 text-info", label: "Follow-up" },
  deadline: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive", label: "Deadline" },
};

const RemindersPage = () => {
  const sorted = [...reminders].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-sm text-muted-foreground mt-1">Upcoming interviews, follow-ups, and deadlines</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {sorted.map((r) => {
              const config = typeConfig[r.type];
              const Icon = config.icon;
              return (
                <div key={r.id} className="relative flex gap-4 ml-0">
                  <div className={`relative z-10 w-12 h-12 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 bg-card rounded-xl border border-border card-shadow p-5 hover:card-shadow-hover transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color} mb-2`}>
                          {config.label}
                        </span>
                        <h3 className="font-semibold text-card-foreground">{r.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                        <Clock className="h-4 w-4" />
                        <span>{r.date} · {r.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RemindersPage;
