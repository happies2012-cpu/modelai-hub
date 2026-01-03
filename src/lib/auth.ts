import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'agency' | 'model' | 'brand';

export const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) return { error };
  if (!data.user) return { error: new Error('Failed to create user') };

  // Add role after user is created
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: data.user.id, role });

  if (roleError) return { error: roleError };

  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error || !data) return [];
  return data.map((r) => r.role as UserRole);
};

export const hasRole = (roles: UserRole[], role: UserRole): boolean => {
  return roles.includes(role);
};

export const isAdmin = (roles: UserRole[]): boolean => {
  return roles.includes('admin') || roles.includes('super_admin');
};
