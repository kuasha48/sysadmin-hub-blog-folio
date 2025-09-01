import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify custom admin session - this should match your existing admin auth logic
function isCustomAdminAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const customAuthToken = request.headers.get('X-Admin-Session');
  
  return !!(authHeader || customAuthToken);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify custom admin authentication
    if (!isCustomAdminAuthenticated(req)) {
      console.error('Unauthorized access attempt');
      return new Response(
        JSON.stringify({ error: "Unauthorized - Admin access required" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method !== 'DELETE') {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { filePath } = await req.json();
    
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: "filePath is required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create service role client
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Service role bypasses RLS
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log(`Deleting thumbnail: ${filePath}`);

    // Delete the file using service role
    const { error } = await supabaseServiceRole
      .storage
      .from('blog-thumbnails')
      .remove([filePath]);

    if (error) {
      console.error('Failed to delete thumbnail:', error);
      return new Response(
        JSON.stringify({ error: error.message || "Failed to delete thumbnail" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully deleted thumbnail: ${filePath}`);

    return new Response(
      JSON.stringify({ success: true, message: "Thumbnail deleted successfully" }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in delete-thumbnail function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});