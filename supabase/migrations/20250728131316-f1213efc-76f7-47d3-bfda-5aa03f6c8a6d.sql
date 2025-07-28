-- Insert missing content sections for Proven Track Record and Technical Expertise
INSERT INTO content_sections (section_key, title, content, section_type) VALUES
('stats_title', 'Proven Track Record', 'Our Achievements and Success Metrics', 'html'),
('stats_description', 'Track Record Description', 'We have consistently delivered outstanding results for our clients over the years.', 'html'),
('skills_title', 'Technical Expertise', 'Our Core Competencies and Skills', 'html'),
('skills_description', 'Skills Description', 'We leverage cutting-edge technologies and industry best practices to deliver exceptional solutions.', 'html')
ON CONFLICT (section_key) DO NOTHING;