import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ModelProfileForm from '@/components/forms/ModelProfileForm';
import { motion } from 'framer-motion';

const ProfileSetup = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold font-display mb-4">
                Become a Model
              </h1>
              <p className="text-muted-foreground">
                Complete your profile to start receiving booking requests from top brands and agencies.
              </p>
            </div>
            
            <ModelProfileForm />
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileSetup;
