import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const modelSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  stage_name: z.string().optional(),
  gender: z.enum(['male', 'female', 'non-binary']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  height_cm: z.coerce.number().min(140).max(220),
  weight_kg: z.coerce.number().min(40).max(150).optional(),
  bust_cm: z.coerce.number().optional(),
  waist_cm: z.coerce.number().optional(),
  hips_cm: z.coerce.number().optional(),
  shoe_size: z.string().optional(),
  hair_color: z.string().optional(),
  eye_color: z.string().optional(),
  ethnicity: z.string().optional(),
  experience_years: z.coerce.number().min(0).optional(),
});

type ModelFormData = z.infer<typeof modelSchema>;

const ModelProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      gender: 'female',
    },
  });

  const onSubmit = async (data: ModelFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a model profile');
        return;
      }

      const { error } = await supabase.from('models').insert([{
        user_id: user.id,
        full_name: data.full_name,
        stage_name: data.stage_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        bust_cm: data.bust_cm,
        waist_cm: data.waist_cm,
        hips_cm: data.hips_cm,
        shoe_size: data.shoe_size,
        hair_color: data.hair_color,
        eye_color: data.eye_color,
        ethnicity: data.ethnicity,
        experience_years: data.experience_years,
        status: 'pending' as const,
      }]);

      if (error) throw error;

      // Add model role
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'model',
      });

      toast.success('Model profile created! Pending admin approval.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create Model Profile</h2>
      
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex-1 h-2 rounded ml-2 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>Personal Info</span>
          <span className={step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>Physical Stats</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional stage name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-Binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethnicity</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Caucasian, Asian, African" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" onClick={() => setStep(2)} className="w-full">
                Next Step
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm) *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="175" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="65" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bust_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bust (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="90" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waist_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waist (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="65" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hips_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hips (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="95" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shoe_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shoe Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., US 8, EU 39" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hair_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hair Color</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brown" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eye_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eye Color</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Blue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Profile'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ModelProfileForm;
