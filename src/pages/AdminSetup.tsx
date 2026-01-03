import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AdminSetup = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('happies2011@gmail.com');

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email },
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Admin and Super Admin roles added successfully!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-muted-foreground">Grant admin privileges to a user</p>
        </div>

        <form onSubmit={handleSetupAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Note: The user must have already signed up with this email.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Grant Admin Access
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>User must sign up at /auth first</li>
            <li>Enter their email above</li>
            <li>Click "Grant Admin Access"</li>
            <li>User will have both admin and super_admin roles</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default AdminSetup;
