-- Create work_experiences table
CREATE TABLE public.work_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for work_experiences
CREATE POLICY "Public can read work experiences"
ON public.work_experiences
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage work experiences"
ON public.work_experiences
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
CREATE POLICY "Public can read certifications"
ON public.certifications
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage certifications"
ON public.certifications
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create trigger for updated_at on work_experiences
CREATE TRIGGER update_work_experiences_updated_at
BEFORE UPDATE ON public.work_experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on certifications
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing work experiences
INSERT INTO public.work_experiences (title, company, period, description, achievements, sort_order) VALUES
('System Administrator (On-site)', 'SPINP Tech – Prishtina, Kosovo', 'July 2023 – Present', 'Manage and adhere to Service Level Agreements (SLAs) and ERP.', 
ARRAY[
  'Provision and manage virtual machines using Proxmox VE, ensuring optimal resource allocation of VPS''s and performance',
  'Maintain backup and disaster recovery and minimize downtime',
  'Deploy and configure operating systems AlmaLinux-8, 9 and install WHM/cPanel, Exim mail system',
  'Configure Email sending policy, DKIM, SPF, DMARC, implement CSF Firewall, imunify360',
  'IT Documentation for quick solve in future use'
], 1),
('System Administrator (Remote)', 'Syscomed - Sistemas y Control del Mediterráneo S.L. – Spain', 'Jun 2022 – Dec 2024', 'Manage and adhere to Service Level Agreements (SLAs) and SaaS.',
ARRAY[
  'Provision and manage virtual machines using OpenShift, Proxmox VE, and AWS, ensuring optimal resource allocation and performance',
  'VM migration, maintain backup and disaster recovery and minimize downtime',
  'Deploy and configure various operating systems such as Linux/UNIX (RedHat, CentOS, AlmaLinux, Ubuntu) to meet organizational requirements',
  'Setup, configure and manage Email servers',
  'Install, configure, and maintain DNS and Hosting servers for Python, WordPress, cPanel, and Laravel applications',
  'Implement security measures including SSL, SSH, Firewall and other best practices',
  'Automate routine tasks using Bash and Python scripting',
  'Provide technical guidance and IT Documentation to enhance team capabilities'
], 2),
('System Administrator (On-site)', 'Zoom Touch General Trading LLC – Dubai, UAE', 'Sep 2021 - Jun 2022', 'Web and Exchange Email Server Management, OS Maintenance (Mac, Windows, Linux)',
ARRAY[
  'Proficiently oversaw Azure Administration, Google Workspace, Customized ERP Software, Zoho CRM',
  'E-commerce and Inventory Management systems ensuring seamless operations',
  'Install and configure Windows Server 2012, Backup, Restore, Antivirus Solution',
  'WordPress Migration and server management'
], 3),
('System Engineer (On-site)', 'FRA Technology L.L.C – Dubai, UAE', 'Jul 2015 – Aug 2021', 'Cloud Infrastructure & Server Virtualization Management',
ARRAY[
  'Proficiently oversaw servers on Google Cloud Platform (GCP) and Azure optimizing cloud resources',
  'Implemented server virtualization solutions using VMware, Citrix XenServer, ProxmoxVE',
  'Created and managed digital data storage with automated and manual backup procedures',
  'Successfully installed and configured various Linux/Unix, Windows Server operating systems',
  'Expertly configured control panels like cPanel/WHM, DirectAdmin, SolidCP',
  'Demonstrated proficiency in Google Workspace, SSL, DNS, Active Directory, Apache, Nginx, MySQL',
  'Provided comprehensive client support through ticketing systems and technical documentation'
], 4),
('Technical Sales Support Engineer (On-site)', 'BD SOFT IT – Dhaka, Bangladesh', 'Jun 2009 – Feb 2014', 'Customer Support for software installation, hardware troubleshooting, Web hosting, and Email support.',
ARRAY[
  'Configuration of Outlook, MySQL, Webmail, POP3, IMAP, and SMTP',
  'Provided comprehensive technical support for various IT solutions',
  'Hardware troubleshooting and system maintenance',
  'Web hosting and email server support'
], 5);

-- Insert existing certifications
INSERT INTO public.certifications (name, sort_order) VALUES
('AWS Certified Solutions Architect', 1),
('Red Hat Certified System Administrator', 2),
('CompTIA Security+', 3),
('Microsoft Certified: Azure Administrator', 4),
('Certified Kubernetes Administrator', 5);