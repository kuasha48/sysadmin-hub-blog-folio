-- Initialize CTA section content
INSERT INTO public.content_sections (section_key, title, content, section_type)
VALUES 
  ('cta_hire', 'Want to hire for short term or long term project please contact', '', 'html'),
  ('cta_whatsapp', '', '+38345677497', 'text')
ON CONFLICT (section_key) DO NOTHING;

-- Create FTP settings table
CREATE TABLE IF NOT EXISTS public.ftp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ftp_host text NOT NULL,
  ftp_username text NOT NULL,
  ftp_password text NOT NULL,
  ftp_port integer NOT NULL DEFAULT 21,
  backup_enabled boolean NOT NULL DEFAULT true,
  last_backup_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ftp_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for FTP settings
CREATE POLICY "Admins can manage FTP settings"
ON public.ftp_settings
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default FTP configuration
INSERT INTO public.ftp_settings (ftp_host, ftp_username, ftp_password, ftp_port, backup_enabled)
VALUES ('23.166.88.239', 'spinptechback', 'ck6Yr8KPyswYFzRM', 21, true)
ON CONFLICT DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_ftp_settings_updated_at
BEFORE UPDATE ON public.ftp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();