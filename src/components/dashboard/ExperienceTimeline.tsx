
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Briefcase, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

// Sample data for initial experience entries
const initialExperiences: Experience[] = [
  {
    id: "1",
    title: "Senior Electrician",
    company: "PowerGrid Solutions",
    location: "Los Angeles, CA",
    startDate: "2018-06-01",
    endDate: null,
    description: "Lead electrician handling commercial and residential wiring projects. Emergency call service specialist. Safety compliance inspector.",
    current: true,
  },
  {
    id: "2",
    title: "Electrician",
    company: "Urban Electric Co.",
    location: "San Diego, CA",
    startDate: "2014-03-15",
    endDate: "2018-05-30",
    description: "Specialized in residential electrical installations and repairs. Handled 24/7 emergency calls for the company's premium clients.",
    current: false,
  },
  {
    id: "3",
    title: "Apprentice Electrician",
    company: "Johnson's Electric",
    location: "San Diego, CA",
    startDate: "2011-09-01",
    endDate: "2014-03-01",
    description: "Assisted senior electricians with residential and commercial projects. Completed professional training and certification.",
    current: false,
  }
];

export function ExperienceTimeline() {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: null,
    description: "",
    current: false,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? null : prev.endDate,
    }));
  };

  const handleAddExperience = () => {
    // Basic validation
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) {
      toast.error("Please fill out all required fields");
      return;
    }

    const newEntry: Experience = {
      ...newExperience,
      id: Date.now().toString(),
    };

    setExperiences([newEntry, ...experiences]);
    toast.success("Work experience added successfully!");
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: null,
      description: "",
      current: false,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span>Work Experience</span>
          </CardTitle>
          <CardDescription>
            Showcase your professional background and expertise
          </CardDescription>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Work Experience</DialogTitle>
              <DialogDescription>
                Add details about your previous work experience.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={newExperience.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  value={newExperience.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={newExperience.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newExperience.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newExperience.endDate || ""}
                    onChange={handleInputChange}
                    disabled={newExperience.current}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={newExperience.current}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="current" className="text-sm">I currently work here</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newExperience.description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-24"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExperience}>Add Experience</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l-2 border-muted space-y-8 py-2">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
              
              {/* Experience card */}
              <div className="bg-muted/30 rounded-lg p-4 border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-medium">{exp.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : exp.endDate && formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                </div>
                
                {exp.current && (
                  <Badge variant="outline" className="bg-primary/10 text-primary mb-2">Current</Badge>
                )}
                
                <p className="text-sm mt-2">{exp.description}</p>
                
                <Button variant="ghost" size="sm" className="mt-2 h-8 gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
