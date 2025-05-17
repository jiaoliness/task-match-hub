
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Briefcase, Mail, User } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col w-full">
        {/* Top Nav */}
        <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <Link to="/dashboard" className="text-xl font-bold text-primary">TaskMatch</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DashboardSidebar() {
  const { user } = useAuth();
  const { collapsed } = useSidebar();
  
  const customerMenuItems = [
    { name: "Dashboard", icon: User, path: "/dashboard" },
    { name: "My Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Post a Job", icon: Mail, path: "/post-job" },
  ];
  
  const freelancerMenuItems = [
    { name: "Dashboard", icon: User, path: "/dashboard" },
    { name: "Find Jobs", icon: Briefcase, path: "/find-jobs" },
    { name: "My Applications", icon: Mail, path: "/applications" },
  ];
  
  const menuItems = user?.role === "customer" ? customerMenuItems : freelancerMenuItems;
  
  return (
    <Sidebar 
      className={cn(
        "border-r bg-sidebar transition-all duration-300 hidden md:flex",
        collapsed ? "w-14" : "w-64"
      )}
      collapsible
    >
      <SidebarContent>
        <SidebarTrigger className="absolute right-2 top-2" />
        
        <div className="p-4">
          <h2 className={cn(
            "font-semibold transition-all duration-300", 
            collapsed ? "opacity-0 h-0" : "opacity-100"
          )}>
            {user?.role === "customer" ? "Customer" : "Freelancer"} Portal
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "transition-opacity", 
            collapsed ? "opacity-0" : "opacity-100"
          )}>
            Menu
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center py-2 px-3 rounded-md hover:bg-sidebar-accent"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span className={cn(
                        "transition-all duration-300", 
                        collapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
