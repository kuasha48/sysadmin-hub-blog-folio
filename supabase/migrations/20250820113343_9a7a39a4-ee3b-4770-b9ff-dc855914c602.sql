-- Insert missing analytics settings into site_settings table
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('enable_ga', 'false', 'boolean', 'Enable/disable Google Analytics tracking'),
('ga_measurement_id', '', 'text', 'Google Analytics GA4 Measurement ID'),
('enable_tawk', 'false', 'boolean', 'Enable/disable Tawk.to live chat'),
('tawk_widget_code', '', 'text', 'Tawk.to widget script code')
ON CONFLICT (setting_key) DO NOTHING;