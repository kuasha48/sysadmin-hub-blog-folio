-- Step 2: Update author_id column type and recreate policies
ALTER TABLE public.blog_posts ALTER COLUMN author_id TYPE text;

-- Step 3: Create new RLS policies that work properly
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

-- Allow posts with author_id = 'admin' to be managed (temporary fix)
CREATE POLICY "Admin string posts can be managed" 
ON public.blog_posts 
FOR ALL 
USING (author_id = 'admin')
WITH CHECK (author_id = 'admin');