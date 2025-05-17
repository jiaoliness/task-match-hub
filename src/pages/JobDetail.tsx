
import { useParams, Navigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobDetail as JobDetailComponent } from "@/components/jobs/JobDetail";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useData();
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return <Navigate to={user.role === "customer" ? "/jobs" : "/find-jobs"} />;
  }
  
  return (
    <DashboardLayout>
      <JobDetailComponent job={job} />
    </DashboardLayout>
  );
};

export default JobDetail;
