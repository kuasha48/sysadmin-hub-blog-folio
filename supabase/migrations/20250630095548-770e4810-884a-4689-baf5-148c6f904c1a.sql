
-- Add the is_featured column to the blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
