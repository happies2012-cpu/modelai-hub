import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Unauthorized = () => {
  const navigate = useNavigate();

  useSEO({
    title: '401 - Unauthorized',
    description: 'You are not authorized to access this resource.',
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
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">401</h1>
          <h2 className="text-2xl font-semibold">Unauthorized</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this resource. Please sign in or contact support.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/login')}>
            Sign In
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

export default Unauthorized;

