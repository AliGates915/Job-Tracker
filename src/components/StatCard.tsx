import { LucideIcon } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: LucideIcon; color: string }) => {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
  };

  return (
    <div className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-shadow border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-card-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.primary}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
