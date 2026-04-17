import { useState } from "react";
import { FileText, Upload, Download, Trash2, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import UploadModal from "@/components/UploadModal";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";

const DocumentsPage = () => {
  const { userId, loading: authLoading } = useAuth();
  const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments(userId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
                <div className="p-2.5 rounded-xl bg-accent">
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
  );
};

export default DocumentsPage;