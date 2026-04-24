// services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for authenticated fetch requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = '/';
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      // Store complete user data
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user._id || data.user.id);
    }

    return data;
  },

  async register(fullName, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user._id || data.user.id);
    }

    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  },

  getToken() {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token ? `${token.substring(0, 20)}...` : 'No token');
    return token;
  },
  
  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      console.log('Retrieved user:', user);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  // Get current user profile
  async getProfile() {
    return await authFetch('/api/auth/profile', {
      method: 'GET',
    });
  },

  // Update user profile
  async updateProfile(profileData) {
    const data = await authFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    if (data.user) {
      // Update stored user data
      const currentUser = this.getUser();
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return data;
  },

  // Admin: Get all users
  async getAllUsers() {
    const data = await authFetch('/api/auth/users', {
      method: 'GET',
    });
    return data;
  },

  // Admin: Update user role
  async updateUserRole(userId, role) {
    const data = await authFetch(`/api/auth/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return data;
  },

  // Admin: Delete user
  async deleteUser(userId) {
    const data = await authFetch(`/api/auth/users/${userId}`, {
      method: 'DELETE',
    });
    return data;
  },
};