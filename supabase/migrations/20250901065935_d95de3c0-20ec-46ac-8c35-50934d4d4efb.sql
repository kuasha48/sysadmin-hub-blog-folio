-- Re-enable RLS for blog_posts table with proper security policies
-- This fixes the security issue while maintaining admin functionality

-- Re-enable RLS on blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read only published posts
CREATE POLICY "Public can read published posts only"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Policy 2: Admin users can do everything (using the existing is_admin function)
CREATE POLICY "Admins have full access to all posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Policy 3: Allow insertion for non-authenticated admin system
-- This allows your custom admin auth to work without RLS violations
CREATE POLICY "Allow admin system post creation"
ON public.blog_posts
FOR INSERT
TO anon
WITH CHECK (author_id = 'admin');

-- Policy 4: Allow updates for admin system
CREATE POLICY "Allow admin system post updates"
ON public.blog_posts
FOR UPDATE
TO anon
USING (author_id = 'admin')
WITH CHECK (author_id = 'admin');

-- Policy 5: Allow deletes for admin system
CREATE POLICY "Allow admin system post deletes"
ON public.blog_posts
FOR DELETE
TO anon
USING (author_id = 'admin');