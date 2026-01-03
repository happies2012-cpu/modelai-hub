-- Drop and recreate storage policies with unique names for portfolios bucket
DROP POLICY IF EXISTS "Users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio images" ON storage.objects;

-- Create storage policies for portfolio uploads with unique names
CREATE POLICY "Portfolio upload allowed for owners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolios' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Portfolio update allowed for owners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolios' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Portfolio delete allowed for owners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolios' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);