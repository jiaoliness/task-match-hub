
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { JobList } from "@/components/jobs/JobList";
import { Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { JobMap } from "@/components/maps/JobMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List } from "lucide-react";

const FindJobs = () => {
  const { getAvailableJobsForFreelancer, getApplicationsForFreelancer } = useData();
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  
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

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Search jobs by title, description, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")} className="w-fit">
            <TabsList>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>List View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div>
          {viewMode === "map" ? (
            <JobMap jobs={unappliedJobs} searchTerm={searchTerm} />
          ) : (
            <JobList jobs={unappliedJobs} showApplyButton={true} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobs;
