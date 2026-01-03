import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Home, ArrowLeft } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Forbidden = () => {
  const navigate = useNavigate();

  useSEO({
    title: '403 - Forbidden',
    description: 'Access to this resource is forbidden.',
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
            <Lock className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">403</h1>
          <h2 className="text-2xl font-semibold">Forbidden</h2>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page. 
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
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

export default Forbidden;

