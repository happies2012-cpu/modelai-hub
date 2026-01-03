import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AdminSetupButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'super_admin')
        .limit(1);
      
      if (data && data.length > 0) {
        setIsSetup(true);
      }
    } catch (error) {
      console.error('Error checking admin:', error);
    }
  };

  const setupAdmin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {
          email: 'pranu21m@gmail.com',
          password: 'pranu21m@gmail.com',
          makeAdmin: true
        }
      });

      if (error) throw error;

      toast.success('Admin account created successfully!', {
        description: 'Email: pranu21m@gmail.com'
      });
      setIsSetup(true);
    } catch (error: any) {
      console.error('Error setting up admin:', error);
      toast.error('Failed to setup admin', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSetup) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        Admin Configured
      </Button>
    );
  }

  return (
    <Button 
      onClick={setupAdmin} 
      disabled={isLoading}
      variant="outline"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Shield className="w-4 h-4" />
      )}
      Setup Admin Account
    </Button>
  );
};
