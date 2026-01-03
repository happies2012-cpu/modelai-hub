import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageSquare, Shield } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';

const SecureContact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
  });

  useSEO({
    title: 'Contact Support - Secure Form',
    description: 'Contact our support team securely through our encrypted contact form.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to contact support');
      }

      // Rate limiting
      const { checkRateLimit, RATE_LIMITS } = await import('@/lib/rate-limit');
      const rateLimit = await checkRateLimit(user.id, RATE_LIMITS.CONTACT_FORM);
      
      if (!rateLimit.allowed) {
        throw new Error(`Too many submissions. Please try again after ${new Date(rateLimit.resetAt).toLocaleTimeString()}`);
      }

      // Store contact form submission
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          status: 'open',
        });

      if (error) {
        throw error;
      }

      // Log action
      const { logError } = await import('@/lib/error-handling');
      await logError({
        level: 'info',
        message: 'Contact form submission',
        context: { category: formData.category, subject: formData.subject },
        userId: user.id,
      });

      toast({
        title: 'Message sent',
        description: 'We\'ll get back to you soon via email or through the platform.',
      });

      setFormData({ subject: '', category: '', message: '' });
    } catch (error: any) {
      const { formatErrorForUser } = await import('@/lib/error-handling');
      toast({
        title: 'Error',
        description: formatErrorForUser(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRouteWithSubscription requireSubscription>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Contact Support</h1>
            <p className="text-muted-foreground">
              Send us a secure message. We'll respond as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>Secure Contact Form</CardTitle>
                </div>
                <CardDescription>
                  Your message is encrypted and secure. We never share your information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>Alternative: AI Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For quick answers, try our AI assistant available in the bottom right corner.
                  It can help with common questions and guide you through the platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRouteWithSubscription>
  );
};

export default SecureContact;

