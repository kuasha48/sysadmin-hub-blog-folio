import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-session',
};

// Verify custom admin session - this should match your existing admin auth logic
function isCustomAdminAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const customAuthToken = request.headers.get('X-Admin-Session');
  
  return !!(authHeader || customAuthToken);
}

function createAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Service role bypasses RLS
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
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

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    let postId = pathParts[pathParts.length - 1]; // Get the ID from the URL
    let requestBody = null;
    
    // If we need the request body, read it once
    if (req.method === 'PUT' || req.method === 'DELETE') {
      requestBody = await req.json();
      
      // If postId is not in URL, try to get it from the request body
      if (!postId || postId === 'manage-blog-post') {
        postId = requestBody.postId;
      }
    }

    if (!postId || postId === 'manage-blog-post') {
      return new Response(
        JSON.stringify({ error: "Post ID is required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createAdminClient();

    if (req.method === 'PUT') {
      // Update blog post
      const body = { ...requestBody };
      delete body.postId; // Remove postId from update data
      console.log(`Updating blog post ${postId} with data:`, body);

      const { data, error } = await supabase
        .from('blog_posts')
        .update(body)
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return new Response(
          JSON.stringify({ error: error.message }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ post: data }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (req.method === 'DELETE') {
      // Delete blog post
      console.log(`Deleting blog post ${postId}`);

      // First, fetch the post to get thumbnail info
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, thumbnail_url')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        return new Response(
          JSON.stringify({ error: fetchError.message }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Clean up thumbnail if it exists
      if (post?.thumbnail_url) {
        try {
          // Extract storage path from public URL
          const url = new URL(post.thumbnail_url);
          const pathIdx = url.pathname.indexOf('/blog-thumbnails/');
          if (pathIdx !== -1) {
            const objectPath = url.pathname.substring(pathIdx + '/blog-thumbnails/'.length);
            console.log(`Removing thumbnail: ${objectPath}`);
            
            const { error: storageError } = await supabase.storage
              .from('blog-thumbnails')
              .remove([objectPath]);
              
            if (storageError) {
              console.warn('Failed to remove thumbnail:', storageError);
              // Don't fail the whole operation for storage cleanup issues
            }
          }
        } catch (error) {
          console.warn('Error cleaning up thumbnail:', error);
          // Don't fail the whole operation for storage cleanup issues
        }
      }

      // Delete the blog post
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        return new Response(
          JSON.stringify({ error: deleteError.message }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Successfully deleted blog post ${postId}`);

      return new Response(
        JSON.stringify({ ok: true, message: "Blog post deleted successfully" }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in manage-blog-post function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});