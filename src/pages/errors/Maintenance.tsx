import { motion } from 'framer-motion';
import { Wrench, Clock } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Maintenance = () => {
  useSEO({
    title: 'Maintenance Mode',
    description: 'The platform is currently under maintenance.',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-primary" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Under Maintenance</h1>
          <p className="text-muted-foreground">
            We're currently performing scheduled maintenance to improve your experience.
            We'll be back online shortly.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Expected completion: Soon</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;

