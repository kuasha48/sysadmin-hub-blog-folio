-- Insert default content sections for stats (Proven Track Record) section
INSERT INTO public.content_sections (section_key, title, content, section_type) VALUES
('stats_title', 'Stats Section Title', 'Proven Track Record', 'html'),
('stats_description', 'Stats Section Description', 'Delivering reliable infrastructure solutions across the globe', 'html')
ON CONFLICT (section_key) DO NOTHING;