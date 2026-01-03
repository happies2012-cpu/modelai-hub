import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  Building,
  Users,
  Briefcase,
  HelpCircle
} from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    setLoading(false);
  };

  const offices = [
    {
      city: 'New York',
      address: '550 Madison Avenue, 22nd Floor',
      phone: '+1 (212) 555-0100',
      email: 'newyork@gsmodeling.com',
    },
    {
      city: 'Los Angeles',
      address: '9465 Wilshire Blvd, Suite 300',
      phone: '+1 (310) 555-0100',
      email: 'losangeles@gsmodeling.com',
    },
    {
      city: 'London',
      address: '180 Strand, Westminster',
      phone: '+44 20 7555 0100',
      email: 'london@gsmodeling.com',
    },
    {
      city: 'Paris',
      address: '29 Rue du Faubourg Saint-Honoré',
      phone: '+33 1 55 55 01 00',
      email: 'paris@gsmodeling.com',
    },
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'booking', label: 'Model Booking', icon: Briefcase },
    { value: 'agency', label: 'Agency Partnership', icon: Building },
    { value: 'model', label: 'Become a Model', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                Whether you're a model, agency, or brand, we're here to help you connect with the fashion industry's best.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Inquiry Type</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className="flex items-center gap-2">
                                <cat.icon className="h-4 w-4" />
                                {cat.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:hello@gsmodeling.com" className="text-muted-foreground hover:text-primary">
                          hello@gsmodeling.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href="tel:+12125550100" className="text-muted-foreground hover:text-primary">
                          +1 (212) 555-0100
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-muted-foreground">
                          Mon - Fri: 9:00 AM - 6:00 PM (EST)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global Offices */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Global Offices</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {offices.map((office) => (
                      <Card key={office.city} className="p-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">{office.city}</p>
                            <p className="text-sm text-muted-foreground">{office.address}</p>
                            <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="text-sm text-primary hover:underline">
                              {office.phone}
                            </a>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
