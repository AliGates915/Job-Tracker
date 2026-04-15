const statusStyles: Record<string, string> = {
  Applied: "bg-accent text-accent-foreground",
  Screening: "bg-info/10 text-info",
  Interview: "bg-warning/10 text-warning",
  Offer: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
    {status}
  </span>
);

export default StatusBadge;
