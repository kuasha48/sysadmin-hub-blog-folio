-- Fix RLS policies for blog_posts to allow authenticated users and use proper UUID for author_id

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Specific admin can do everything with blog posts" ON public.blog_posts;

-- Create new policies that work with both authenticated users and specific admin
CREATE POLICY "Anyone can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Allow specific admin to do everything
CREATE POLICY "Specific admin can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (is_specific_admin(auth.uid()))
WITH CHECK (is_specific_admin(auth.uid()));

-- Allow authenticated users to insert/update their own posts (for future use)
CREATE POLICY "Authenticated users can manage their own posts" 
ON public.blog_posts 
FOR ALL 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Update author_id column to allow string values temporarily
ALTER TABLE public.blog_posts ALTER COLUMN author_id TYPE text;