// services/adminService.js
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const adminFetch = async (url, options = {}) => {
  const token = authService.getToken();
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Admin access required');
    }
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
};

export const adminService = {
  // Get all applications across all users
  async getAllApplications() {
    const data = await adminFetch('/api/admin/applications', {
      method: 'GET',
    });
    return data;
  },

  // Delete any application by ID
  async deleteApplication(applicationId) {
    const data = await adminFetch(`/api/admin/applications/${applicationId}`, {
      method: 'DELETE',
    });
    return data;
  },

  // Get all applications for a specific user
  async getUserApplications(userId) {
    const data = await adminFetch(`/api/admin/users/${userId}/applications`, {
      method: 'GET',
    });
    return data;
  },

  // Delete user and all their applications
  async deleteUserWithApplications(userId) {
    const data = await adminFetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    return data;
  },

  // Get admin statistics (uses analytics endpoint)
  async getAdminStats() {
    const data = await adminFetch('/api/analytics', {
      method: 'GET',
    });
    return data;
  },
};