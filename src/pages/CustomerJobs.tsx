
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobList } from "@/components/jobs/JobList";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";

const CustomerJobs = () => {
  const { getJobsForCustomer } = useData();
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
  
  const myJobs = getJobsForCustomer(user.id);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <Link to="/post-job">
            <Button>Post New Job</Button>
          </Link>
        </div>
        <JobList jobs={myJobs} />
      </div>
    </DashboardLayout>
  );
};

export default CustomerJobs;
