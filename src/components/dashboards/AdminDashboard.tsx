import { User } from '@supabase/supabase-js';
import { UserRole } from '@/lib/auth';
import { DashboardLayout } from './DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, CreditCard, Shield, Loader2 } from 'lucide-react';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { UserManagement } from '@/components/admin/UserManagement';
import { PayoutsManagement } from '@/components/admin/PayoutsManagement';
import { ContentModeration } from '@/components/admin/ContentModeration';

interface AdminDashboardProps {
  user: User;
  roles: UserRole[];
}

const AdminDashboard = ({ user, roles }: AdminDashboardProps) => {
  const isSuperAdmin = roles.includes('super_admin');

  return (
    <DashboardLayout title={isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payouts</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="payouts">
          <PayoutsManagement />
        </TabsContent>

        <TabsContent value="moderation">
          <ContentModeration />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
