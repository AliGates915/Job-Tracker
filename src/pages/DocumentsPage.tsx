import { FileText, Upload, Download, Trash2, File } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { documents } from "@/data/mockData";

const DocumentsPage = () => {
  const resumes = documents.filter((d) => d.type === "resume");
  const covers = documents.filter((d) => d.type === "cover");

  const DocSection = ({ title, docs }: { title: string; docs: typeof documents }) => (
    <div>
      <h2 className="font-semibold text-foreground mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-card rounded-xl border border-border card-shadow p-5 hover:card-shadow-hover transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-accent">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-card-foreground truncate">{doc.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.date} · {doc.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-accent transition-colors">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your resumes and cover letters</p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
            <Upload className="h-4 w-4" /> Upload File
            <input type="file" className="hidden" />
          </label>
        </div>

        <DocSection title="Resumes" docs={resumes} />
        <DocSection title="Cover Letters" docs={covers} />
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
