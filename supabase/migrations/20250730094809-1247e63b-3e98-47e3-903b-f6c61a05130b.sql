-- Create table for individual stats entries
CREATE TABLE public.stats_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL,
  number TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  color_class TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual skills entries
CREATE TABLE public.skills_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_class TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.stats_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for stats_entries
CREATE POLICY "Public can read stats entries" 
ON public.stats_entries 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage stats entries" 
ON public.stats_entries 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create policies for skills_entries
CREATE POLICY "Public can read skills entries" 
ON public.skills_entries 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage skills entries" 
ON public.skills_entries 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default stats entries
INSERT INTO public.stats_entries (icon_name, number, label, description, color_class, sort_order) VALUES
('Shield', '13+', 'Years Experience', 'System Administration', 'text-blue-500', 1),
('Server', '500+', 'Servers Managed', 'Linux/Unix Systems', 'text-green-500', 2),
('Users', '100+', 'Clients Supported', 'Worldwide', 'text-purple-500', 3),
('Award', '99.9%', 'Uptime Achieved', 'Infrastructure Reliability', 'text-red-500', 4);

-- Insert default skills entries
INSERT INTO public.skills_entries (title, icon_name, color_class, skills, sort_order) VALUES
('Infrastructure & Servers', 'Server', 'text-blue-400', ARRAY['Linux Administration', 'Windows Server', 'VMware vSphere', 'Docker', 'Kubernetes'], 1),
('Security & Compliance', 'Shield', 'text-red-400', ARRAY['Firewall Management', 'SSL/TLS', 'Active Directory', 'SIEM', 'Vulnerability Assessment'], 2),
('Automation & Scripting', 'Code', 'text-purple-400', ARRAY['Bash/Shell', 'PowerShell', 'Python', 'Ansible', 'Terraform'], 3),
('Database Management', 'Database', 'text-yellow-400', ARRAY['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Backup'], 4),
('Cloud Platforms', 'Cloud', 'text-cyan-400', ARRAY['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Migration'], 5),
('Monitoring & DevOps', 'Zap', 'text-green-400', ARRAY['Nagios', 'Prometheus', 'Grafana', 'Jenkins', 'GitLab CI/CD'], 6);

-- Create trigger for updating timestamps
CREATE TRIGGER update_stats_entries_updated_at
BEFORE UPDATE ON public.stats_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_entries_updated_at
BEFORE UPDATE ON public.skills_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();