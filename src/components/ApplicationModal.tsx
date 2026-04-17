import { useState, useEffect } from "react";
import { X, Upload, Trash2, FileText } from "lucide-react";
import ReminderDatePicker from "./ReminderDatePicker";
import axios from "axios";

const emptyForm = {
  company: "",
  position: "",
  jobLink: "",
  appliedDate: "",
  contactPerson: "",
  status: "Applied",
  notes: "",
  reminderDate: "",
};

const ApplicationModal = ({ open, onClose, application, onSave, userId }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState({ resume: null, cover_letter: null });
  const [existingDocs, setExistingDocs] = useState({ resume: null, cover_letter: null });
  const [uploading, setUploading] = useState({ resume: false, cover_letter: false });
  
  useEffect(() => {
    if (application) {
      setForm({
        company: application.companyName || "",
        position: application.position || "",
        jobLink: application.jobLink || "",
        appliedDate: application.appliedDate ? application.appliedDate.split('T')[0] : "",
        contactPerson: application.contactPerson || "",
        status: application.status || "Applied",
        notes: application.notes || "",
        reminderDate: application.reminderDate || "",
      });
      
      // Load existing documents
      if (application.resumeDocumentId) {
        setExistingDocs(prev => ({ ...prev, resume: application.resumeDocumentId }));
      }
      if (application.coverLetterDocumentId) {
        setExistingDocs(prev => ({ ...prev, cover_letter: application.coverLetterDocumentId }));
      }
    } else {
      setForm(emptyForm);
      setExistingDocs({ resume: null, cover_letter: null });
    }
    setDocuments({ resume: null, cover_letter: null });
  }, [application, open]);
  
  if (!open) return null;
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = async (type, file) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [type]: true }));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", type);
    formData.append("userId", userId);
    
    if (application?._id) {
      formData.append("applicationId", application._id);
    }
    
    try {
      const response = await axios.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setDocuments(prev => ({ ...prev, [type]: response.data.data }));
      setExistingDocs(prev => ({ ...prev, [type]: response.data.data }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };
  
  const handleDeleteDocument = async (type, docId) => {
    if (!docId) return;
    
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`/api/documents/${docId}`);
        setExistingDocs(prev => ({ ...prev, [type]: null }));
        setDocuments(prev => ({ ...prev, [type]: null }));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete document");
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl card-shadow-lg border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">
            {application ? "Edit Application" : "Add New Application"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Basic Fields */}
            {[
              { label: "Company Name", name: "company", type: "text", required: true },
              { label: "Position", name: "position", type: "text", required: true },
              { label: "Job Link", name: "jobLink", type: "url" },
              { label: "Date Applied", name: "appliedDate", type: "date", required: true },
              { label: "Contact Person", name: "contactPerson", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
            
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {["Applied", "Screening", "Interview", "Offer", "Rejected"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            {/* Reminder Date Picker - Only shows for Screening, Interview, Offer */}
            <ReminderDatePicker
              value={form.reminderDate}
              onChange={(date) => setForm({ ...form, reminderDate: date })}
              status={form.status}
              required={["Screening", "Interview", "Offer"].includes(form.status)}
            />
            
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            
            {/* Document Upload Section */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Documents</label>
              <div className="grid grid-cols-2 gap-4">
                {["resume", "cover_letter"].map((type) => (
                  <div key={type}>
                    <label className="block text-sm text-muted-foreground mb-1.5 capitalize">
                      {type.replace("_", " ")}
                    </label>
                    
                    {/* Show existing document if available */}
                    {existingDocs[type] && (
                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm truncate">{existingDocs[type].fileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(type, existingDocs[type]._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload new document */}
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-input hover:border-primary cursor-pointer transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploading[type] ? "Uploading..." : `Upload ${type.replace("_", " ")}`}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileChange(type, e.target.files[0])}
                        disabled={uploading[type]}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX, TXT (max 5MB)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;