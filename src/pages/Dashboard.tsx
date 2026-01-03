import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUserRoles, UserRole, isAdmin } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

// Import dashboard components
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ModelDashboard from '@/components/dashboards/ModelDashboard';
import AgencyDashboard from '@/components/dashboards/AgencyDashboard';
import BrandDashboard from '@/components/dashboards/BrandDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadUserRoles(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      loadUserRoles(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserRoles = async (userId: string) => {
    const roles = await getUserRoles(userId);
    setUserRoles(roles);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Determine which dashboard to show based on roles
  if (isAdmin(userRoles)) {
    return <AdminDashboard user={user!} roles={userRoles} />;
  } else if (userRoles.includes('model')) {
    return <ModelDashboard user={user!} />;
  } else if (userRoles.includes('agency')) {
    return <AgencyDashboard user={user!} />;
  } else if (userRoles.includes('brand')) {
    return <BrandDashboard user={user!} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>No dashboard available for your role.</p>
    </div>
  );
};

export default Dashboard;
