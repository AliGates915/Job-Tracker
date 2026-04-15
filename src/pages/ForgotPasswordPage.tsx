import { Link } from "react-router-dom";
import { Briefcase, Mail, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-2xl text-foreground">JobTracker</span>
      </div>

      <div className="bg-card rounded-2xl card-shadow-lg border border-border p-8">
        <h1 className="text-2xl font-bold text-card-foreground mb-1">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-6">We'll send you a reset link</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" placeholder="john@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Send Reset Link
          </button>
        </form>

        <Link to="/" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </div>
    </div>
  </div>
);

export default ForgotPasswordPage;
