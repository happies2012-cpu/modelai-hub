import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hasActiveSubscription } from '@/lib/payments';
import { MessageCircle, ExternalLink, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';
import { useNavigate } from 'react-router-dom';

const CommunityAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useSEO({
    title: 'Community Access - Exclusive Groups',
    description: 'Access premium WhatsApp and Telegram communities reserved for paid members.',
  });

  const [communities, setCommunities] = useState<Array<{
    id: string;
    name: string;
    description: string;
    icon: JSX.Element;
    link: string;
    type: string;
  }>>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const active = await hasActiveSubscription(user.id);
        setHasSubscription(active);
        
        if (active) {
          // Load communities from database
          const { data: communitiesData, error } = await supabase
            .from('communities')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: true });

          if (!error && communitiesData) {
            setCommunities(
              communitiesData.map((comm) => ({
                id: comm.id,
                name: comm.name,
                description: comm.description || '',
                icon: <MessageCircle className="w-6 h-6" />,
                link: comm.link,
                type: comm.type,
              }))
            );
          }
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard',
    });
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <ProtectedRouteWithSubscription requireSubscription>
        <div className="min-h-screen flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-5 h-5" />
                <CardTitle>Subscription Required</CardTitle>
              </div>
              <CardDescription>
                You need an active subscription to access premium communities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/pricing')}>
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRouteWithSubscription>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Community Access</h1>
            <p className="text-muted-foreground">
              Join exclusive communities reserved for premium members
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {community.icon}
                      </div>
                      <CardTitle>{community.name}</CardTitle>
                    </div>
                    <CardDescription>{community.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                      <span className="text-sm font-mono text-muted-foreground truncate flex-1">
                        {community.link}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(community.link, community.id)}
                      >
                        {copied === community.id ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => window.open(community.link, '_blank')}
                    >
                      Join {community.type === 'whatsapp' ? 'WhatsApp' : 'Telegram'} Group
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be respectful to all members</li>
                  <li>• No spam or promotional content</li>
                  <li>• Keep discussions relevant and constructive</li>
                  <li>• Violations may result in removal from communities</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CommunityAccess;

