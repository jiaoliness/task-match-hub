
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { FreelancerDashboard } from "@/components/dashboard/FreelancerDashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return (
    <DashboardLayout>
      {user.role === "freelancer" ? (
        <FreelancerDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
