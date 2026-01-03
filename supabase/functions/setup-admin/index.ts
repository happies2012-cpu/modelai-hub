import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, password, makeAdmin } = await req.json();

    console.log("Setting up admin for email:", email);

    // First try to sign in to see if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    let userId: string;

    if (signInError) {
      // User doesn't exist, create them
      console.log("User doesn't exist, creating...");
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        return new Response(
          JSON.stringify({ error: signUpError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = signUpData.user.id;
    } else {
      userId = signInData.user.id;
    }

    console.log("User ID:", userId);

    if (makeAdmin) {
      // Add admin and super_admin roles
      const rolesToAdd = ['admin', 'super_admin'];
      
      for (const role of rolesToAdd) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
        
        if (roleError) {
          console.error(`Error adding ${role} role:`, roleError);
        } else {
          console.log(`Added ${role} role successfully`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin setup completed successfully",
        userId
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in setup-admin function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
