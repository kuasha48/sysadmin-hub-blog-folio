
-- Remove all existing users and profiles
DELETE FROM public.profiles;

-- Insert the single admin user profile (we'll need to get the UUID after creating the auth user)
-- This will be handled in the trigger, but we're modifying the trigger to only allow this specific email

-- Update the trigger to only create profile for the specific admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Only create profile for the specific admin email
  IF new.email = 'cloudyskybd48@gmail.com' THEN
    INSERT INTO public.profiles (id, username, email, role)
    VALUES (
      new.id,
      'admin',
      new.email,
      'admin'
    );
  END IF;
  RETURN new;
END;
$$;

-- Update RLS policies to be more restrictive
-- Only allow the specific admin email to access admin features
CREATE OR REPLACE FUNCTION public.is_specific_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND email = 'cloudyskybd38@gmail.com'
  );
$$;

-- Update blog posts policy to use the new function
DROP POLICY IF EXISTS "Admins can do everything with blog posts" ON public.blog_posts;
CREATE POLICY "Specific admin can do everything with blog posts" ON public.blog_posts
  FOR ALL USING (public.is_specific_admin(auth.uid()));

-- Update contact submissions policy
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
CREATE POLICY "Specific admin can view all contact submissions" ON public.contact_submissions
  FOR SELECT USING (public.is_specific_admin(auth.uid()));
