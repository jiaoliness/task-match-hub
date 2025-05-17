
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobForm } from "@/components/jobs/JobForm";
import { Navigate } from "react-router-dom";

const PostJob = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== "customer") {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Create a job posting to find the perfect freelancer for your project.</p>
        </div>
        <JobForm />
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
