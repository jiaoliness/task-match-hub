import { createContext, useContext, useState, ReactNode } from "react";
import { Job, JobApplication, Service, Review } from "@/types";

interface DataContextType {
  jobs: Job[];
  applications: JobApplication[];
  services: Service[];
  reviews: Review[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => Promise<Job>;
  getJobsForCustomer: (customerId: string) => Job[];
  getAvailableJobsForFreelancer: () => Job[];
  applyToJob: (application: Omit<JobApplication, "id" | "createdAt" | "status">) => Promise<JobApplication>;
  getApplicationsForFreelancer: (freelancerId: string) => JobApplication[];
  getApplicationsForJob: (jobId: string) => JobApplication[];
  updateApplicationStatus: (applicationId: string, status: "accepted" | "rejected") => Promise<void>;
  getServicesForFreelancer: (freelancerId: string) => Service[];
  getReviewsForFreelancer: (freelancerId: string) => Review[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Updated mock data for electrician
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Build a responsive website",
    description: "I need a responsive website for my small business. Should include about, services, and contact pages.",
    budget: 500,
    deadline: "2024-07-01",
    customerId: "1",
    customerName: "John Doe",
    status: "open",
    skills: ["HTML", "CSS", "JavaScript"],
    createdAt: "2024-05-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Logo design for tech startup",
    description: "I need a modern, minimalist logo for my tech startup in the AI space.",
    budget: 300,
    deadline: "2024-06-15",
    customerId: "1",
    customerName: "John Doe",
    status: "open",
    skills: ["Graphic Design", "Branding"],
    createdAt: "2024-05-05T14:30:00Z"
  },
];

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "1",
    jobId: "1",
    freelancerId: "2",
    freelancerName: "Jane Smith",
    coverLetter: "I'm an experienced web developer and I can build your website with the latest technologies.",
    status: "pending",
    createdAt: "2024-05-07T09:15:00Z"
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
      }
    }
  };

  const getServicesForFreelancer = (freelancerId: string) => {
    return services.filter(service => service.freelancerId === freelancerId);
  };

  const getReviewsForFreelancer = (freelancerId: string) => {
    return reviews.filter(review => review.freelancerId === freelancerId);
  };

  return (
    <DataContext.Provider value={{ 
      jobs, 
      applications, 
      services,
      reviews,
      addJob, 
      getJobsForCustomer, 
      getAvailableJobsForFreelancer,
      applyToJob,
      getApplicationsForFreelancer,
      getApplicationsForJob,
      updateApplicationStatus,
      getServicesForFreelancer,
      getReviewsForFreelancer
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
