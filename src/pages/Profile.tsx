
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and profile details.
          </p>
        </div>
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
