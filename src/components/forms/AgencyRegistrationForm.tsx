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
import { Loader2, Upload } from 'lucide-react';

const agencySchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().min(2, 'City required'),
  country: z.string().min(2, 'Country required'),
});

type AgencyFormData = z.infer<typeof agencySchema>;

const AgencyRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: AgencyFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to register an agency');
        return;
      }

      let logoUrl = null;

      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('agency-logos')
          .upload(fileName, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('agency-logos')
          .getPublicUrl(fileName);

        logoUrl = publicUrl;
      }

      const { error } = await supabase.from('agencies').insert([{
        user_id: user.id,
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        website: data.website || null,
        address: data.address,
        city: data.city,
        country: data.country,
        logo_url: logoUrl,
        status: 'pending' as const,
      }]);

      if (error) throw error;

      // Add agency role
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'agency',
      });

      toast.success('Agency registered! Pending admin approval.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register agency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Register Your Agency</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Agency Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded" />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Elite Models Agency" />
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
                  <Textarea {...field} placeholder="Tell us about your agency..." rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="info@agency.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1 234 567 8900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://www.agency.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Fashion Street" />
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
                  <FormLabel>City *</FormLabel>
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
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="United States" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Registration'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AgencyRegistrationForm;
