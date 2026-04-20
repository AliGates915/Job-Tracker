// DocumentsPage.tsx - Complete updated version
import { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, Loader2, Eye, X } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import UploadModal from "@/components/UploadModal";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const DocumentsPage = () => {
  const { userId, loading: authLoading } = useAuth();
  const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments(userId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const resumes = documents.filter((d: Document) => d.fileType === "resume");
  const coverLetters = documents.filter((d: Document) => d.fileType === "cover_letter");

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = async (document: Document) => {
    setPreviewDocument(document);
    
    // If it's a PDF, fetch it as blob
    if (document.mimeType === 'application/pdf') {
      setLoadingPdf(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/documents/proxy/${document._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        });
        
        // Create blob URL
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfUrl(null);
      } finally {
        setLoadingPdf(false);
      }
    }
  };

  const closePreview = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl); // Clean up blob URL
      setPdfUrl(null);
    }
    setPreviewDocument(null);
  };

  const DocumentPreviewModal = () => {
    if (!previewDocument) return null;
    
    const isImage = previewDocument.mimeType?.startsWith('image/');
    const isPdf = previewDocument.mimeType === 'application/pdf';
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={closePreview}
        />
        
        {/* Modal */}
        <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-card-foreground truncate">
                {previewDocument.fileName}
              </h3>
            </div>
            <button
              onClick={closePreview}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0 ml-2"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
            {loadingPdf && isPdf && (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading PDF...</span>
              </div>
            )}
            
            {isImage && (
              <div className="flex items-center justify-center min-h-[400px]">
                <img
                  src={previewDocument.fileUrl}
                  alt={previewDocument.fileName}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: 'calc(90vh - 120px)' }}
                  onError={(e) => {
                    console.error('Image load error');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {isPdf && pdfUrl && !loadingPdf && (
              <iframe
                src={pdfUrl}
                title={previewDocument.fileName}
                className="w-full rounded-lg border border-border"
                style={{ height: 'calc(90vh - 120px)' }}
              />
            )}
            
            {isPdf && !pdfUrl && !loadingPdf && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <FileText className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  Failed to load PDF preview. Please download the file to view it.
                </p>
                <button
                  onClick={() => handleDownload(previewDocument.fileUrl, previewDocument.fileName)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            )}
            
            {!isImage && !isPdf && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <FileText className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  Preview not available for this file type
                </p>
                <button
                  onClick={() => handleDownload(previewDocument.fileUrl, previewDocument.fileName)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Download File
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border bg-card">
            <div className="text-xs text-muted-foreground">
              Uploaded on {new Date(previewDocument.createdAt).toLocaleDateString()}
              {previewDocument.fileSize && ` • ${(previewDocument.fileSize / 1024 / 1024).toFixed(2)} MB`}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(previewDocument.fileUrl, previewDocument.fileName)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={closePreview}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DocSection = ({ title, docs, emptyMessage }: { title: string; docs: Document[]; emptyMessage: string }) => (
    <div>
      <h2 className="font-semibold text-foreground mb-4">{title}</h2>
      {docs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div key={doc._id} className="bg-card rounded-xl border border-border card-shadow p-5 hover:card-shadow-hover transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-accent flex-shrink-0">
                  <FileText className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-card-foreground truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => handlePreview(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-accent transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-accent transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button
                  onClick={() => deleteDocument(doc._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Show loading while checking auth
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if not authenticated
  if (!userId) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-2">Please log in to view your documents</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Documents</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your resumes and cover letters</p>
              {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Upload className="h-4 w-4" /> Upload File
            </button>
          </div>

          <DocSection title="Resumes" docs={resumes} emptyMessage="No resumes uploaded yet." />
          <DocSection title="Cover Letters" docs={coverLetters} emptyMessage="No cover letters uploaded yet." />

          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={uploadDocument}
          />
        </div>
      </DashboardLayout>

      {/* Document Preview Modal */}
      <DocumentPreviewModal />
    </>
  );
};

export default DocumentsPage;