// src/services/applicationService.js
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const applicationService = {
  async getAll() {
    try {
      const token = authService.getToken();
      const user = authService.getUser();
      
      // Validate authentication
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }
      
      if (!user) {
        throw new Error('User data not found. Please login again.');
      }
      
      const userId = user.id || user._id;
      if (!userId) {
        throw new Error('User ID not found in user data.');
      }
      
      console.log('Fetching applications for user:', userId);
      
      const response = await fetch(`${API_URL}/api/applications?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch applications');
      }

      const result = await response.json();
      console.log('Raw API response:', result);
      
      // Handle both response formats:
      // 1. { success: true, data: [...] }
      // 2. [...] (direct array)
      const applications = result.data || result;
      
      // Ensure we return an array
      if (Array.isArray(applications)) {
        console.log('Applications fetched successfully:', applications.length);
        return applications;
      } else {
        console.error('Unexpected response format:', applications);
        return [];
      }
      
    } catch (error) {
      console.error('Error in getAll applications:', error);
      throw error;
    }
  },

 // applicationService.js
async create(applicationData) {
  try {
    const token = authService.getToken();
    const user = authService.getUser();
    const userId = user.id || user._id;
    
    // Prepare data for backend
    const dataToSend = {
      userId,
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