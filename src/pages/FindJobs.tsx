
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobList } from "@/components/jobs/JobList";
import { Navigate } from "react-router-dom";

const FindJobs = () => {
  const { getAvailableJobsForFreelancer } = useData();
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== "freelancer") {
    return <Navigate to="/dashboard" />;
  }
  
  const availableJobs = getAvailableJobsForFreelancer();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Jobs</h1>
          <p className="text-muted-foreground">Browse available jobs that match your skills.</p>
        </div>
        <JobList jobs={availableJobs} showApplyButton={true} />
      </div>
    </DashboardLayout>
  );
};

export default FindJobs;
