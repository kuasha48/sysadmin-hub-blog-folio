-- Fix RLS policies for blog_posts
-- Drop all existing policies first
DROP POLICY IF EXISTS "Admin string posts can be managed" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Specific admin can manage all blog posts" ON public.blog_posts;

-- Create new simplified policies
-- Allow public to read published posts
CREATE POLICY "Public can read published posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Allow anyone to insert posts with author_id = 'admin' (for the admin system)
CREATE POLICY "Allow admin posts creation" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (author_id = 'admin');

-- Allow anyone to update posts with author_id = 'admin'
CREATE POLICY "Allow admin posts update" 
ON public.blog_posts 
FOR UPDATE 
USING (author_id = 'admin')
WITH CHECK (author_id = 'admin');

-- Allow anyone to delete posts with author_id = 'admin'
CREATE POLICY "Allow admin posts delete" 
ON public.blog_posts 
FOR DELETE 
USING (author_id = 'admin');

-- Allow specific authenticated admin to do everything
CREATE POLICY "Authenticated admin full access" 
ON public.blog_posts 
FOR ALL 
USING (is_specific_admin(auth.uid()))
WITH CHECK (is_specific_admin(auth.uid()));