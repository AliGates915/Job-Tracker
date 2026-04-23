import DashboardLayout from "@/layouts/DashboardLayout";
import { authService } from "@/services/authService";
import { User, Mail, Phone, Calendar } from "lucide-react";

const ProfilePage = () => {
  const user = authService.getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">View your profile information</p>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {user?.fullName?.[0] || user?.name?.[0] || user?.email?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.fullName || user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-foreground">{user?.fullName || user?.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium text-foreground">{user?.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Account Created</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;