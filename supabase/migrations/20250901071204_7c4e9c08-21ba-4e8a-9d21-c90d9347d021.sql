-- Clean up existing write policies on the blog-thumbnails bucket
DROP POLICY IF EXISTS "Admins can upload blog thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage blog thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow blog thumbnail uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow blog thumbnail updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow blog thumbnail deletes" ON storage.objects;

-- Public READ ONLY for blog-thumbnails bucket
CREATE POLICY "Public can view blog thumbnails"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-thumbnails');

-- No INSERT/UPDATE/DELETE policies for anon/authenticated users
-- All writes will be done via server using service role or signed upload URLs