
-- Create the social_links table for storing social media links
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default social media platforms
INSERT INTO public.social_links (platform, url, icon) VALUES
('github', '#', 'github'),
('linkedin', '#', 'linkedin'),
('twitter', '#', 'twitter'),
('mail', 'contact@azimstech.com', 'mail');
