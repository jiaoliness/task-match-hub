
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Link, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";

const BookingCalendar = () => {
  const { user, loading } = useAuth();
  const { getBookingsForFreelancer, jobs } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== "freelancer") {
    return <Navigate to="/dashboard" />;
  }
  
  const bookings = getBookingsForFreelancer(user.id);
  
  // Get bookings for the selected date
  const bookingsForSelectedDate = selectedDate 
    ? bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return isSameDay(bookingDate, selectedDate);
      })
    : [];
  
  // Get all dates that have bookings
  const bookedDates = bookings.map(booking => new Date(booking.date));
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Booking Calendar</h1>
          <p className="text-muted-foreground">Manage your work schedule and appointments.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-3 pointer-events-auto w-full max-w-none"
                  modifiers={{
                    booked: bookedDates
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgb(239, 68, 68)',
                      color: 'rgb(239, 68, 68)'
                    }
                  }}
                />
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Legend:</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-100 border border-red-500 mr-2"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Bookings for ${format(selectedDate, 'PPPP')}`
                    : "Select a date to view bookings"
                  }
                </CardTitle>
                <CardDescription>
                  {bookingsForSelectedDate.length === 0 
                    ? "No bookings scheduled for this day" 
                    : `${bookingsForSelectedDate.length} booking(s) scheduled`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {bookingsForSelectedDate.map((booking) => {
                      const job = jobs.find(j => j.id === booking.jobId);
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className={cn(
                            "h-2 w-full",
                            booking.status === "scheduled" ? "bg-blue-500" :
                            booking.status === "completed" ? "bg-green-500" : "bg-red-500"
                          )}></div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium">{job?.title || "Job"}</h3>
                                <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
                                {job?.address && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <span className="font-medium">Location:</span> {job.address.city}, {job.address.state}
                                  </p>
                                )}
                              </div>
                              <Badge>{booking.status}</Badge>
                            </div>
                            {job && (
                              <div className="mt-3">
                                <p className="text-sm mb-1"><span className="font-medium">Client:</span> {job.customerName}</p>
                                <p className="text-sm mb-1"><span className="font-medium">Budget:</span> ${job.budget}</p>
                                <Link to={`/job/${job.id}`} className="block mt-2">
                                  <Button size="sm" variant="outline">View Job Details</Button>
                                </Link>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">You have no bookings for this date.</p>
                    <Link to="/find-jobs">
                      <Button>Find Jobs</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Upcoming Bookings</h2>
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings
                .filter(booking => new Date(booking.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6)
                .map((booking) => {
                  const job = jobs.find(j => j.id === booking.jobId);
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className={cn(
                        "h-2 w-full",
                        booking.status === "scheduled" ? "bg-blue-500" :
                        booking.status === "completed" ? "bg-green-500" : "bg-red-500"
                      )}></div>
                      <CardContent className="p-4 pt-6">
                        <div>
                          <h3 className="font-medium">{job?.title || "Job"}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(booking.date), 'PPP')} • {booking.timeSlot}
                          </p>
                          {job?.address && (
                            <p className="text-xs text-muted-foreground mb-3">
                              {job.address.city}, {job.address.state}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge>{booking.status}</Badge>
                          <Link to={`/job/${job?.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">You have no upcoming bookings.</p>
                <Link to="/find-jobs">
                  <Button className="mt-3">Find Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingCalendar;
