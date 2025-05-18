
import { useState } from "react";
import { Review } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";

interface FreelancerReviewsProps {
  reviews: Review[];
}

export function FreelancerReviews({ reviews }: FreelancerReviewsProps) {
  const [sorting, setSorting] = useState<"newest" | "highest" | "lowest">("newest");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sorting) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">This freelancer has not received any reviews yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const ratingCounts = [0, 0, 0, 0, 0]; // 1-star to 5-star counts
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Client Satisfaction</CardTitle>
          <CardDescription>Based on {totalReviews} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex mt-2">
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
              <div className="text-sm text-muted-foreground mt-1">{totalReviews} reviews</div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center my-1">
                  <div className="text-sm font-medium w-10">{rating} stars</div>
                  <div className="flex-1 mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400" 
                      style={{ 
                        width: `${totalReviews > 0 ? (ratingCounts[rating - 1] / totalReviews) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 w-10">{ratingCounts[rating - 1]}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant={sorting === "newest" ? "default" : "outline"}
              onClick={() => setSorting("newest")}
            >
              Newest
            </Button>
            <Button 
              size="sm" 
              variant={sorting === "highest" ? "default" : "outline"}
              onClick={() => setSorting("highest")}
            >
              Highest
            </Button>
            <Button 
              size="sm" 
              variant={sorting === "lowest" ? "default" : "outline"}
              onClick={() => setSorting("lowest")}
            >
              Lowest
            </Button>
          </div>
        </div>
      </div>

      {reviews.length > 2 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {sortedReviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-4">
            <CarouselPrevious className="static transform-none" />
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{review.customerName}</CardTitle>
              <CardDescription className="text-xs">{formatDate(review.createdAt)}</CardDescription>
            </div>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{review.comment}</p>
        <p className="text-xs text-muted-foreground">Project: {review.jobTitle}</p>
      </CardContent>
    </Card>
  );
}
