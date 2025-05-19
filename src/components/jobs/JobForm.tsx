
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { WeekDay, TimeSlot } from "@/types";
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

const DAYS_OF_WEEK: WeekDay[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export function JobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Scheduling related state
  const [schedulingType, setSchedulingType] = useState<"specific" | "flexible">("specific");
  const [specificDate, setSpecificDate] = useState<Date | undefined>(undefined);
  const [specificTimeSlot, setSpecificTimeSlot] = useState<TimeSlot | "">("");
  const [weeklyPreference, setWeeklyPreference] = useState<WeekDay[]>([]);
  const [timeFramePreference, setTimeFramePreference] = useState("");
  
  const { user } = useAuth();
  const { addJob } = useData();
  const navigate = useNavigate();

  const handleWeekDayToggle = (day: WeekDay) => {
    setWeeklyPreference(current =>
      current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post a job");
      return;
    }
    
    // Validate scheduling information
    if (schedulingType === "specific") {
      if (!specificDate) {
        toast.error("Please select a specific date for the job");
        return;
      }
      if (!specificTimeSlot) {
        toast.error("Please select a time slot for the job");
        return;
      }
    } else {
      if (weeklyPreference.length === 0) {
        toast.error("Please select at least one preferred day of the week");
        return;
      }
      if (!timeFramePreference) {
        toast.error("Please provide a preferred time frame");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
      
      const jobData = {
        title,
        description,
        budget: parseFloat(budget),
        schedulingType,
        customerId: user.id,
        customerName: user.name,
        skills: skillsArray,
      };
      
      // Add scheduling data based on type
      if (schedulingType === "specific" && specificDate) {
        Object.assign(jobData, {
          specificDate: format(specificDate, "yyyy-MM-dd"),
          specificTimeSlot,
        });
      } else {
        Object.assign(jobData, {
          weeklyPreference,
          timeFramePreference,
        });
      }
      
      await addJob(jobData);
      
      toast.success("Job posted successfully!");
      navigate("/jobs");
    } catch (error) {
      toast.error("Failed to post job");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>
          Fill out the form below to post a new job opportunity for freelancers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g. Fix electrical outlets in kitchen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the electrical issue or installation requirements in detail..."
              className="min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g. 150"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Scheduling Preference</Label>
            <RadioGroup 
              value={schedulingType} 
              onValueChange={(value) => setSchedulingType(value as "specific" | "flexible")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific">I need this done on a specific date and time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible">I'm flexible with the schedule</Label>
              </div>
            </RadioGroup>
          </div>
          
          {schedulingType === "specific" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select a Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !specificDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {specificDate ? format(specificDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={specificDate}
                      onSelect={setSpecificDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Select a Time Slot</Label>
                <Select
                  value={specificTimeSlot}
                  onValueChange={setSpecificTimeSlot as (value: string) => void}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Days of the Week</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day} 
                        checked={weeklyPreference.includes(day)} 
                        onCheckedChange={() => handleWeekDayToggle(day)} 
                      />
                      <Label htmlFor={day}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeFrame">Preferred Time Frame</Label>
                <Input
                  id="timeFrame"
                  placeholder="e.g. Mornings, Afternoons, After 5PM, etc."
                  value={timeFramePreference}
                  onChange={(e) => setTimeFramePreference(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input
              id="skills"
              placeholder="e.g. Electrical Wiring, Outlet Repair, Lighting Installation"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of required skills</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
