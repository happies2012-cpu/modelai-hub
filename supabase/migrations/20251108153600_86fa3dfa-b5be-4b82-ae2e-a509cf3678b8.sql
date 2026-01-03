-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('portfolio-images', 'portfolio-images', true),
  ('agency-logos', 'agency-logos', true),
  ('campaign-images', 'campaign-images', true);

-- RLS policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for portfolio-images bucket
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Models can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Models can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Models can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for agency-logos bucket
CREATE POLICY "Anyone can view agency logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-logos');

CREATE POLICY "Agencies can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Agencies can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Agencies can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for campaign-images bucket
CREATE POLICY "Anyone can view campaign images"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-images');

CREATE POLICY "Users can upload campaign images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update campaign images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete campaign images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, model_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at on favorites
CREATE TRIGGER update_favorites_updated_at
BEFORE UPDATE ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();