
import { Job } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  showApplyButton?: boolean;
  searchTerm?: string;
}

export function JobList({ jobs, showApplyButton = false, searchTerm = "" }: JobListProps) {
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} showApplyButton={showApplyButton} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
}

function JobCard({ job, showApplyButton }: JobCardProps) {
  // Format the date information based on scheduling type
  const getDateInfo = () => {
    if (job.schedulingType === "specific" && job.specificDate) {
      return format(new Date(job.specificDate), "MMM d, yyyy");
    } else if (job.schedulingType === "flexible" && job.weeklyPreference) {
      return job.weeklyPreference.join(', ');
    }
    return "Flexible";
  };

  // Format the location information
  const getLocationInfo = () => {
    if (job.address) {
      const { city, state, country } = job.address;
      const parts = [city, state, country].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    return "Remote";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mr-2">{job.title}</CardTitle>
            <CardDescription>Posted by {job.customerName}</CardDescription>
          </div>
          <Badge className={
            job.status === "open" ? "bg-blue-500" : 
            job.status === "assigned" ? "bg-amber-500" : 
            "bg-green-500"
          }>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm mb-4">{job.description}</p>
        {job.address && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{getLocationInfo()}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Budget: <span className="font-medium">₱{job.budget}</span></div>
          <div>Schedule: <span className="font-medium">{getDateInfo()}</span></div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/job/${job.id}`} className="w-full">
          <Button 
            variant={showApplyButton ? "default" : "outline"} 
            className="w-full"
          >
            {showApplyButton ? "Apply Now" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
