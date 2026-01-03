import { User } from '@supabase/supabase-js';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, CreditCard, Users } from 'lucide-react';

interface BrandDashboardProps {
  user: User;
}

const BrandDashboard = ({ user }: BrandDashboardProps) => {
  return (
    <DashboardLayout title="Brand Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Users className="h-6 w-6 text-gold-dark" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booked Models</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saved Searches</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20">
              <div className="text-center">
                <p className="font-medium">Create Event</p>
                <p className="text-xs text-muted-foreground mt-1">Post a new campaign</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <p className="font-medium">Browse Models</p>
                <p className="text-xs text-muted-foreground mt-1">Find perfect talent</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <p className="font-medium">View Bookings</p>
                <p className="text-xs text-muted-foreground mt-1">Manage your bookings</p>
              </div>
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="events" className="w-full">
          <TabsList>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Events</h3>
              <p className="text-muted-foreground">No events created yet</p>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
              <p className="text-muted-foreground">No bookings yet</p>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment History</h3>
              <p className="text-muted-foreground">No payment history</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrandDashboard;
