
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { getJobsForCustomer } = useData();
  
  if (!user) return null;
  
  const myJobs = getJobsForCustomer(user.id);
  const openJobs = myJobs.filter(job => job.status === "open");
  const assignedJobs = myJobs.filter(job => job.status === "assigned");
  const completedJobs = myJobs.filter(job => job.status === "completed");
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Here's the status of your projects.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Open Jobs"
          value={openJobs.length.toString()}
          description="Jobs waiting for applications"
          actionLabel="View Open Jobs"
          actionLink="/jobs"
        />
        <DashboardCard
          title="Active Projects"
          value={assignedJobs.length.toString()}
          description="Projects currently in progress"
          actionLabel="View Projects"
          actionLink="/jobs"
        />
        <DashboardCard
          title="Completed"
          value={completedJobs.length.toString()}
          description="Successfully completed projects"
          actionLabel="View History"
          actionLink="/jobs"
        />
      </div>
      
      <div className="flex">
        <Link to="/post-job">
          <Button size="lg" className="gap-2">
            <span>Post a New Job</span>
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Recent Jobs</h2>
          <Link to="/jobs">
            <Button variant="outline">View All Jobs</Button>
          </Link>
        </div>
        
        {myJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.slice(0, 3).map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    Status: <span className={
                      job.status === "open" ? "text-blue-600" : 
                      job.status === "assigned" ? "text-amber-600" : 
                      "text-green-600"
                    }>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm mb-3">{job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">${job.budget}</span>
                    <Link to={`/job/${job.id}`}>
                      <Button variant="outline" size="sm">Manage</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
              <Link to="/post-job">
                <Button className="mt-3">Post Your First Job</Button>
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
