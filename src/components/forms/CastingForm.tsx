import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const castingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location required'),
  city: z.string().optional(),
  country: z.string().optional(),
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  required_models: z.coerce.number().min(1, 'At least 1 model required'),
  budget_min: z.coerce.number().min(0).optional(),
  budget_max: z.coerce.number().min(0).optional(),
});

type CastingFormData = z.infer<typeof castingSchema>;

const CastingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<CastingFormData>({
    resolver: zodResolver(castingSchema),
    defaultValues: {
      required_models: 1,
    },
  });

  const onSubmit = async (data: CastingFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a casting call');
        return;
      }

      const { error } = await supabase.from('events').insert({
        created_by: user.id,
        title: data.title,
        description: data.description,
        event_type: 'casting',
        location: data.location,
        city: data.city,
        country: data.country,
        start_date: data.start_date,
        end_date: data.end_date,
        required_models: data.required_models,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Casting call created! Pending admin approval.');
      navigate('/casting');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create casting call');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create Casting Call</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casting Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Fashion Show 2024 Casting" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe the casting requirements..." rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York, USA" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="New York" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="United States" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="required_models"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Models Required *</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Min ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Max ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="2000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Casting Call'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CastingForm;
