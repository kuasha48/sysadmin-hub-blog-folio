-- Fix the remaining function search path security warning
CREATE OR REPLACE FUNCTION public.is_specific_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id AND email = 'cloudyskybd48@gmail.com'
  );
$function$;