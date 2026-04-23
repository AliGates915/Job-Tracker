// services/notificationService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const notificationService = {
  // Get user notifications
  getNotifications: async (userId, unreadOnly = false) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        params: { userId, unreadOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId, userId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notifications/${notificationId}/read`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notifications/read-all`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId, userId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
        data: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Toggle in-app notifications on/off
  toggleNotifications: async (userId, enabled) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notifications/settings/${userId}/toggle`, { enabled });
      return response.data;
    } catch (error) {
      console.error('Error toggling notifications:', error);
      throw error;
    }
  },

  // Get in-app notification settings
  getNotificationSettings: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/settings/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // NEW: Toggle email notifications
  toggleEmailNotifications: async (userId, enabled) => {
    try {
      const response = await axios.put(`${API_URL}/api/reminders/users/${userId}/email-notifications`, { enabled });
      return response.data;
    } catch (error) {
      console.error('Error toggling email notifications:', error);
      throw error;
    }
  },

  // NEW: Get email notification status
  getEmailNotificationStatus: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/reminders/users/${userId}/email-notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email notification status:', error);
      throw error;
    }
  }
};