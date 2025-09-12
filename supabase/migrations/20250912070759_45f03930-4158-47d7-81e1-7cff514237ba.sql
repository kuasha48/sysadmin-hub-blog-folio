-- Fix RLS policies for contact submissions to allow admins to view them
DROP POLICY IF EXISTS "Specific admin can view all contact submissions" ON contact_submissions;

-- Create a policy that allows anyone with the admin email to view contact submissions
CREATE POLICY "Admin can view contact submissions" 
ON contact_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'cloudyskybd48@gmail.com'
  )
);