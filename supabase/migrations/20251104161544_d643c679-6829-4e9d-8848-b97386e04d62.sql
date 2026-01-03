-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'agency', 'model', 'brand');

-- Create app_status enum for various statuses
CREATE TYPE public.app_status AS ENUM ('pending', 'active', 'inactive', 'suspended', 'approved', 'rejected');

-- Create payment_status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  instagram TEXT,
  twitter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- Create agencies table
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  status app_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create models table
CREATE TABLE public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  stage_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  bust_cm INTEGER,
  waist_cm INTEGER,
  hips_cm INTEGER,
  shoe_size TEXT,
  hair_color TEXT,
  eye_color TEXT,
  ethnicity TEXT,
  experience_years INTEGER,
  featured BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  available BOOLEAN NOT NULL DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_bookings INTEGER DEFAULT 0,
  status app_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create model_categories table
CREATE TABLE public.model_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default model categories
INSERT INTO public.model_categories (name, description) VALUES
  ('Editorial', 'High-fashion editorial modeling'),
  ('Runway', 'Catwalk and fashion show modeling'),
  ('Commercial', 'Commercial and advertising modeling'),
  ('Beauty', 'Beauty and cosmetic modeling'),
  ('Fitness', 'Fitness and athletic modeling'),
  ('Plus Size', 'Plus size fashion modeling'),
  ('Petite', 'Petite fashion modeling');

-- Create model_category_mapping table
CREATE TABLE public.model_category_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.model_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(model_id, category_id)
);

-- Create portfolio_images table
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  location TEXT,
  city TEXT,
  country TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  required_models INTEGER DEFAULT 1,
  status app_status NOT NULL DEFAULT 'pending',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date TIMESTAMPTZ NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status app_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT,
  transaction_id TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON public.models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_category_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for agencies
CREATE POLICY "Anyone can view approved agencies" ON public.agencies FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Agencies can update own profile" ON public.agencies FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Agencies can insert own profile" ON public.agencies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all agencies" ON public.agencies FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for models
CREATE POLICY "Anyone can view approved models" ON public.models FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Models can update own profile" ON public.models FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Models can insert own profile" ON public.models FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all models" ON public.models FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for model_categories
CREATE POLICY "Anyone can view categories" ON public.model_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.model_categories FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for model_category_mapping
CREATE POLICY "Anyone can view category mappings" ON public.model_category_mapping FOR SELECT USING (true);
CREATE POLICY "Models can manage own category mappings" ON public.model_category_mapping FOR ALL USING (
  EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
  OR public.is_admin(auth.uid())
);

-- RLS Policies for portfolio_images
CREATE POLICY "Anyone can view portfolio images" ON public.portfolio_images FOR SELECT USING (true);
CREATE POLICY "Models can manage own portfolio" ON public.portfolio_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
  OR public.is_admin(auth.uid())
);

-- RLS Policies for events
CREATE POLICY "Anyone can view active events" ON public.events FOR SELECT USING (status = 'active' OR auth.uid() = created_by OR public.is_admin(auth.uid()));
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid() = created_by OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all events" ON public.events FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Users can view related bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = client_id 
  OR EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.agencies WHERE id = agency_id AND user_id = auth.uid())
  OR public.is_admin(auth.uid())
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update related bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = client_id 
  OR EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid())
  OR public.is_admin(auth.uid())
);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed bookings" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id
  AND EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id 
    AND status = 'approved'
    AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.models WHERE id = model_id AND user_id = auth.uid()))
  )
);

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_agencies_user_id ON public.agencies(user_id);
CREATE INDEX idx_agencies_status ON public.agencies(status);
CREATE INDEX idx_models_user_id ON public.models(user_id);
CREATE INDEX idx_models_agency_id ON public.models(agency_id);
CREATE INDEX idx_models_status ON public.models(status);
CREATE INDEX idx_models_featured ON public.models(featured);
CREATE INDEX idx_portfolio_images_model_id ON public.portfolio_images(model_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_bookings_model_id ON public.bookings(model_id);
CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);