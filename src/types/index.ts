
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
  schedulingType: "specific" | "flexible";
  specificDate?: string;
  specificTimeSlot?: string;
  weeklyPreference?: string[];
  timeFramePreference?: string;
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
  proposedDate?: string;
  proposedTimeSlot?: string; 
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Service {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  rate: number;
  rateUnit: "hour" | "project" | "word" | "day";
}

export interface Review {
  id: string;
  freelancerId: string;
  customerId: string;
  customerName: string;
  jobId: string;
  jobTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  freelancerId: string;
  jobId: string;
  date: string;
  timeSlot: string;
  status: "scheduled" | "completed" | "cancelled";
}

export type TimeSlot = 
  | "8:00 AM - 10:00 AM" 
  | "10:00 AM - 12:00 PM"
  | "12:00 PM - 2:00 PM"
  | "2:00 PM - 4:00 PM"
  | "4:00 PM - 6:00 PM"
  | "6:00 PM - 8:00 PM";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
