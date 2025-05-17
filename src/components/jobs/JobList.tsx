
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Job } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface JobListProps {
  jobs: Job[];
  showApplyButton?: boolean;
}

export function JobList({ jobs, showApplyButton = false }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search jobs by title, description, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
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
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Budget: <span className="font-medium">${job.budget}</span></div>
          <div>Due: <span className="font-medium">{new Date(job.deadline).toLocaleDateString()}</span></div>
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
