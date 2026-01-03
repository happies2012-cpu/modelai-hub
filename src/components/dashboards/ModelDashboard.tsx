import { User } from '@supabase/supabase-js';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Camera, Calendar, Star, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModelAnalytics } from '@/hooks/useModelAnalytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ModelDashboardProps {
  user: User;
}

const ModelDashboard = ({ user }: ModelDashboardProps) => {
  const navigate = useNavigate();
  const { data: analytics, isLoading } = useModelAnalytics(user.id);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--gold))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Model Dashboard">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Model Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${analytics?.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Calendar className="h-6 w-6 text-gold-dark" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{analytics?.totalBookings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{analytics?.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-muted rounded-lg">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portfolio</p>
                <p className="text-2xl font-bold">{analytics?.portfolioCount} photos</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/model/profile-setup')} className="h-20">
              <div className="text-center">
                <p className="font-medium">Complete Your Profile</p>
                <p className="text-xs text-muted-foreground mt-1">Add measurements & details</p>
              </div>
            </Button>
            <Button variant="outline" onClick={() => navigate('/model/portfolio')} className="h-20">
              <div className="text-center">
                <p className="font-medium">Upload Portfolio</p>
                <p className="text-xs text-muted-foreground mt-1">Add your best shots</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <p className="font-medium">Browse Events</p>
                <p className="text-xs text-muted-foreground mt-1">Find opportunities</p>
              </div>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.monthlyEarnings}>
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
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Earnings ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bookings by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {analytics?.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentBookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{booking.client?.full_name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">${Number(booking.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(booking.start_time), 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}
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

export default ModelDashboard;
