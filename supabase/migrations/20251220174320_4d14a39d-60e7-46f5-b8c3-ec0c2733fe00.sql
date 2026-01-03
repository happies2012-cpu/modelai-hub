-- Add typing_status column for real-time typing indicators
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS typing_status boolean DEFAULT false;

-- Create payment_intents table for PayU integration
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  booking_id uuid REFERENCES public.bookings(id),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  payu_txn_id text,
  payu_hash text,
  payment_method text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on payment_intents
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_intents
CREATE POLICY "Users can view own payment intents"
  ON public.payment_intents FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create payment intents"
  ON public.payment_intents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment intents"
  ON public.payment_intents FOR ALL
  USING (is_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON public.payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_booking_id ON public.payment_intents(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_realtime ON public.messages(sender_id, receiver_id, created_at DESC);