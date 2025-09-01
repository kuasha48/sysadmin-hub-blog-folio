import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify custom admin session - this should match your existing admin auth logic
function isCustomAdminAuthenticated(request: Request): boolean {
  // This is a simplified check - in a real implementation, you'd verify the session
  // token/cookie that your custom admin auth system sets
  const authHeader = request.headers.get('Authorization');
  const customAuthToken = request.headers.get('X-Admin-Session');
  
  // For now, we'll check if either exists - you should implement proper verification
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

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { postId, filename, contentType } = await req.json();
    
    if (!postId || !filename) {
      return new Response(
        JSON.stringify({ error: "postId and filename are required" }), 
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

    const objectPath = `posts/${postId}/${filename}`;
    
    console.log(`Creating signed upload URL for: ${objectPath}`);

    // Create signed upload URL with 10 minute expiry
    const { data, error } = await supabaseServiceRole
      .storage
      .from('blog-thumbnails')
      .createSignedUploadUrl(objectPath, 600); // 10 minutes

    if (error) {
      console.error('Failed to create signed URL:', error);
      return new Response(
        JSON.stringify({ error: error.message || "Failed to create signed URL" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!data || !data.signedUrl) {
      console.error('No signed URL returned from Supabase');
      return new Response(
        JSON.stringify({ error: "Failed to generate upload URL" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate public URL for the uploaded file
    const { data: { publicUrl } } = supabaseServiceRole
      .storage
      .from('blog-thumbnails')
      .getPublicUrl(objectPath);

    console.log(`Generated signed URL for upload. Public URL will be: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        signedUrl: data.signedUrl,
        path: objectPath,
        publicUrl: publicUrl,
        expiresIn: 600 // 10 minutes
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-signed-upload-url function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});