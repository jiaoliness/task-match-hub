
import { Service } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FreelancerServicesProps {
  services: Service[];
}

export function FreelancerServices({ services }: FreelancerServicesProps) {
  const formatRate = (rate: number, unit: string) => {
    const formattedRate = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(rate);
    
    switch (unit) {
      case 'hour':
        return `${formattedRate}/hr`;
      case 'day':
        return `${formattedRate}/day`;
      case 'word':
        return `${formattedRate}/word`;
      case 'project':
        return `${formattedRate}`;
      default:
        return formattedRate;
    }
  };
  
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">This freelancer has not listed any services yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="h-full overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
            <CardDescription>
              <Badge variant="outline" className="mt-1">
                {formatRate(service.rate, service.rateUnit)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[120px] overflow-y-auto">
            <p className="text-sm text-gray-600">{service.description}</p>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4">
            <Button className="w-full">Request This Service</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
