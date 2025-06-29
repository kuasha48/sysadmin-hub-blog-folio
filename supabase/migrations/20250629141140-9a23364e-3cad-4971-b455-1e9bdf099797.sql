
-- Create a table to store editable content sections
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  section_type TEXT NOT NULL DEFAULT 'html',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage content sections" 
  ON public.content_sections 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Allow public read access for published content
CREATE POLICY "Public can read content sections" 
  ON public.content_sections 
  FOR SELECT 
  USING (true);

-- Insert default content sections
INSERT INTO public.content_sections (section_key, title, content, section_type) VALUES
('hero_title', 'Hero Title', 'System Administrator<br><span class="text-green-400">& Cloud Expert</span>', 'html'),
('hero_description', 'Hero Description', 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Skilled in automation, security, and building scalable infrastructure solutions.', 'html'),
('about_intro', 'About Introduction', 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Adept at troubleshooting, securing systems, and fostering collaboration. Skilled in Email servers, and adept in Big Data and VM migrations, in various control panels including cPanel, Plesk, and WHMCS for effective billing system and customer support. Eager to leverage skills in Linux administration, automation, and security to drive innovation and optimize IT infrastructure.', 'html'),
('footer_description', 'Footer Description', 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Building reliable, secure, and scalable infrastructure solutions.', 'html'),
('contact_intro', 'Contact Introduction', 'Ready to discuss your infrastructure needs? Get in touch and let''s build something amazing together.', 'html');

-- Create a table for contact information
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone_primary TEXT,
  phone_secondary TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage contact info" 
  ON public.contact_info 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can read contact info" 
  ON public.contact_info 
  FOR SELECT 
  USING (true);

-- Insert default contact info
INSERT INTO public.contact_info (email, phone_primary, phone_secondary, address) VALUES
('contact@azimstech.com', '+(383) 45677 497', '+(880) 1911 343 443', 'Prishtina, Kosovo');
