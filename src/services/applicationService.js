// src/services/applicationService.js
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const applicationService = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/applications`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    // console.log('Applications:', response);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async create(data) {
    // Map frontend field 'company' to backend 'companyName'
    const payload = {
      companyName: data.company,
      position: data.position,
      jobLink: data.jobLink,
      appliedDate: data.appliedDate,
      status: data.status,
      contactPerson: data.contactPerson,
      notes: data.notes,
    };
    const response = await fetch(`${API_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to create application');
    return response.json();
  },

  async update(id, data) {
    const payload = {
      companyName: data.company,
      position: data.position,
      jobLink: data.jobLink,
      appliedDate: data.appliedDate,
      status: data.status,
      contactPerson: data.contactPerson,
      notes: data.notes,
    };
    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update application');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete application');
    return response.json();
  }
};