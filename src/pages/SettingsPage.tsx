import DashboardLayout from "@/layouts/DashboardLayout";
import { User, Bell, Shield, Palette } from "lucide-react";

const SettingsPage = () => (
  <DashboardLayout>
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {[
        {
          icon: User, title: "Profile", description: "Update your personal information",
          fields: [
            { label: "Full Name", value: "John Doe", type: "text" },
            { label: "Email", value: "john@example.com", type: "email" },
            { label: "Phone", value: "+1 234 567 8900", type: "tel" },
          ],
        },
        {
          icon: Bell, title: "Notifications", description: "Configure notification preferences",
          toggles: [
            { label: "Email notifications", checked: true },
            { label: "Interview reminders", checked: true },
            { label: "Application updates", checked: false },
            { label: "Weekly digest", checked: true },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <section.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">{section.title}</h2>
              <p className="text-xs text-muted-foreground">{section.description}</p>
            </div>
          </div>

          {section.fields && (
            <div className="space-y-4">
              {section.fields.map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-card-foreground mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    defaultValue={f.value}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          )}

          {section.toggles && (
            <div className="space-y-3">
              {section.toggles.map((t) => (
                <label key={t.label} className="flex items-center justify-between py-1 cursor-pointer">
                  <span className="text-sm text-card-foreground">{t.label}</span>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${t.checked ? "bg-primary" : "bg-muted"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-card shadow transition-transform ${t.checked ? "right-1" : "left-1"}`} />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default SettingsPage;
