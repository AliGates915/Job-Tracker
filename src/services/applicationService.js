// src/services/applicationService.js
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const applicationService = {
  async getAll() {
    try {
      const token = authService.getToken();

      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch applications');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error in getAll applications:', error);
      throw error;
    }
  },

  async create(applicationData) {
    try {
      const token = authService.getToken();

      // Don't send userId - backend will get it from token
      const dataToSend = {
        companyName: applicationData.company,
        position: applicationData.position,
        jobLink: applicationData.jobLink,
        appliedDate: applicationData.appliedDate,
        contactPerson: applicationData.contactPerson,
        status: applicationData.status,
        notes: applicationData.notes,
        reminderDate: applicationData.reminderDate,
        resumeDocumentId: applicationData.resumeDocumentId,
        coverLetterDocumentId: applicationData.coverLetterDocumentId,
      };

      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create application');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error in create application:', error);
      throw error;
    }
  },

  async update(id, applicationData) {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update application');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error in update application:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete application');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in delete application:', error);
      throw error;
    }
  }
};