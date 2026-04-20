import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

const ReminderDatePicker = ({ value, onChange, status, required }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  // Only show reminder date picker for specific statuses
  const shouldShowReminder = ["Screening", "Interview", "Offer", "Applied"].includes(status);
  
  if (!shouldShowReminder) {
    return null;
  }
  
  const handleDateChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Reminder Date & Time <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="datetime-local"
          value={value || ""}
          onChange={handleDateChange}
          required={required}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="absolute right-3 top-2.5 text-muted-foreground">
          <Calendar className="h-4 w-4" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        You'll receive an email reminder at this time
      </p>
    </div>
  );
};

export default ReminderDatePicker;