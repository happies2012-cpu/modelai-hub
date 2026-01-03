import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database } from 'lucide-react';

export const SeedDatabaseButton = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-data');
      
      if (error) throw error;

      toast({
        title: 'Database Seeded Successfully',
        description: `Added ${data.stats.models} models, ${data.stats.agencies} agencies, ${data.stats.campaigns} campaigns, and more!`,
      });
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: 'Seeding Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isSeeding} size="lg" variant="outline">
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Seeding Database...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Seed Database
        </>
      )}
    </Button>
  );
};
