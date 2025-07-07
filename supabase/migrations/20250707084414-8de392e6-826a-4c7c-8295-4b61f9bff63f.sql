
-- Update the is_specific_admin function to use the correct email
CREATE OR REPLACE FUNCTION public.is_specific_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND email = 'cloudyskybd48@gmail.com'
  );
$function$;
