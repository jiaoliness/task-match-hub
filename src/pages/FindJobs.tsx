
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobList } from "@/components/jobs/JobList";
import { Navigate } from "react-router-dom";

const FindJobs = () => {
  const { getAvailableJobsForFreelancer, getApplicationsForFreelancer } = useData();
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
  const freelancerApplications = getApplicationsForFreelancer(user.id);
  
  // Filter out jobs that the freelancer has already applied for
  const appliedJobIds = freelancerApplications.map(app => app.jobId);
  const unappliedJobs = availableJobs.filter(job => !appliedJobIds.includes(job.id));
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Jobs</h1>
          <p className="text-muted-foreground">Browse available jobs that match your skills.</p>
        </div>
        <JobList jobs={unappliedJobs} showApplyButton={true} />
      </div>
    </DashboardLayout>
  );
};

export default FindJobs;
