import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const ServerError = () => {
  const navigate = useNavigate();

  useSEO({
    title: '500 - Server Error',
    description: 'An internal server error occurred.',
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
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">500</h1>
          <h2 className="text-2xl font-semibold">Server Error</h2>
          <p className="text-muted-foreground">
            Something went wrong on our end. We're working to fix it. 
            Please try again later or contact support if the problem persists.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
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

export default ServerError;

