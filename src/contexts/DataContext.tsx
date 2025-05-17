
import { createContext, useContext, useState, ReactNode } from "react";
import { Job, JobApplication } from "@/types";

interface DataContextType {
  jobs: Job[];
  applications: JobApplication[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => Promise<Job>;
  getJobsForCustomer: (customerId: string) => Job[];
  getAvailableJobsForFreelancer: () => Job[];
  applyToJob: (application: Omit<JobApplication, "id" | "createdAt" | "status">) => Promise<JobApplication>;
  getApplicationsForFreelancer: (freelancerId: string) => JobApplication[];
  getApplicationsForJob: (jobId: string) => JobApplication[];
  updateApplicationStatus: (applicationId: string, status: "accepted" | "rejected") => Promise<void>;
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);

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

  return (
    <DataContext.Provider value={{ 
      jobs, 
      applications, 
      addJob, 
      getJobsForCustomer, 
      getAvailableJobsForFreelancer,
      applyToJob,
      getApplicationsForFreelancer,
      getApplicationsForJob,
      updateApplicationStatus
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
