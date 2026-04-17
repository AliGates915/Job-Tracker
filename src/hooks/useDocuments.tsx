import { useState, useEffect, useCallback } from "react";
import { documentsApi } from "../services/documents";

export interface Document {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: "resume" | "cover_letter";
  createdAt: string;
  updatedAt: string;
}

export const useDocuments = (userId: string | null) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided, skipping fetch");
      return;
    }
    setLoading(true);
    try {
      const { data } = await documentsApi.getAll(userId);
      setDocuments(data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const uploadDocument = async (file: File, fileType: "resume" | "cover_letter") => {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("userId", userId);
    
    try {
      const { data } = await documentsApi.upload(formData);
      setDocuments((prev) => [data.data, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error("Upload error:", err);
      return { success: false, error: err.response?.data?.message || "Upload failed" };
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentsApi.delete(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      return { success: true };
    } catch (err: any) {
      console.error("Delete error:", err);
      return { success: false, error: err.response?.data?.message || "Delete failed" };
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId, fetchDocuments]);

  return { documents, loading, error, uploadDocument, deleteDocument, refetch: fetchDocuments };
};