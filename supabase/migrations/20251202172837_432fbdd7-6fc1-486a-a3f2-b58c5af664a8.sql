-- Create messages table for real-time inbox
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  agency_id UUID REFERENCES public.agencies(id),
  terms TEXT,
  usage_rights TEXT,
  duration_days INTEGER,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'draft',
  signed_by_model BOOLEAN DEFAULT false,
  signed_by_client BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commissions table
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  agency_id UUID REFERENCES public.agencies(id),
  model_id UUID REFERENCES public.models(id),
  total_amount NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  agency_commission NUMERIC DEFAULT 0,
  model_payout NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create analytics_views table
CREATE TABLE public.analytics_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  viewer_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create collections table for favorites grouping
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create collection_items table
CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(collection_id, model_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- Messages RLS
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Notifications RLS
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Contracts RLS
CREATE POLICY "Users can view related contracts" ON public.contracts
  FOR SELECT USING (
    auth.uid() = client_id OR 
    EXISTS (SELECT 1 FROM models WHERE id = contracts.model_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM agencies WHERE id = contracts.agency_id AND user_id = auth.uid()) OR
    is_admin(auth.uid())
  );
CREATE POLICY "Clients can create contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Related users can update contracts" ON public.contracts
  FOR UPDATE USING (
    auth.uid() = client_id OR 
    EXISTS (SELECT 1 FROM models WHERE id = contracts.model_id AND user_id = auth.uid()) OR
    is_admin(auth.uid())
  );

-- Commissions RLS
CREATE POLICY "Admins can manage commissions" ON public.commissions
  FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Users can view related commissions" ON public.commissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM models WHERE id = commissions.model_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM agencies WHERE id = commissions.agency_id AND user_id = auth.uid())
  );

-- Analytics views RLS
CREATE POLICY "Anyone can create views" ON public.analytics_views
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.analytics_views
  FOR SELECT USING (is_admin(auth.uid()));

-- Collections RLS
CREATE POLICY "Users can manage own collections" ON public.collections
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public collections" ON public.collections
  FOR SELECT USING (is_public = true);

-- Collection items RLS
CREATE POLICY "Users can manage own collection items" ON public.collection_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_items.collection_id AND user_id = auth.uid())
  );
CREATE POLICY "Anyone can view public collection items" ON public.collection_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_items.collection_id AND is_public = true)
  );

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;