import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { SortableImage } from './SortableImage';
import { VideoEmbed } from './VideoEmbed';
import { 
  ImagePlus, 
  Video, 
  Camera, 
  Sparkles, 
  Upload, 
  Loader2,
  Save
} from 'lucide-react';

interface PortfolioImage {
  id: string;
  image_url: string;
  video_url?: string | null;
  title?: string | null;
  description?: string | null;
  display_order: number | null;
  is_cover: boolean;
  image_type?: string | null;
}

interface PortfolioEditorProps {
  modelId: string;
  images: PortfolioImage[];
  onUpdate: () => void;
}

export const PortfolioEditor = ({ modelId, images, onUpdate }: PortfolioEditorProps) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [localImages, setLocalImages] = useState<PortfolioImage[]>(images);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredImages = localImages.filter(img => {
    if (activeTab === 'portfolio') return !img.image_type || img.image_type === 'portfolio';
    if (activeTab === 'polaroids') return img.image_type === 'polaroid';
    if (activeTab === 'digitals') return img.image_type === 'digitals';
    if (activeTab === 'videos') return img.image_type === 'video' || img.video_url;
    return true;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload images');
        return;
      }

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolios')
          .getPublicUrl(fileName);

        const { data: newImage, error: insertError } = await supabase
          .from('portfolio_images')
          .insert({
            model_id: modelId,
            image_url: publicUrl,
            image_type: imageType,
            display_order: localImages.length,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setLocalImages(prev => [...prev, newImage as PortfolioImage]);
      }

      toast.success('Images uploaded successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [modelId, localImages.length, onUpdate]);

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;

    try {
      const { data: newImage, error } = await supabase
        .from('portfolio_images')
        .insert({
          model_id: modelId,
          image_url: '/placeholder.svg',
          video_url: videoUrl,
          image_type: 'video',
          display_order: localImages.length,
        })
        .select()
        .single();

      if (error) throw error;

      setLocalImages(prev => [...prev, newImage as PortfolioImage]);
      setVideoUrl('');
      setVideoDialogOpen(false);
      toast.success('Video added successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add video');
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      await supabase
        .from('portfolio_images')
        .update({ is_cover: false })
        .eq('model_id', modelId);

      await supabase
        .from('portfolio_images')
        .update({ is_cover: true })
        .eq('id', imageId);

      setLocalImages(prev =>
        prev.map(img => ({ ...img, is_cover: img.id === imageId }))
      );
      toast.success('Cover image updated');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to set cover image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setLocalImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const updates = localImages.map((img, index) => ({
        id: img.id,
        model_id: modelId,
        image_url: img.image_url,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('portfolio_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast.success('Order saved successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const tabConfig = [
    { id: 'portfolio', label: 'Portfolio', icon: ImagePlus, type: 'portfolio' },
    { id: 'polaroids', label: 'Polaroids', icon: Camera, type: 'polaroid' },
    { id: 'digitals', label: 'Digitals', icon: Sparkles, type: 'digitals' },
    { id: 'videos', label: 'Videos', icon: Video, type: 'video' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display">Portfolio Editor</h2>
        <Button onClick={handleSaveOrder} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Order
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          {tabConfig.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{tab.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tab.id === 'polaroids' && 'Natural, unedited photos for casting directors'}
                    {tab.id === 'digitals' && 'Professional digitals with clean background'}
                    {tab.id === 'portfolio' && 'Your best professional work'}
                    {tab.id === 'videos' && 'Video reels and walkthrough clips'}
                  </p>
                </div>

                {tab.id === 'videos' ? (
                  <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Video className="h-4 w-4 mr-2" />
                        Add Video
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Video Embed</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Video URL (YouTube, Vimeo, or MP4)</Label>
                          <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                          />
                        </div>
                        <Button onClick={handleAddVideo} className="w-full">
                          Add Video
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, tab.type)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button disabled={uploading}>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Images
                    </Button>
                  </div>
                )}
              </div>

              {filteredImages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-dashed rounded-xl p-12 text-center"
                >
                  <tab.icon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    {tab.id === 'videos' 
                      ? 'No videos yet. Add your first video reel!'
                      : 'No images yet. Upload your first photo!'}
                  </p>
                </motion.div>
              ) : tab.id === 'videos' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredImages.map((image) => (
                      <VideoEmbed
                        key={image.id}
                        id={image.id}
                        videoUrl={image.video_url || ''}
                        onDelete={() => handleDeleteImage(image.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredImages.map(img => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredImages.map((image) => (
                          <SortableImage
                            key={image.id}
                            id={image.id}
                            image={image}
                            onSetCover={() => handleSetCover(image.id)}
                            onDelete={() => handleDeleteImage(image.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};
