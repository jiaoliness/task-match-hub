
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { JobApplication } from "@/types";
import { ResumeUploader } from "./ResumeUploader";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function FreelancerDashboard() {
  const { user } = useAuth();
  const { getApplicationsForFreelancer, getAvailableJobsForFreelancer } = useData();
  
  if (!user) return null;
  
  const applications = getApplicationsForFreelancer(user.id);
  const availableJobs = getAvailableJobsForFreelancer().slice(0, 3); // Show only 3 recent jobs
  
  const pendingApplications = applications.filter(app => app.status === "pending");
  const acceptedApplications = applications.filter(app => app.status === "accepted");
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your freelance work.</p>
        </div>
        <Link to={`/freelancer/${user.id}`}>
          <Button variant="outline">View Public Profile</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Available Jobs"
          value={availableJobs.length.toString()}
          description="Open jobs matching your skills"
          actionLabel="Find Jobs"
          actionLink="/find-jobs"
        />
        <DashboardCard
          title="Pending Applications"
          value={pendingApplications.length.toString()}
          description="Applications awaiting review"
          actionLabel="View Applications"
          actionLink="/applications"
        />
        <DashboardCard
          title="Active Projects"
          value={acceptedApplications.length.toString()}
          description="Projects you're currently working on"
          actionLabel="View Projects"
          actionLink="/applications"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumeUploader />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Jobs</h2>
              <Link to="/find-jobs">
                <Button variant="outline">View All Jobs</Button>
              </Link>
            </div>
            
            {availableJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {availableJobs.map(job => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>Posted by {job.customerName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm mb-3">{job.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">${job.budget}</span>
                        <Link to={`/job/${job.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">No jobs available right now. Check back later!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <ExperienceTimeline />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <Link to="/applications">
            <Button variant="outline">View All Applications</Button>
          </Link>
        </div>
        
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.slice(0, 3).map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
              <Link to="/find-jobs">
                <Button className="mt-3">Find Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  actionLabel: string;
  actionLink: string;
}

function DashboardCard({ title, value, description, actionLabel, actionLink }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-4">{value}</p>
        <Link to={actionLink}>
          <Button variant="outline" className="w-full">{actionLabel}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface ApplicationCardProps {
  application: JobApplication;
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const { jobs } = useData();
  const job = jobs.find(j => j.id === application.jobId);
  
  if (!job) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>
          Status: <span className={
            application.status === "accepted" ? "text-green-600" : 
            application.status === "rejected" ? "text-red-600" : 
            "text-amber-600"
          }>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm mb-3">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
        <Link to={`/job/${job.id}`}>
          <Button variant="outline" size="sm" className="w-full">View Job</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
