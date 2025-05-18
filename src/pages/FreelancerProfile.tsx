
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Briefcase, MessageSquare, Settings } from "lucide-react";
import { FreelancerServices } from "@/components/profile/FreelancerServices";
import { FreelancerReviews } from "@/components/profile/FreelancerReviews";
import { User } from "@/types";

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getServicesForFreelancer, getReviewsForFreelancer } = useData();
  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the freelancer data from an API
    // For now, we'll use a mock freelancer
    setTimeout(() => {
      const mockFreelancer: User = {
        id: id || "2",
        email: "mike@electricpro.com",
        name: "Mike Johnson",
        role: "freelancer",
        bio: "Licensed electrician with over 15 years of experience in residential and commercial electrical services. Available 24/7 for emergency calls. I specialize in electrical repairs, installations, and troubleshooting to ensure your home's electrical systems are safe and functioning properly.",
        skills: ["Electrical Repairs", "Panel Upgrades", "Lighting Installation", "Home Inspections", "Code Compliance", "Emergency Services"],
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=250&h=250&auto=format&fit=crop"
      };
      
      setFreelancer(mockFreelancer);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Freelancer Not Found</h1>
          <p className="mt-2 text-muted-foreground">The freelancer you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const services = getServicesForFreelancer(freelancer.id);
  const reviews = getReviewsForFreelancer(freelancer.id);
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline mb-4 inline-flex items-center">
            <span className="mr-1">←</span> Back to TaskMatch
          </Link>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
              {user && user.id === freelancer.id && (
                <Link to="/profile" className="absolute top-4 right-4">
                  <Button variant="secondary" size="sm" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 -mt-20">
                  <Avatar className="h-32 w-32 border-4 border-white rounded-full">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback className="text-3xl">
                      {freelancer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{freelancer.name}</h1>
                      {averageRating > 0 && (
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(averageRating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : i < averageRating
                                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium">
                            {averageRating.toFixed(1)} ({reviews.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <Button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700">
                        <Briefcase className="h-4 w-4" />
                        <span>Hire Now</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700">{freelancer.bio}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {freelancer.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="services" className="mt-8">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="services" className="mt-0">
              <FreelancerServices services={services} />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <FreelancerReviews reviews={reviews} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerProfile;
