
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Job, JobApplication, TimeSlot } from "@/types";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS: TimeSlot[] = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM"
];

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const { user } = useAuth();
  const { 
    applyToJob, 
    getApplicationsForJob, 
    getApplicationsForFreelancer,
    updateApplicationStatus,
    getBookingsForFreelancer,
    checkFreelancerAvailability
  } = useData();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for date selection
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    job.schedulingType === "specific" && job.specificDate 
      ? new Date(job.specificDate) 
      : undefined
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | "">(
    job.schedulingType === "specific" && job.specificTimeSlot as TimeSlot
      ? job.specificTimeSlot as TimeSlot
      : ""
  );
  
  // For showing calendar dialog
  const [showCalendar, setShowCalendar] = useState(false);
  
  const applications = getApplicationsForJob(job.id);
  
  // Check if current freelancer has already applied
  const hasApplied = user?.role === "freelancer" && 
    getApplicationsForFreelancer(user.id).some(app => app.jobId === job.id);
  
  // Get unavailable dates for the freelancer
  const getUnavailableDays = () => {
    if (!user || user.role !== "freelancer") return [];
    
    const bookings = getBookingsForFreelancer(user.id);
    // Create a set of date strings that are already booked
    return bookings.map(booking => new Date(booking.date));
  };
  
  const handleApply = async () => {
    if (!user || user.role !== "freelancer") {
      toast.error("You must be logged in as a freelancer to apply");
      return;
    }
    
    if (coverLetter.trim().length < 10) {
      toast.error("Please write a proper cover letter");
      return;
    }
    
    if (!selectedDate) {
      toast.error("Please select a date for the job");
      return;
    }
    
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot for the job");
      return;
    }
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
    // Check if the freelancer is available on the selected date and time
    const isAvailable = checkFreelancerAvailability(user.id, formattedDate, selectedTimeSlot);
    
    if (!isAvailable) {
      toast.error("You already have a booking at this time. Please select another date or time.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await applyToJob({
        jobId: job.id,
        freelancerId: user.id,
        freelancerName: user.name,
        coverLetter,
        proposedDate: formattedDate,
        proposedTimeSlot: selectedTimeSlot,
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
      toast.success("Application accepted! The job has been scheduled.");
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
              <h3 className="font-medium mb-2">Schedule</h3>
              {job.schedulingType === "specific" ? (
                <div>
                  <p className="font-bold">Specific Date: {job.specificDate && formatDate(job.specificDate)}</p>
                  <p>Time: {job.specificTimeSlot}</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold">Preferred Days: {job.weeklyPreference?.join(", ")}</p>
                  <p>Preferred Time: {job.timeFramePreference}</p>
                </div>
              )}
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
                  onClick={() => {
                    setIsApplying(true);
                    // Preselect date if specific
                    if (job.schedulingType === "specific" && job.specificDate) {
                      setSelectedDate(new Date(job.specificDate));
                      setSelectedTimeSlot(job.specificTimeSlot as TimeSlot || "");
                    }
                  }}
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
            <CardDescription>Tell the client why you're the perfect fit for this job and propose a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Cover Letter</h3>
              <Textarea
                placeholder="Write your cover letter here... Include your relevant experience, approach to the project, and why you're a good fit."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-32"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Proposed Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        // Can't select days in the past
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        // If specific date is required, only allow that date
                        if (job.schedulingType === "specific" && job.specificDate) {
                          const jobDate = new Date(job.specificDate);
                          jobDate.setHours(0, 0, 0, 0);
                          return date < today || date.getTime() !== jobDate.getTime();
                        }
                        
                        // For flexible jobs, check if day of week is in preferred days
                        if (job.schedulingType === "flexible" && job.weeklyPreference?.length) {
                          const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
                          if (!job.weeklyPreference.includes(dayName)) {
                            return true;
                          }
                        }
                        
                        return date < today;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Proposed Time Slot</h3>
                <Select
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot as (value: string) => void}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem 
                        key={slot} 
                        value={slot}
                        disabled={
                          // For specific jobs, only allow the specific time slot
                          job.schedulingType === "specific" && 
                          job.specificTimeSlot && 
                          slot !== job.specificTimeSlot
                        }
                      >
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
      
      {/* Calendar Dialog for seeing booking availability */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Schedule</DialogTitle>
            <DialogDescription>
              View your current bookings and availability.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="p-3 pointer-events-auto"
            />
            <div className="mt-4">
              <h3 className="text-sm font-medium">Legend:</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Booked</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCalendar(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Cover Letter</h3>
          <p className="whitespace-pre-line">{application.coverLetter}</p>
        </div>
        
        {application.proposedDate && (
          <div className="border p-3 rounded-md bg-slate-50">
            <h3 className="font-medium mb-2">Proposed Schedule</h3>
            <p><span className="font-medium">Date:</span> {new Date(application.proposedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {application.proposedTimeSlot && (
              <p><span className="font-medium">Time:</span> {application.proposedTimeSlot}</p>
            )}
          </div>
        )}
      </CardContent>
      {onAccept && onReject && application.status === "pending" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onReject(application.id)}>Reject</Button>
          <Button onClick={() => onAccept(application.id)}>Accept & Schedule</Button>
        </CardFooter>
      )}
    </Card>
  );
}
