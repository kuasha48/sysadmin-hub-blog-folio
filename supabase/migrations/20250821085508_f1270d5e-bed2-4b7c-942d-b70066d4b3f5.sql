-- Enable Tawk.to live chat
UPDATE site_settings 
SET setting_value = 'true' 
WHERE setting_key = 'enable_tawk';