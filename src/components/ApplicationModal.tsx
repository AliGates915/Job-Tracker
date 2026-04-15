// src/components/ApplicationModal.jsx
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

const emptyForm = {
  company: "",
  position: "",
  jobLink: "",
  appliedDate: "",
  contactPerson: "",
  status: "Applied",
  notes: "",
};

const ApplicationModal = ({ open, onClose, application, onSave }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
      });
    } else {
      setForm(emptyForm);
    }
  }, [application, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
              { label: "Company Name", name: "company", type: "text" },
              { label: "Position", name: "position", type: "text" },
              { label: "Job Link", name: "jobLink", type: "url" },
              { label: "Date Applied", name: "appliedDate", type: "date" },
              { label: "Contact Person", name: "contactPerson", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.name !== "jobLink" && field.name !== "contactPerson"}
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

            <div className="grid grid-cols-2 gap-4">
              {["Resume", "Cover Letter"].map((label) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-input hover:border-primary cursor-pointer transition-colors">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
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