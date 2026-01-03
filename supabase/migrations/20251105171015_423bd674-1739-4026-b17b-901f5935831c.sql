-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  campaign_type TEXT, -- 'fashion', 'editorial', 'commercial', 'runway'
  brand_name TEXT,
  client_id UUID REFERENCES auth.users(id),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget_min NUMERIC,
  budget_max NUMERIC,
  location TEXT,
  city TEXT,
  country TEXT,
  images TEXT[], -- Array of image URLs
  featured BOOLEAN NOT NULL DEFAULT false,
  status app_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view approved campaigns"
ON public.campaigns
FOR SELECT
USING (status = 'approved' OR auth.uid() = client_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create campaigns"
ON public.campaigns
FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own campaigns"
ON public.campaigns
FOR UPDATE
USING (auth.uid() = client_id OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage all campaigns"
ON public.campaigns
FOR ALL
USING (is_admin(auth.uid()));

-- Create index for slugs and search
CREATE INDEX idx_campaigns_slug ON public.campaigns(slug);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_featured ON public.campaigns(featured);

-- Add trigger for updated_at
CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();