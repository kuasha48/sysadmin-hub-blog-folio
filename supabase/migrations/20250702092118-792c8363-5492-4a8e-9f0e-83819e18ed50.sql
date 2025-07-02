
-- Add RLS policies for social_links table
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage social links
CREATE POLICY "Admins can manage social links" 
ON public.social_links 
FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Allow public to read social links
CREATE POLICY "Public can read social links" 
ON public.social_links 
FOR SELECT 
TO public 
USING (true);
