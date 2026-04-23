const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
};