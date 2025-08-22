-- Fix storage RLS policies to allow admin uploads to blog-thumbnails bucket
DROP POLICY IF EXISTS "Users can upload their own blog thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog thumbnails" ON storage.objects;

-- Create proper policies for blog thumbnails bucket
CREATE POLICY "Admins can upload to blog-thumbnails bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-thumbnails' AND 
  is_specific_admin(auth.uid())
);

CREATE POLICY "Admins can update blog thumbnails" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-thumbnails' AND 
  is_specific_admin(auth.uid())
);

CREATE POLICY "Admins can delete blog thumbnails" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-thumbnails' AND 
  is_specific_admin(auth.uid())
);

CREATE POLICY "Anyone can view blog thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-thumbnails');