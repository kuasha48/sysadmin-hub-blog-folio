-- Drop the existing SELECT policy that may have loopholes
DROP POLICY IF EXISTS "Admin can view contact submissions" ON public.contact_submissions;

-- Create a more secure SELECT policy that explicitly requires authentication AND admin role
CREATE POLICY "Only authenticated admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

-- Also add an explicit policy to deny public access
CREATE POLICY "Deny public access to contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO anon
USING (false);