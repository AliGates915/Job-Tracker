// frontend/src/hooks/useDocuments.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Document {
  _id: string;
  userId: string;
  applicationId?: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileType: 'resume' | 'cover_letter';
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export const useDocuments = (userId: string | null) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // frontend/src/hooks/useDocuments.ts
const fetchDocuments = async () => {
  if (!userId) {
    setDocuments([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const response = await axios.get(`${API_URL}/api/documents?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response:', response.data);
    
    const documentsData = response.data.data || response.data;
    setDocuments(Array.isArray(documentsData) ? documentsData : []);
    setError(null);
  } catch (err: any) {
    console.error('Error fetching documents:', err);
    console.error('Error response:', err.response);
    setError(err.response?.data?.message || 'Failed to load documents');
  } finally {
    setLoading(false);
  }
};


  const uploadDocument = async (file: File, fileType: 'resume' | 'cover_letter') => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('userId', userId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      await fetchDocuments(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      console.error('Error uploading document:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Upload failed'
      };
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await fetchDocuments(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting document:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Delete failed'
      };
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
  };
};