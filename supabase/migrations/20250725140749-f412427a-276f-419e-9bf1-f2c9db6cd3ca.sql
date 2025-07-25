-- Create SEO metadata table for pages and posts
CREATE TABLE public.seo_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL, -- 'page', 'blog_post', 'global'
  page_slug TEXT, -- NULL for global settings
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  json_ld JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_type, page_slug)
);

-- Enable Row Level Security
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for SEO metadata
CREATE POLICY "Public can read SEO metadata" 
ON public.seo_metadata 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage SEO metadata" 
ON public.seo_metadata 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create site settings table for global SEO settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'boolean', 'json'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site settings
CREATE POLICY "Public can read site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Azim''s Tech', 'text', 'Site name for SEO'),
('site_description', 'Experienced System Administrator with expertise in Linux/Unix, virtualization, and cloud computing.', 'text', 'Default site description'),
('site_url', 'https://azimstech.com', 'text', 'Site base URL'),
('default_og_image', '', 'text', 'Default Open Graph image URL'),
('google_analytics_id', '', 'text', 'Google Analytics tracking ID'),
('google_search_console_verification', '', 'text', 'Google Search Console verification code'),
('robots_txt_content', 'User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml', 'text', 'Robots.txt content');

-- Insert default SEO metadata for main pages
INSERT INTO public.seo_metadata (page_type, page_slug, title, description, og_type) VALUES
('page', 'home', 'System Administrator & Cloud Expert | Azim''s Tech', 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Building reliable, secure, and scalable infrastructure solutions.', 'website'),
('page', 'about', 'About Fazla Rabby Azim | System Administrator & Cloud Expert', 'Learn about Fazla Rabby Azim, an experienced System Administrator specializing in Linux/Unix systems, cloud computing, and infrastructure automation.', 'profile'),
('page', 'blog', 'Technical Blog | System Administration & Cloud Computing', 'Read technical articles about system administration, cloud computing, DevOps, and infrastructure automation by Fazla Rabby Azim.', 'website'),
('page', 'contact', 'Contact Fazla Rabby Azim | System Administrator', 'Get in touch with Fazla Rabby Azim for system administration consulting, cloud computing solutions, and technical expertise.', 'website');

-- Create function to automatically update SEO metadata timestamps
CREATE OR REPLACE FUNCTION public.update_seo_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seo_metadata_updated_at
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_metadata_updated_at();

-- Create trigger for site settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_metadata_updated_at();