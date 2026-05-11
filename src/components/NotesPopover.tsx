// components/NotesPopover.tsx
import { useEffect } from "react";
import { FileText, X } from "lucide-react";
import { formatNotes } from "../lib/formatNotes";

interface NotesPopoverProps {
  notes: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function NotesPopover({ notes, open, onOpen, onClose }: NotesPopoverProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={onOpen}
        disabled={!notes}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="View Notes"
      >
        <FileText className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Modal Portal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-semibold text-card-foreground">Job Notes</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="px-6 py-4 overflow-y-auto text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatNotes(notes) }}
            />

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-muted-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}