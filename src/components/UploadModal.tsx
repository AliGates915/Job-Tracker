import { useState } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, fileType: "resume" | "cover_letter") => Promise<{ success: boolean; error?: string }>;
}

const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"resume" | "cover_letter">("resume");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    setUploading(true);
    const result = await onUpload(selectedFile, fileType);
    setUploading(false);
    if (result.success) {
      onClose();
      setSelectedFile(null);
      setFileType("resume");
      setError("");
    } else {
      setError(result.error || "Upload failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-md border border-border shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Upload Document</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="resume"
                  checked={fileType === "resume"}
                  onChange={() => setFileType("resume")}
                  className="text-primary"
                />
                <span className="text-sm">Resume</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cover_letter"
                  checked={fileType === "cover_letter"}
                  onChange={() => setFileType("cover_letter")}
                  className="text-primary"
                />
                <span className="text-sm">Cover Letter</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">File (PDF, DOC, DOCX, max 5MB)</label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
              </p>
              <input 
                id="fileInput" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading || !selectedFile}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? "Uploading..." : <><Upload className="h-4 w-4" /> Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;