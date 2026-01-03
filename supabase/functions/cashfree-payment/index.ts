import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const CASHFREE_ENV = Deno.env.get("CASHFREE_ENV") || "PRODUCTION";

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Cashfree credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseUrl = CASHFREE_ENV === "PRODUCTION"
      ? "https://api.cashfree.com"
      : "https://sandbox.cashfree.com";

    if (action === "create-session") {
      const {
        orderId,
        orderAmount,
        orderCurrency,
        customerDetails,
        orderMeta,
        paymentIntentId,
      } = data;

      // Create payment session with Cashfree
      const sessionResponse = await fetch(`${baseUrl}/pg/orders`, {
        method: "POST",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: orderAmount,
          order_currency: orderCurrency,
          customer_details: {
            customer_id: customerDetails.customerId,
            customer_name: customerDetails.customerName,
            customer_email: customerDetails.customerEmail,
            customer_phone: customerDetails.customerPhone,
          },
          order_meta: {
            return_url: orderMeta.returnUrl,
            notify_url: orderMeta.notifyUrl,
          },
        }),
      });

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error("Cashfree error:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create payment session" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const sessionData = await sessionResponse.json();

      // Update payment intent with session ID
      await supabaseClient
        .from("payment_intents")
        .update({
          payu_txn_id: sessionData.payment_session_id,
          metadata: {
            ...data.metadata,
            cashfree_session_id: sessionData.payment_session_id,
          },
        })
        .eq("id", paymentIntentId);

      return new Response(
        JSON.stringify({
          paymentSessionId: sessionData.payment_session_id,
          paymentUrl: sessionData.payment_session_id
            ? `${baseUrl}/pg/orders/${orderId}/payments`
            : null,
          orderToken: sessionData.order_token,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify-webhook") {
      const { paymentIntentId, orderId, paymentStatus } = data;

      // Verify payment status with Cashfree
      const verifyResponse = await fetch(`${baseUrl}/pg/orders/${orderId}/payments`, {
        method: "GET",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      });

      if (!verifyResponse.ok) {
        return new Response(
          JSON.stringify({ verified: false, error: "Failed to verify payment" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const paymentData = await verifyResponse.json();
      const verified = paymentData.length > 0 && paymentData[0].payment_status === paymentStatus;

      return new Response(
        JSON.stringify({ verified, paymentData: paymentData[0] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cashfree payment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

