-- Step 1: Remove foreign key constraint and update type
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
ALTER TABLE public.blog_posts ALTER COLUMN author_id TYPE text;

-- Step 2: Create new RLS policies that work properly
CREATE POLICY "Anyone can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Allow specific admin to do everything (for authenticated admin user)
CREATE POLICY "Specific admin can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (is_specific_admin(auth.uid()))
WITH CHECK (is_specific_admin(auth.uid()));

-- Allow posts with author_id = 'admin' to be created/managed (for custom admin auth)
CREATE POLICY "Admin string posts can be managed" 
ON public.blog_posts 
FOR ALL 
USING (author_id = 'admin' OR auth.uid() IS NULL)
WITH CHECK (author_id = 'admin');