
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TaskMatch</h1>
          <Button 
            variant="outline"
            onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
          >
            {authMode === "signin" ? "Create Account" : "Sign In"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6">
              Connect with the right talent for your projects
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              TaskMatch connects customers with skilled freelancers. Post a job or find work that matches your skills.
            </p>
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Post jobs and hire quickly</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Find projects that match your skills</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Manage projects with ease</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {authMode === "signin" ? "Sign In" : "Create an Account"}
            </h2>
            {authMode === "signin" ? <SignInForm /> : <SignUpForm />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
