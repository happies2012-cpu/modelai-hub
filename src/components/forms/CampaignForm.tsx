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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  brand_name: z.string().min(2, 'Brand name required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  campaign_type: z.string().min(1, 'Campaign type required'),
  location: z.string().min(2, 'Location required'),
  city: z.string().optional(),
  country: z.string().optional(),
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  budget_min: z.coerce.number().min(0).optional(),
  budget_max: z.coerce.number().min(0).optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const CampaignForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: CampaignFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a campaign');
        return;
      }

      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { error } = await supabase.from('campaigns').insert([{
        client_id: user.id,
        title: data.title,
        brand_name: data.brand_name,
        description: data.description,
        campaign_type: data.campaign_type,
        location: data.location,
        city: data.city,
        country: data.country,
        start_date: data.start_date,
        end_date: data.end_date,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        slug,
        status: 'pending' as const,
      }]);

      if (error) throw error;

      // Add brand role if not already present
      await supabase.from('user_roles').upsert({
        user_id: user.id,
        role: 'brand',
      }, { onConflict: 'user_id,role' });

      toast.success('Campaign created! Pending admin approval.');
      navigate('/campaigns');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create Campaign</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Summer Fashion Collection 2024" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Brand" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="campaign_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="runway">Runway</SelectItem>
                    <SelectItem value="print">Print</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Textarea {...field} placeholder="Describe your campaign..." rows={4} />
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Min ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="5000" />
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
                    <Input type="number" {...field} placeholder="10000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Campaign'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CampaignForm;
