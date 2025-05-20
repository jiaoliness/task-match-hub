
import { createContext, useContext, useState, ReactNode } from "react";
import { Job, JobApplication, Service, Review, Booking, TimeSlot, Resume } from "@/types";

interface DataContextType {
  jobs: Job[];
  applications: JobApplication[];
  services: Service[];
  reviews: Review[];
  bookings: Booking[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => Promise<Job>;
  getJobsForCustomer: (customerId: string) => Job[];
  getAvailableJobsForFreelancer: () => Job[];
  applyToJob: (application: Omit<JobApplication, "id" | "createdAt" | "status">) => Promise<JobApplication>;
  getApplicationsForFreelancer: (freelancerId: string) => JobApplication[];
  getApplicationsForJob: (jobId: string) => JobApplication[];
  updateApplicationStatus: (applicationId: string, status: "accepted" | "rejected") => Promise<void>;
  getServicesForFreelancer: (freelancerId: string) => Service[];
  getReviewsForFreelancer: (freelancerId: string) => Review[];
  getBookingsForFreelancer: (freelancerId: string) => Booking[];
  checkFreelancerAvailability: (freelancerId: string, date: string, timeSlot: string) => boolean;
  addBooking: (booking: Omit<Booking, "id">) => Promise<Booking>;
  addResumeToUser: (userId: string, resume: Omit<Resume, "id" | "isActive" | "uploadDate">) => Promise<Resume>;
  getUserResumes: (userId: string) => Resume[];
  setActiveResume: (userId: string, resumeId: string) => Promise<void>;
  deleteResume: (userId: string, resumeId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Updated mock data with Iloilo City addresses and more jobs
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Fix electrical outlets in kitchen",
    description: "I have two outlets in my kitchen that have stopped working. Need someone to diagnose and fix the issue.",
    budget: 1500,
    schedulingType: "specific",
    specificDate: "2024-06-15",
    specificTimeSlot: "10:00 AM - 12:00 PM",
    customerId: "1",
    customerName: "John Cruz",
    status: "open",
    skills: ["Electrical Repair", "Troubleshooting"],
    createdAt: "2024-05-01T10:00:00Z",
    address: {
      street: "SM City Iloilo, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "2",
    title: "Install ceiling fan in bedroom",
    description: "Need a ceiling fan installed in the master bedroom. I have the fan, just need someone to install it.",
    budget: 1200,
    schedulingType: "flexible",
    weeklyPreference: ["Saturday", "Sunday"],
    timeFramePreference: "Morning or Afternoon",
    customerId: "1",
    customerName: "John Cruz",
    status: "open",
    skills: ["Fan Installation", "Electrical Wiring"],
    createdAt: "2024-05-05T14:30:00Z",
    address: {
      street: "Plazuela de Iloilo, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "3",
    title: "Website redesign for local restaurant",
    description: "Our restaurant needs a modern, mobile-friendly website. Looking for someone to redesign our existing site with online ordering capabilities.",
    budget: 12000,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Wednesday", "Friday"],
    timeFramePreference: "Anytime",
    customerId: "3",
    customerName: "Sarah Williams",
    status: "open",
    skills: ["Web Design", "UI/UX", "React", "WordPress"],
    createdAt: "2024-05-10T09:15:00Z",
    address: {
      street: "Iloilo Business Park, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "4",
    title: "Plumbing repair in bathroom",
    description: "Leaking faucet and slow draining sink in master bathroom. Need a qualified plumber to fix both issues.",
    budget: 1750,
    schedulingType: "specific",
    specificDate: "2024-06-10",
    specificTimeSlot: "2:00 PM - 4:00 PM",
    customerId: "4",
    customerName: "Alice Johnson",
    status: "open",
    skills: ["Plumbing", "Sink Repair", "Faucet Installation"],
    createdAt: "2024-05-12T13:20:00Z",
    address: {
      street: "Atria Park District, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "5",
    title: "Logo design for tech startup",
    description: "New AI startup looking for a modern, clean logo design that represents innovation and cutting-edge technology.",
    budget: 3500,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeFramePreference: "Within 2 weeks",
    customerId: "5",
    customerName: "Robert Chen",
    status: "open",
    skills: ["Graphic Design", "Logo Design", "Branding"],
    createdAt: "2024-05-15T10:45:00Z",
    address: {
      street: "Iloilo City Hall, Plaza Libertad",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "6",
    title: "Living room and kitchen painting",
    description: "Need interior painting for living room (walls and ceiling) and kitchen. Approximately 50 sq m total. Paint will be provided.",
    budget: 6000,
    schedulingType: "specific",
    specificDate: "2024-06-22",
    specificTimeSlot: "8:00 AM - 10:00 AM",
    customerId: "6",
    customerName: "Sarah Miller",
    status: "open",
    skills: ["Painting", "Interior Design", "Home Improvement"],
    createdAt: "2024-05-16T15:30:00Z",
    address: {
      street: "Smallville Complex, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "7",
    title: "Social media content creation",
    description: "Looking for someone to create engaging social media content for our fitness brand. Need posts for Instagram, Facebook, and TikTok.",
    budget: 4000,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Wednesday", "Friday"],
    timeFramePreference: "Ongoing",
    customerId: "7",
    customerName: "David Wilson",
    status: "open",
    skills: ["Social Media Marketing", "Content Creation", "Photography", "Video Editing"],
    createdAt: "2024-05-18T11:10:00Z",
    address: {
      street: "Festive Walk Mall, Mandurriao",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "8",
    title: "AC maintenance and filter replacement",
    description: "Need routine maintenance for air conditioning system and replacement of all air filters in the house.",
    budget: 2000,
    schedulingType: "specific",
    specificDate: "2024-06-18",
    specificTimeSlot: "12:00 PM - 2:00 PM",
    customerId: "8",
    customerName: "Emily Taylor",
    status: "open",
    skills: ["HVAC", "Air Conditioning", "Maintenance"],
    createdAt: "2024-05-19T14:25:00Z",
    address: {
      street: "Esplanade, Molo",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "9",
    title: "Fitness tracking app development",
    description: "Looking for a developer to create a mobile app for tracking workouts, nutrition, and progress. Need both iOS and Android versions.",
    budget: 50000,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeFramePreference: "Within 3 months",
    customerId: "9",
    customerName: "Michael Brown",
    status: "open",
    skills: ["Mobile Development", "React Native", "UI/UX", "Fitness"],
    createdAt: "2024-05-20T09:00:00Z",
    address: {
      street: "GT Town Center, Pavia",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "10",
    title: "Garden landscaping and maintenance",
    description: "Need help redesigning front yard garden with drought-resistant plants and setting up a drip irrigation system.",
    budget: 8000,
    schedulingType: "specific",
    specificDate: "2024-06-25",
    specificTimeSlot: "8:00 AM - 10:00 AM",
    customerId: "10",
    customerName: "Jessica Adams",
    status: "open",
    skills: ["Landscaping", "Gardening", "Irrigation Systems"],
    createdAt: "2024-05-22T16:45:00Z",
    address: {
      street: "Robinson's Place Iloilo, Molo",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "11",
    title: "WordPress website maintenance",
    description: "Looking for ongoing maintenance of our WordPress website including updates, security, and content changes twice a month.",
    budget: 2500,
    schedulingType: "flexible",
    weeklyPreference: ["Tuesday", "Thursday"],
    timeFramePreference: "Biweekly",
    customerId: "11",
    customerName: "Marco Santos",
    status: "open",
    skills: ["WordPress", "Web Development", "PHP", "Content Management"],
    createdAt: "2024-05-23T08:30:00Z",
    address: {
      street: "University of San Agustin, General Luna St.",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "12",
    title: "Event photography for wedding",
    description: "Need a professional photographer for a wedding ceremony and reception. Around 6 hours of coverage needed.",
    budget: 15000,
    schedulingType: "specific",
    specificDate: "2024-07-15",
    specificTimeSlot: "12:00 PM - 6:00 PM",
    customerId: "12",
    customerName: "Elena Rivera",
    status: "open",
    skills: ["Photography", "Wedding", "Photo Editing", "Event Coverage"],
    createdAt: "2024-05-24T14:15:00Z",
    address: {
      street: "West Visayas State University, La Paz",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "13",
    title: "Math tutoring for high school student",
    description: "Looking for a math tutor for my 10th grade son who needs help with calculus. 2 hours per week.",
    budget: 1800,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Wednesday", "Friday"],
    timeFramePreference: "After school hours",
    customerId: "13",
    customerName: "Fernando Gomez",
    status: "open",
    skills: ["Mathematics", "Tutoring", "Calculus", "Education"],
    createdAt: "2024-05-25T09:20:00Z",
    address: {
      street: "Iloilo Provincial Capitol, Bonifacio Drive",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "14",
    title: "Moving help - small apartment",
    description: "Need assistance moving from a 1-bedroom apartment to a new place. Have approximately 15 boxes and few furniture items.",
    budget: 3000,
    schedulingType: "specific",
    specificDate: "2024-06-30",
    specificTimeSlot: "8:00 AM - 12:00 PM",
    customerId: "14",
    customerName: "Carlos Martinez",
    status: "open",
    skills: ["Moving", "Lifting", "Transportation"],
    createdAt: "2024-05-26T10:45:00Z",
    address: {
      street: "Iloilo Doctors' Hospital, Q. Abeto St.",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "15",
    title: "Catering for corporate event",
    description: "Need catering service for a corporate event with 50 attendees. Mix of local and international cuisines required.",
    budget: 25000,
    schedulingType: "specific",
    specificDate: "2024-07-05",
    specificTimeSlot: "10:00 AM - 2:00 PM",
    customerId: "15",
    customerName: "Isabella Wong",
    status: "open",
    skills: ["Catering", "Food Service", "Event Planning", "Cooking"],
    createdAt: "2024-05-27T13:30:00Z",
    address: {
      street: "St. Paul's Hospital, General Luna St.",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "16",
    title: "Video editing for YouTube channel",
    description: "Need a video editor for my cooking channel. Weekly 15-20 minute videos with effects, transitions, and background music.",
    budget: 3500,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeFramePreference: "Weekly",
    customerId: "16",
    customerName: "Sophia Lee",
    status: "open",
    skills: ["Video Editing", "Adobe Premiere", "After Effects", "Content Creation"],
    createdAt: "2024-05-28T11:15:00Z",
    address: {
      street: "Molo Church, Molo",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "17",
    title: "House cleaning service",
    description: "Need thorough cleaning of 3-bedroom house including floors, bathrooms, kitchen, and windows.",
    budget: 2000,
    schedulingType: "specific",
    specificDate: "2024-06-12",
    specificTimeSlot: "8:00 AM - 4:00 PM",
    customerId: "17",
    customerName: "Ana Reyes",
    status: "open",
    skills: ["Cleaning", "Housekeeping", "Organizing"],
    createdAt: "2024-05-29T09:40:00Z",
    address: {
      street: "Jaro Cathedral, Jaro",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "18",
    title: "Car detailing service",
    description: "Need interior and exterior detailing for sedan including waxing, polishing, and upholstery cleaning.",
    budget: 2500,
    schedulingType: "specific",
    specificDate: "2024-06-20",
    specificTimeSlot: "10:00 AM - 2:00 PM",
    customerId: "18",
    customerName: "Daniel Kim",
    status: "open",
    skills: ["Car Detailing", "Auto Care", "Cleaning"],
    createdAt: "2024-05-30T14:20:00Z",
    address: {
      street: "Central Philippine University, Jaro",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "19",
    title: "Personal shopper needed",
    description: "Looking for someone to help with grocery shopping and errands once a week for an elderly couple.",
    budget: 1500,
    schedulingType: "flexible",
    weeklyPreference: ["Tuesday", "Thursday", "Saturday"],
    timeFramePreference: "Morning",
    customerId: "19",
    customerName: "Mia Fernandez",
    status: "open",
    skills: ["Shopping", "Assistance", "Errand Running"],
    createdAt: "2024-05-31T10:25:00Z",
    address: {
      street: "La Paz Public Market, La Paz",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  },
  {
    id: "20",
    title: "Accounting services for small business",
    description: "Need an accountant for monthly bookkeeping and quarterly tax preparation for a small retail business.",
    budget: 5000,
    schedulingType: "flexible",
    weeklyPreference: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeFramePreference: "End of month",
    customerId: "20",
    customerName: "Luis Torres",
    status: "open",
    skills: ["Accounting", "Bookkeeping", "Tax Preparation", "QuickBooks"],
    createdAt: "2024-06-01T08:55:00Z",
    address: {
      street: "Calle Real, City Proper",
      city: "Iloilo City",
      state: "Iloilo",
      zipCode: "5000",
      country: "Philippines"
    }
  }
];

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "1",
    jobId: "1",
    freelancerId: "2",
    freelancerName: "Jane Smith",
    coverLetter: "I'm an experienced electrician and I can fix your faulty outlets quickly and efficiently.",
    proposedDate: "2024-06-15",
    proposedTimeSlot: "10:00 AM - 12:00 PM",
    status: "pending",
    createdAt: "2024-05-07T09:15:00Z"
  }
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    freelancerId: "2",
    jobId: "1",
    date: "2024-06-10",
    timeSlot: "2:00 PM - 4:00 PM",
    status: "scheduled"
  },
  {
    id: "2",
    freelancerId: "2",
    jobId: "2",
    date: "2024-06-20",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "scheduled"
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    freelancerId: "2",
    title: "Emergency Electrical Repairs",
    description: "24/7 emergency electrical repair service for urgent issues like power outages, electrical failures, or safety hazards.",
    rate: 85,
    rateUnit: "hour",
  },
  {
    id: "2",
    freelancerId: "2",
    title: "Electrical Panel Upgrades",
    description: "Complete electrical panel replacements and upgrades to improve safety and meet modern electrical demands.",
    rate: 500,
    rateUnit: "project",
  },
  {
    id: "3",
    freelancerId: "2",
    title: "Outlet & Switch Installation",
    description: "Installation of new outlets, switches, or replacement of existing ones including GFCI outlets for kitchens and bathrooms.",
    rate: 65,
    rateUnit: "hour",
  },
  {
    id: "4",
    freelancerId: "2",
    title: "Lighting Installation",
    description: "Installation of ceiling fans, chandeliers, recessed lighting, track lighting, and other lighting fixtures.",
    rate: 75,
    rateUnit: "hour",
  },
  {
    id: "5",
    freelancerId: "2",
    title: "Home Electrical Inspection",
    description: "Comprehensive inspection of your home's electrical system to identify potential hazards and ensure code compliance.",
    rate: 150,
    rateUnit: "project",
  },
  {
    id: "6",
    freelancerId: "2",
    title: "Electrical Troubleshooting",
    description: "Diagnostic services to identify and fix electrical problems like circuit overloads, tripping breakers, or flickering lights.",
    rate: 70,
    rateUnit: "hour",
  },
  {
    id: "7",
    freelancerId: "2",
    title: "Whole House Surge Protection",
    description: "Installation of whole-house surge protectors to safeguard your appliances and electronics from power surges.",
    rate: 225,
    rateUnit: "project",
  },
  {
    id: "8",
    freelancerId: "3",
    title: "Content Writing",
    description: "SEO-optimized blog posts and articles for your website or publication.",
    rate: 0.15,
    rateUnit: "word",
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    freelancerId: "2",
    customerId: "1",
    customerName: "John Doe",
    jobId: "101",
    jobTitle: "Emergency Power Outage Repair",
    rating: 5,
    comment: "Mike arrived within 30 minutes after my call during a storm when we lost power. He quickly identified the issue and had everything fixed in less than an hour. Excellent service!",
    createdAt: "2024-04-15T10:00:00Z"
  },
  {
    id: "2",
    freelancerId: "2",
    customerId: "4",
    customerName: "Alice Johnson",
    jobId: "102",
    jobTitle: "Kitchen Renovation Electrical Work",
    rating: 4,
    comment: "Did a great job with our kitchen renovation electrical work. Installed new outlets and lighting fixtures professionally. Only issue was arriving a bit later than scheduled on day two.",
    createdAt: "2024-03-22T14:30:00Z"
  },
  {
    id: "3",
    freelancerId: "2",
    customerId: "5",
    customerName: "Robert Chen",
    jobId: "103",
    jobTitle: "Electrical Panel Upgrade",
    rating: 5,
    comment: "Completely replaced our old electrical panel with a modern one. Very knowledgeable and explained everything clearly. The work was done perfectly and passed inspection with no issues.",
    createdAt: "2024-05-01T09:15:00Z"
  },
  {
    id: "4",
    freelancerId: "2",
    customerId: "6",
    customerName: "Sarah Miller",
    jobId: "104",
    jobTitle: "Ceiling Fan Installation",
    rating: 5,
    comment: "Installed three ceiling fans in our home. Work was done quickly and professionally. Even cleaned up thoroughly afterward. Highly recommend!",
    createdAt: "2024-04-05T13:20:00Z"
  },
  {
    id: "5",
    freelancerId: "2",
    customerId: "7",
    customerName: "David Wilson",
    jobId: "105",
    jobTitle: "Outlet Replacement",
    rating: 3,
    comment: "The work was done adequately, but there was some miscommunication about pricing. The final bill was higher than the initial quote. Quality of work was good though.",
    createdAt: "2024-02-18T11:10:00Z"
  },
  {
    id: "6",
    freelancerId: "2",
    customerId: "8",
    customerName: "Emily Taylor",
    jobId: "106",
    jobTitle: "Home Electrical Inspection",
    rating: 5,
    comment: "Very thorough inspection of our newly purchased home. Identified several potential issues that the home inspector missed. Detailed report with recommendations was extremely helpful.",
    createdAt: "2024-03-12T15:45:00Z"
  },
  {
    id: "7",
    freelancerId: "2",
    customerId: "9",
    customerName: "Michael Brown",
    jobId: "107",
    jobTitle: "Recessed Lighting Installation",
    rating: 4,
    comment: "Did a great job installing recessed lighting in our living room. The lights look fantastic and the dimmer works perfectly. Only took off a star because scheduling was delayed by a week.",
    createdAt: "2024-04-25T10:30:00Z"
  },
  {
    id: "8",
    freelancerId: "2",
    customerId: "10",
    customerName: "Jessica Adams",
    jobId: "108",
    jobTitle: "Electrical Troubleshooting",
    rating: 5,
    comment: "Had an annoying issue with lights flickering in one room for months. Mike identified the problem in minutes and fixed it on the spot. Fair price and great work!",
    createdAt: "2024-05-10T09:00:00Z"
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  
  // Add a new state for tracking users with their resumes
  const [userResumes, setUserResumes] = useState<Record<string, Resume[]>>({
    "2": [ // Add some sample resumes for freelancer with ID "2"
      {
        id: "1",
        fileName: "jane_smith_resume.pdf",
        fileSize: 2.4 * 1024 * 1024, // 2.4 MB
        fileType: "application/pdf",
        uploadDate: "2024-04-15T10:30:00Z",
        isActive: true
      },
      {
        id: "2",
        fileName: "jane_smith_portfolio.pdf",
        fileSize: 3.8 * 1024 * 1024, // 3.8 MB
        fileType: "application/pdf",
        uploadDate: "2024-03-22T14:45:00Z",
        isActive: false
      }
    ]
  });

  const addJob = async (jobData: Omit<Job, "id" | "createdAt" | "status">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newJob: Job = {
      ...jobData,
      id: `${jobs.length + 1}`,
      status: "open",
      createdAt: new Date().toISOString()
    };
    
    setJobs([...jobs, newJob]);
    return newJob;
  };

  const getJobsForCustomer = (customerId: string) => {
    return jobs.filter(job => job.customerId === customerId);
  };

  const getAvailableJobsForFreelancer = () => {
    return jobs.filter(job => job.status === "open");
  };

  const applyToJob = async (applicationData: Omit<JobApplication, "id" | "createdAt" | "status">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newApplication: JobApplication = {
      ...applicationData,
      id: `${applications.length + 1}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    setApplications([...applications, newApplication]);
    return newApplication;
  };

  const getApplicationsForFreelancer = (freelancerId: string) => {
    return applications.filter(app => app.freelancerId === freelancerId);
  };

  const getApplicationsForJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const updateApplicationStatus = async (applicationId: string, status: "accepted" | "rejected") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setApplications(apps => 
      apps.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
    
    if (status === "accepted") {
      // Update the job status as well
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        setJobs(jobs => 
          jobs.map(job => 
            job.id === application.jobId ? { ...job, status: "assigned" } : job
          )
        );
        
        // Create a booking if accepted
        if (application.proposedDate && application.proposedTimeSlot) {
          const newBooking: Booking = {
            id: `${bookings.length + 1}`,
            freelancerId: application.freelancerId,
            jobId: application.jobId,
            date: application.proposedDate,
            timeSlot: application.proposedTimeSlot,
            status: "scheduled"
          };
          
          setBookings([...bookings, newBooking]);
        }
      }
    }
  };

  const getBookingsForFreelancer = (freelancerId: string) => {
    return bookings.filter(booking => booking.freelancerId === freelancerId);
  };

  const checkFreelancerAvailability = (freelancerId: string, date: string, timeSlot: string) => {
    const freelancerBookings = getBookingsForFreelancer(freelancerId);
    return !freelancerBookings.some(
      booking => booking.date === date && booking.timeSlot === timeSlot && booking.status === "scheduled"
    );
  };

  const addBooking = async (bookingData: Omit<Booking, "id">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newBooking: Booking = {
      ...bookingData,
      id: `${bookings.length + 1}`
    };
    
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const getServicesForFreelancer = (freelancerId: string) => {
    return services.filter(service => service.freelancerId === freelancerId);
  };

  const getReviewsForFreelancer = (freelancerId: string) => {
    return reviews.filter(review => review.freelancerId === freelancerId);
  };

  // Resume management functions
  const getUserResumes = (userId: string) => {
    return userResumes[userId] || [];
  };

  const addResumeToUser = async (userId: string, resumeData: Omit<Resume, "id" | "isActive" | "uploadDate">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const userResumesList = userResumes[userId] || [];
    
    // Check if we already have 5 resumes
    if (userResumesList.length >= 5) {
      throw new Error("Maximum of 5 resumes allowed. Please delete one before uploading more.");
    }
    
    const newResume: Resume = {
      ...resumeData,
      id: `${Date.now()}`,
      uploadDate: new Date().toISOString(),
      isActive: userResumesList.length === 0 // Set as active if it's the first resume
    };
    
    const updatedResumes = [...userResumesList, newResume];
    
    setUserResumes(prev => ({
      ...prev,
      [userId]: updatedResumes
    }));
    
    return newResume;
  };

  const setActiveResume = async (userId: string, resumeId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const userResumesList = userResumes[userId] || [];
    
    if (userResumesList.length === 0) {
      throw new Error("No resumes found for this user.");
    }
    
    const updatedResumes = userResumesList.map(resume => ({
      ...resume,
      isActive: resume.id === resumeId
    }));
    
    setUserResumes(prev => ({
      ...prev,
      [userId]: updatedResumes
    }));
  };
  
  const deleteResume = async (userId: string, resumeId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const userResumesList = userResumes[userId] || [];
    
    if (userResumesList.length === 0) {
      throw new Error("No resumes found for this user.");
    }
    
    // Find if we're deleting an active resume
    const deletingActive = userResumesList.find(r => r.id === resumeId)?.isActive || false;
    
    let updatedResumes = userResumesList.filter(resume => resume.id !== resumeId);
    
    // If we deleted the active resume and there are other resumes left, make the first one active
    if (deletingActive && updatedResumes.length > 0) {
      updatedResumes = updatedResumes.map((resume, index) => ({
        ...resume,
        isActive: index === 0
      }));
    }
    
    setUserResumes(prev => ({
      ...prev,
      [userId]: updatedResumes
    }));
  };
  
  return (
    <DataContext.Provider value={{ 
      jobs, 
      applications, 
      services,
      reviews,
      bookings,
      addJob, 
      getJobsForCustomer, 
      getAvailableJobsForFreelancer,
      applyToJob,
      getApplicationsForFreelancer,
      getApplicationsForJob,
      updateApplicationStatus,
      getServicesForFreelancer,
      getReviewsForFreelancer,
      getBookingsForFreelancer,
      checkFreelancerAvailability,
      addBooking,
      // Add new resume functions to the context
      addResumeToUser,
      getUserResumes,
      setActiveResume,
      deleteResume
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
