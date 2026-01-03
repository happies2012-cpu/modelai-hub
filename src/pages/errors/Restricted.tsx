import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ban, Home, CreditCard } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Restricted = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Restricted Access',
    description: 'This content requires a premium subscription.',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Ban className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Restricted Access</h1>
          <p className="text-muted-foreground">
            This content is available only to premium subscribers. 
            Subscribe now to unlock all features and exclusive content.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/pricing')}>
            <CreditCard className="mr-2 h-4 w-4" />
            View Plans
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Restricted;

