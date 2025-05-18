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

// Mock data
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
    title: "Web Development",
    description: "Custom website development using React, Next.js, and other modern technologies.",
    rate: 50,
    rateUnit: "hour",
  },
  {
    id: "2",
    freelancerId: "2",
    title: "UI/UX Design",
    description: "User interface and experience design for web and mobile applications.",
    rate: 45,
    rateUnit: "hour",
  },
  {
    id: "3",
    freelancerId: "2",
    title: "Logo Design",
    description: "Professional logo design with unlimited revisions.",
    rate: 300,
    rateUnit: "project",
  },
  {
    id: "4",
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
    jobId: "1",
    jobTitle: "Build a responsive website",
    rating: 5,
    comment: "Excellent work! The website looks amazing and was delivered on time.",
    createdAt: "2024-04-15T10:00:00Z"
  },
  {
    id: "2",
    freelancerId: "2",
    customerId: "4",
    customerName: "Alice Johnson",
    jobId: "3",
    jobTitle: "E-commerce site redesign",
    rating: 4,
    comment: "Great work overall. Could have improved communication a bit, but the final result was great.",
    createdAt: "2024-03-22T14:30:00Z"
  },
  {
    id: "3",
    freelancerId: "2",
    customerId: "5",
    customerName: "Robert Chen",
    jobId: "4",
    jobTitle: "Landing page design",
    rating: 5,
    comment: "Absolutely blown away by the quality of work. Will definitely hire again!",
    createdAt: "2024-05-01T09:15:00Z"
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
