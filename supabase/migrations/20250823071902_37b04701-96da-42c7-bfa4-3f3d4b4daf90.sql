-- Step 1: Drop all existing policies for blog_posts
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Specific admin can do everything with blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Specific admin can manage all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage their own posts" ON public.blog_posts;