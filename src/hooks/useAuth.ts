import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'agency' | 'model' | 'brand';

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    roles: [],
    isLoading: true,
    isAdmin: false,
    isSuperAdmin: false
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Defer role fetching with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            roles: [],
            isAdmin: false,
            isSuperAdmin: false,
            isLoading: false
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;

      const roles = (data || []).map(r => r.role as UserRole);
      const isAdmin = roles.includes('admin') || roles.includes('super_admin');
      const isSuperAdmin = roles.includes('super_admin');

      setAuthState(prev => ({
        ...prev,
        roles,
        isAdmin,
        isSuperAdmin,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.roles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => authState.roles.includes(role));
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    hasRole,
    hasAnyRole
  };
};
