export interface AnalyticsData {
  totalApplications: number;
  statusBreakdown: Array<{ _id: string; count: number }>;
  monthlyApplications: Array<{ _id: number; count: number }>;
}

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await fetch('/api/analytics');
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return response.json();
  }
};