
export type UserRole = "customer" | "freelancer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  customerId: string;
  customerName: string;
  status: "open" | "assigned" | "completed";
  skills: string[];
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
