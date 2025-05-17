
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { CheckIcon } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-6">Choose how you want to use TaskMatch</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <RoleCard
          title="I need to hire"
          description="Post jobs and find talented freelancers to complete your projects"
          role="customer"
          isSelected={selectedRole === "customer"}
          onSelect={handleRoleSelect}
        />
        
        <RoleCard
          title="I want work"
          description="Find jobs that match your skills and grow your freelance business"
          role="freelancer"
          isSelected={selectedRole === "freelancer"}
          onSelect={handleRoleSelect}
        />
      </div>
      
      <Button 
        onClick={handleContinue} 
        disabled={!selectedRole}
        className="mt-8 w-40"
      >
        Continue
      </Button>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  role: UserRole;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

function RoleCard({ title, description, role, isSelected, onSelect }: RoleCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-2 ring-primary/20" : ""
      }`}
      onClick={() => onSelect(role)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          {isSelected && <CheckIcon className="text-primary h-5 w-5" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-24">
        {role === "customer" ? (
          <div className="text-sm text-muted-foreground">
            <p>• Post detailed job descriptions</p>
            <p>• Review applications and select freelancers</p>
            <p>• Get your projects completed efficiently</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>• Create a professional profile</p>
            <p>• Browse and apply to relevant projects</p>
            <p>• Build your freelance portfolio</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full"
          onClick={() => onSelect(role)}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
