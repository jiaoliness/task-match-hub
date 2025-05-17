
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";

const Applications = () => {
  const { user, loading } = useAuth();
  const { getApplicationsForFreelancer, jobs } = useData();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== "freelancer") {
    return <Navigate to="/dashboard" />;
  }
  
  const applications = getApplicationsForFreelancer(user.id);
  
  // Group applications by status
  const pendingApplications = applications.filter(app => app.status === "pending");
  const acceptedApplications = applications.filter(app => app.status === "accepted");
  const rejectedApplications = applications.filter(app => app.status === "rejected");
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications.</p>
        </div>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
              <Link to="/find-jobs">
                <Button className="mt-3">Find Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {pendingApplications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Pending Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingApplications.map(app => (
                    <ApplicationCard key={app.id} application={app} jobs={jobs} />
                  ))}
                </div>
              </div>
            )}
            
            {acceptedApplications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Accepted Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {acceptedApplications.map(app => (
                    <ApplicationCard key={app.id} application={app} jobs={jobs} />
                  ))}
                </div>
              </div>
            )}
            
            {rejectedApplications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Rejected Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedApplications.map(app => (
                    <ApplicationCard key={app.id} application={app} jobs={jobs} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

interface ApplicationCardProps {
  application: {
    id: string;
    jobId: string;
    status: string;
    createdAt: string;
  };
  jobs: {
    id: string;
    title: string;
    customerName: string;
    budget: number;
  }[];
}

const ApplicationCard = ({ application, jobs }: ApplicationCardProps) => {
  const job = jobs.find(j => j.id === application.jobId);
  
  if (!job) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>Posted by {job.customerName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <Badge className={
            application.status === "accepted" ? "bg-green-500" : 
            application.status === "rejected" ? "bg-red-500" : 
            "bg-amber-500"
          }>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">${job.budget}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Applied on {new Date(application.createdAt).toLocaleDateString()}
        </p>
        <Link to={`/job/${job.id}`}>
          <Button variant="outline" size="sm" className="w-full">View Job</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Applications;
