import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PortfolioEditor } from '@/components/portfolio/PortfolioEditor';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface ModelData {
  id: string;
  full_name: string;
  stage_name?: string;
  portfolio_images: any[];
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<ModelData | null>(null);

  const fetchModelData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
          full_name,
          stage_name,
          portfolio_images(id, image_url, video_url, title, description, display_order, is_cover, image_type)
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Please create a model profile first');
          navigate('/model/profile-setup');
          return;
        }
        throw error;
      }

      // Sort images by display_order
      if (data?.portfolio_images) {
        data.portfolio_images.sort((a: any, b: any) => 
          (a.display_order || 0) - (b.display_order || 0)
        );
      }

      setModel(data as ModelData);
    } catch (error: any) {
      console.error('Error fetching model:', error);
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 py-12">
          <Card className="p-12 text-center">
            <ImagePlus className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Model Profile Found</h2>
            <p className="text-muted-foreground mb-6">
              Please create a model profile before managing your portfolio.
            </p>
            <Button onClick={() => navigate('/model/profile-setup')}>
              Create Profile
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-display">
                {model.stage_name || model.full_name}'s Portfolio
              </h1>
              <p className="text-muted-foreground mt-2">
                Drag and drop to reorder. First image becomes your profile cover.
              </p>
            </div>
          </div>
        </motion.div>

        <PortfolioEditor
          modelId={model.id}
          images={model.portfolio_images || []}
          onUpdate={fetchModelData}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
