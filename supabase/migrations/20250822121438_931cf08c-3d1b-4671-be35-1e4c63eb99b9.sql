-- Clean up existing storage policies and create proper ones for admin blog uploads
DROP POLICY IF EXISTS "Admins can upload to blog-thumbnails bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog thumbnails" ON storage.objects;

-- Create proper policies for blog thumbnails bucket
CREATE POLICY "Admin can manage blog thumbnails" ON storage.objects
FOR ALL USING (
  bucket_id = 'blog-thumbnails' AND 
  is_specific_admin(auth.uid())
) WITH CHECK (
  bucket_id = 'blog-thumbnails' AND 
  is_specific_admin(auth.uid())
);

CREATE POLICY "Public can view blog thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-thumbnails');