import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUserRoles, UserRole, isAdmin } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [],
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);
      
      if (requiredRoles.length > 0 || requireAdmin) {
        const roles = await getUserRoles(session.user.id);
        setUserRoles(roles);
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setUser(null);
          setUserRoles([]);
          setLoading(false);
          return;
        }

        setUser(session.user);
        
        if (requiredRoles.length > 0 || requireAdmin) {
          const roles = await getUserRoles(session.user.id);
          setUserRoles(roles);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [requiredRoles, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin(userRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
