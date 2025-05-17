
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Job, JobApplication } from "@/types";
import { Link } from "react-router-dom";

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const { user } = useAuth();
  const { 
    applyToJob, 
    getApplicationsForJob, 
    getApplicationsForFreelancer,
    updateApplicationStatus
  } = useData();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const applications = getApplicationsForJob(job.id);
  
  // Check if current freelancer has already applied
  const hasApplied = user?.role === "freelancer" && 
    getApplicationsForFreelancer(user.id).some(app => app.jobId === job.id);
  
  const handleApply = async () => {
    if (!user || user.role !== "freelancer") {
      toast.error("You must be logged in as a freelancer to apply");
      return;
    }
    
    if (coverLetter.trim().length < 10) {
      toast.error("Please write a proper cover letter");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await applyToJob({
        jobId: job.id,
        freelancerId: user.id,
        freelancerName: user.name,
        coverLetter,
      });
      
      toast.success("Application submitted successfully!");
      setIsApplying(false);
      setCoverLetter("");
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus(applicationId, "accepted");
      toast.success("Application accepted!");
    } catch (error) {
      toast.error("Failed to accept application");
      console.error(error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus(applicationId, "rejected");
      toast.success("Application rejected");
    } catch (error) {
      toast.error("Failed to reject application");
      console.error(error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription>Posted by {job.customerName} on {formatDate(job.createdAt)}</CardDescription>
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
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Budget</h3>
              <p className="text-2xl font-bold">${job.budget}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Deadline</h3>
              <p className="font-bold">{formatDate(job.deadline)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Link to={job.customerId === user?.id ? "/jobs" : "/find-jobs"}>
            <Button variant="outline">Back to Jobs</Button>
          </Link>
          
          {user?.role === "freelancer" && job.status === "open" && (
            <>
              {!hasApplied ? (
                <Button 
                  onClick={() => setIsApplying(true)}
                  disabled={isApplying}
                >
                  Apply for this Job
                </Button>
              ) : (
                <Badge>Already Applied</Badge>
              )}
            </>
          )}
        </CardFooter>
      </Card>
      
      {isApplying && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for this job</CardTitle>
            <CardDescription>Tell the client why you're the perfect fit for this job.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your cover letter here... Include your relevant experience, approach to the project, and why you're a good fit."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-32"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsApplying(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {user?.id === job.customerId && applications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Applications ({applications.length})</h2>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onAccept={job.status === "open" ? handleAcceptApplication : undefined}
              onReject={job.status === "open" ? handleRejectApplication : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ApplicationCardProps {
  application: JobApplication;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

function ApplicationCard({ application, onAccept, onReject }: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.freelancerName}</CardTitle>
            <CardDescription>Applied on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          <Badge className={
            application.status === "accepted" ? "bg-green-500" : 
            application.status === "rejected" ? "bg-red-500" : 
            "bg-amber-500"
          }>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">Cover Letter</h3>
        <p className="whitespace-pre-line">{application.coverLetter}</p>
      </CardContent>
      {onAccept && onReject && application.status === "pending" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onReject(application.id)}>Reject</Button>
          <Button onClick={() => onAccept(application.id)}>Accept</Button>
        </CardFooter>
      )}
    </Card>
  );
}
