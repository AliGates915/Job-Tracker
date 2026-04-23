// frontend/src/services/dashboardService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const dashboardService = {
  // Get all dashboard data
  getDashboardData: async (userId) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get only statistics
  getStats: async (userId) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Get recent applications
  getRecentApplications: async (userId, limit = 5) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      throw error;
    }
  },

  // Get quick stats
  getQuickStats: async (userId) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}/quick-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  },

  // Get monthly trends
  getTrends: async (userId) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}/trends`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  // Get status distribution
  getStatusDistribution: async (userId) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${userId}/distribution`);
      return response.data;
    } catch (error) {
      console.error('Error fetching status distribution:', error);
      throw error;
    }
  }
};