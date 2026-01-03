import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          {/* Large 404 */}
          <div className="text-[200px] md:text-[280px] font-display font-bold leading-none text-muted/20 select-none">
            404
          </div>
          
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-6xl md:text-8xl font-display font-bold text-foreground">
                Lost?
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground">
            This page doesn't exist
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for might have been moved, deleted, or never existed. 
            Let's get you back on track.
          </p>

          <div className="w-16 h-px bg-accent mx-auto" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group h-12 px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="h-12 px-6 bg-primary hover:bg-primary/90 group"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <Button
              onClick={() => navigate('/search')}
              variant="outline"
              className="group h-12 px-6"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Models
            </Button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
