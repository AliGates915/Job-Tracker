import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Loader2 } from "lucide-react";

// Types for analytics data
interface StatusBreakdown {
  _id: string;
  count: number;
}

interface MonthlyApplication {
  _id: number;
  count: number;
}

interface AnalyticsData {
  totalApplications: number;
  statusBreakdown: StatusBreakdown[];
  monthlyApplications: MonthlyApplication[];
}

const COLORS = {
  Applied: "hsl(225, 73%, 57%)",
  Interview: "hsl(40, 96%, 48%)",
  Offer: "hsl(142, 71%, 45%)",
  Rejected: "hsl(0, 84%, 60%)",
  Pending: "hsl(271, 81%, 56%)",
};

const statusColors: Record<string, string> = {
  Applied: "hsl(225, 73%, 57%)",    // Blue
  Interview: "hsl(40, 96%, 48%)",   // Orange
  Offer: "hsl(142, 71%, 45%)",      // Green
  Rejected: "hsl(0, 84%, 60%)",     // Red
  Pending: "hsl(271, 81%, 56%)",    // Purple
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ChartCard = ({ title, children, isLoading = false }: { title: string; children: React.ReactNode; isLoading?: boolean }) => (
  <div className="bg-card rounded-xl border border-border card-shadow p-6">
    <h3 className="font-semibold text-card-foreground mb-4">{title}</h3>
    {isLoading ? (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ) : (
      children
    )}
  </div>
);

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/analytics`);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for monthly applications chart
  const getMonthlyChartData = () => {
    if (!analyticsData?.monthlyApplications) return [];
    
    return analyticsData.monthlyApplications.map(item => ({
      month: monthNames[item._id - 1] || `Month ${item._id}`,
      applications: item.count,
    }));
  };

  // Transform data for status breakdown pie chart
  const getStatusBreakdownData = () => {
    if (!analyticsData?.statusBreakdown) return [];
    
    return analyticsData.statusBreakdown.map(item => ({
      name: item._id,
      value: item.count,
      fill: statusColors[item._id] || COLORS.Applied,
    }));
  };

  // Calculate success rate data (applications -> interviews -> offers)
  const getSuccessRateData = () => {
    if (!analyticsData?.statusBreakdown) return [];
    
    const applied = analyticsData.statusBreakdown.find(s => s._id === "Applied")?.count || 0;
    const interviews = analyticsData.statusBreakdown.find(s => s._id === "Interview")?.count || 0;
    const offers = analyticsData.statusBreakdown.find(s => s._id === "Offer")?.count || 0;
    
    return [
      { stage: "Applied", count: applied },
      { stage: "Interview", count: interviews },
      { stage: "Offer", count: offers },
    ];
  };

  // Get interview conversion rate
  const getInterviewConversionRate = () => {
    if (!analyticsData?.statusBreakdown) return 0;
    
    const applied = analyticsData.statusBreakdown.find(s => s._id === "Applied")?.count || 0;
    const interviews = analyticsData.statusBreakdown.find(s => s._id === "Interview")?.count || 0;
    
    return applied > 0 ? ((interviews / applied) * 100).toFixed(1) : 0;
  };

  // Get offer conversion rate
const getOfferConversionRate = () => {
  if (!analyticsData?.statusBreakdown) return 0;
  
  const interviews = analyticsData.statusBreakdown.find(s => s._id === "Interview")?.count || 0;
  const offers = analyticsData.statusBreakdown.find(s => s._id === "Offer")?.count || 0;
  
  // Make sure we're comparing numbers and not exceeding 100%
  if (interviews === 0) return 0;
  
  const rate = (offers / interviews) * 100;
  // Cap at 100% and round to 1 decimal
  return Math.min(rate, 100).toFixed(1);
};

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
            <button 
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize your application data
            {analyticsData && (
              <span className="ml-2 text-xs">
                • Total: {analyticsData.totalApplications} applications
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Applications Chart */}
          <ChartCard title="Monthly Applications" isLoading={loading}>
            {analyticsData && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMonthlyChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "0.75rem", 
                        border: "1px solid hsl(214, 20%, 90%)",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)" 
                      }} 
                    />
                    <Bar dataKey="applications" fill="hsl(225, 73%, 57%)" radius={[6, 6, 0, 0]}>
                      {/* <LabelList dataKey="applications" position="top" /> */}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          {/* Status Breakdown Pie Chart */}
          <ChartCard title="Application Status Breakdown" isLoading={loading}>
            {analyticsData && (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={getStatusBreakdownData()} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={90} 
                        paddingAngle={4} 
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {getStatusBreakdownData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "0.75rem", 
                          border: "1px solid hsl(214, 20%, 90%)" 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {getStatusBreakdownData().map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>

          {/* Success Rate/Funnel Chart */}
          <ChartCard title="Application Success Rate" isLoading={loading}>
            {analyticsData && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getSuccessRateData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "0.75rem", 
                        border: "1px solid hsl(214, 20%, 90%)" 
                      }} 
                    />
                    <Bar dataKey="count" fill="hsl(142, 71%, 45%)" radius={[0, 6, 6, 0]}>
                      {/* <LabelList dataKey="count" position="right" /> */}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          {/* Conversion Rates Card */}
          <ChartCard title="Conversion Rates" isLoading={loading}>
            {analyticsData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {getInterviewConversionRate()}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Application → Interview Rate
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${getInterviewConversionRate()}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {getOfferConversionRate()}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Interview → Offer Rate
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all" 
                      style={{ width: `${getOfferConversionRate()}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
                  Based on {analyticsData.totalApplications} total applications
                </div>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;