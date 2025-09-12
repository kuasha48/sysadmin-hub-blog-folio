-- Fix RLS policy for contact submissions to work with current auth setup
DROP POLICY IF EXISTS "Admin can view contact submissions" ON contact_submissions;

-- Create a new policy that works with the is_admin function
CREATE POLICY "Admin can view contact submissions" 
ON contact_submissions 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add policy to allow admins to delete contact submissions
CREATE POLICY "Admin can delete contact submissions" 
ON contact_submissions 
FOR DELETE 
USING (is_admin(auth.uid()));