
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import CustomerJobs from "./pages/CustomerJobs";
import FindJobs from "./pages/FindJobs";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import FreelancerProfile from "./pages/FreelancerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<CustomerJobs />} />
                <Route path="/find-jobs" element={<FindJobs />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/job/:id" element={<JobDetail />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/freelancer/:id" element={<FreelancerProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
