  import { useState, useEffect } from "react";
  import { X } from "lucide-react";
  import ReminderDatePicker from "../components/ReminderDatePicker";
  import axios from "axios";
  import UploadModal from "./UploadModal";

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
    const [existingDocs, setExistingDocs] = useState({ resume: null, cover_letter: null });
    const [uploadModalOpen, setUploadModalOpen] = useState(false); // ✅ control UploadModal

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
      } else {
        setForm(emptyForm);
        setExistingDocs({ resume: null, cover_letter: null });
      }
    }, [application, open]);

    if (!open) return null;

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ This is the onUpload handler passed into UploadModal
    const handleUpload = async (file, fileType) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);
      formData.append("userId", userId);

      if (application?._id) {
        formData.append("applicationId", application._id);
      }

      try {
        
        return { success: true };
      } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Failed to upload document" };
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

              <ReminderDatePicker
                value={form.reminderDate}
                onChange={(date) => setForm({ ...form, reminderDate: date })}
                status={form.status}
                required={["Screening", "Interview", "Offer", "Applied"].includes(form.status)}
              />

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

              {/* ✅ Document upload section */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">Documents</label>

                {/* Show uploaded doc names if any */}
                {existingDocs.resume && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Resume: {existingDocs.resume.fileName || "Uploaded"}
                  </p>
                )}
                {existingDocs.cover_letter && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Cover Letter: {existingDocs.cover_letter.fileName || "Uploaded"}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setUploadModalOpen(true)}
                  className="mt-1 px-4 py-2 rounded-lg text-sm font-medium border border-input hover:bg-muted transition-colors"
                >
                  Upload Resume / Cover Letter
                </button>
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

        {/* ✅ UploadModal with all required props */}
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    );
  };

  export default ApplicationModal;
