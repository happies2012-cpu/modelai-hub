import { User } from '@supabase/supabase-js';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, TrendingUp, DollarSign, Star } from 'lucide-react';
import { useAgencyAnalytics } from '@/hooks/useAgencyAnalytics';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface AgencyDashboardProps {
  user: User;
}

const AgencyDashboard = ({ user }: AgencyDashboardProps) => {
  const { data: analytics, isLoading } = useAgencyAnalytics(user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Agency Dashboard">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Agency Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${analytics?.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Users className="h-6 w-6 text-gold-dark" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold">{analytics?.totalModels}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
                <p className="text-2xl font-bold">{analytics?.activeBookings}</p>
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
                <p className="font-medium">Add Model to Roster</p>
                <p className="text-xs text-muted-foreground mt-1">Manage your talent</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <p className="font-medium">Post Casting Call</p>
                <p className="text-xs text-muted-foreground mt-1">Find new talent</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <p className="font-medium">Agency Profile</p>
                <p className="text-xs text-muted-foreground mt-1">Update your profile</p>
              </div>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Models</h3>
            {analytics?.topPerformingModels && analytics.topPerformingModels.length > 0 ? (
              <div className="space-y-4">
                {analytics.topPerformingModels.map((model: any) => (
                  <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{model.stage_name || model.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        <span>{model.rating?.toFixed(1) || '0.0'}</span>
                        <span>•</span>
                        <span>{model.total_bookings || 0} bookings</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${model.earnings.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No model data available</p>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentBookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{booking.model?.stage_name || booking.model?.full_name}</TableCell>
                    <TableCell>{booking.client?.full_name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">${Number(booking.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No bookings yet</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgencyDashboard;
