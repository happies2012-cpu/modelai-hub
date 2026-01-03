import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PayU configuration
const PAYU_BASE_URL = Deno.env.get("PAYU_MODE") === "live" 
  ? "https://secure.payu.in/_payment" 
  : "https://test.payu.in/_payment";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, ...data } = await req.json();

    if (action === "create-payment") {
      const { bookingId, amount, productInfo, firstName, email, phone, userId } = data;

      const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
      const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");

      if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
        console.error("PayU credentials not configured");
        return new Response(
          JSON.stringify({ error: "Payment gateway not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate transaction ID
      const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

      // Create hash string
      const hashString = `${PAYU_MERCHANT_KEY}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
      
      // Generate SHA512 hash
      const encoder = new TextEncoder();
      const hashData = encoder.encode(hashString);
      const hashBuffer = await crypto.subtle.digest("SHA-512", hashData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Store payment intent in database
      const { error: dbError } = await supabaseClient.from("payment_intents").insert({
        user_id: userId,
        booking_id: bookingId,
        amount: parseFloat(amount),
        currency: "INR",
        status: "pending",
        payu_txn_id: txnId,
        payu_hash: hash,
        payment_method: "payu",
        metadata: { productInfo, firstName, email, phone },
      });

      if (dbError) {
        console.error("Database error:", dbError);
        return new Response(
          JSON.stringify({ error: "Failed to create payment record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          paymentData: {
            key: PAYU_MERCHANT_KEY,
            txnid: txnId,
            amount,
            productinfo: productInfo,
            firstname: firstName,
            email,
            phone,
            hash,
            surl: `${req.headers.get("origin")}/payment/success`,
            furl: `${req.headers.get("origin")}/payment/failure`,
            payuUrl: PAYU_BASE_URL,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify-payment") {
      const { txnId, status, payuResponse } = data;

      // Update payment status
      const { error: updateError } = await supabaseClient
        .from("payment_intents")
        .update({
          status: status === "success" ? "completed" : "failed",
          metadata: payuResponse,
          updated_at: new Date().toISOString(),
        })
        .eq("payu_txn_id", txnId);

      if (updateError) {
        console.error("Failed to update payment:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update payment status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If payment successful, update booking status
      if (status === "success") {
        const { data: paymentData } = await supabaseClient
          .from("payment_intents")
          .select("booking_id")
          .eq("payu_txn_id", txnId)
          .single();

        if (paymentData?.booking_id) {
          await supabaseClient
            .from("bookings")
            .update({ status: "approved" })
            .eq("id", paymentData.booking_id);
        }
      }

      return new Response(
        JSON.stringify({ success: true, status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Payment processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
