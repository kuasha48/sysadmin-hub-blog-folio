
import React from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';
import { useContent, useContactInfo } from '@/hooks/useContent';
import SEOHead from '@/components/SEOHead';

const About = () => {
  const { content: introContent } = useContent('about_intro');
  const { contactInfo } = useContactInfo();

  const experiences = [
    {
      title: 'System Administrator (On-site)',
      company: 'SPINP Tech – Prishtina, Kosovo',
      period: 'July 2023 – Present',
      description: 'Manage and adhere to Service Level Agreements (SLAs) and ERP.',
      achievements: [
        'Provision and manage virtual machines using Proxmox VE, ensuring optimal resource allocation of VPS\'s and performance',
        'Maintain backup and disaster recovery and minimize downtime',
        'Deploy and configure operating systems AlmaLinux-8, 9 and install WHM/cPanel, Exim mail system',
        'Configure Email sending policy, DKIM, SPF, DMARC, implement CSF Firewall, imunify360',
        'IT Documentation for quick solve in future use'
      ]
    },
    {
      title: 'System Administrator (Remote)',
      company: 'Syscomed - Sistemas y Control del Mediterráneo S.L. – Spain',
      period: 'Jun 2022 – Dec 2024',
      description: 'Manage and adhere to Service Level Agreements (SLAs) and SaaS.',
      achievements: [
        'Provision and manage virtual machines using OpenShift, Proxmox VE, and AWS, ensuring optimal resource allocation and performance',
        'VM migration, maintain backup and disaster recovery and minimize downtime',
        'Deploy and configure various operating systems such as Linux/UNIX (RedHat, CentOS, AlmaLinux, Ubuntu) to meet organizational requirements',
        'Setup, configure and manage Email servers',
        'Install, configure, and maintain DNS and Hosting servers for Python, WordPress, cPanel, and Laravel applications',
        'Implement security measures including SSL, SSH, Firewall and other best practices',
        'Automate routine tasks using Bash and Python scripting',
        'Provide technical guidance and IT Documentation to enhance team capabilities'
      ]
    },
    {
      title: 'System Administrator (On-site)',
      company: 'Zoom Touch General Trading LLC – Dubai, UAE',
      period: 'Sep 2021 - Jun 2022',
      description: 'Web and Exchange Email Server Management, OS Maintenance (Mac, Windows, Linux)',
      achievements: [
        'Proficiently oversaw Azure Administration, Google Workspace, Customized ERP Software, Zoho CRM',
        'E-commerce and Inventory Management systems ensuring seamless operations',
        'Install and configure Windows Server 2012, Backup, Restore, Antivirus Solution',
        'WordPress Migration and server management'
      ]
    },
    {
      title: 'System Engineer (On-site)',
      company: 'FRA Technology L.L.C – Dubai, UAE',
      period: 'Jul 2015 – Aug 2021',
      description: 'Cloud Infrastructure & Server Virtualization Management',
      achievements: [
        'Proficiently oversaw servers on Google Cloud Platform (GCP) and Azure optimizing cloud resources',
        'Implemented server virtualization solutions using VMware, Citrix XenServer, ProxmoxVE',
        'Created and managed digital data storage with automated and manual backup procedures',
        'Successfully installed and configured various Linux/Unix, Windows Server operating systems',
        'Expertly configured control panels like cPanel/WHM, DirectAdmin, SolidCP',
        'Demonstrated proficiency in Google Workspace, SSL, DNS, Active Directory, Apache, Nginx, MySQL',
        'Provided comprehensive client support through ticketing systems and technical documentation'
      ]
    },
    {
      title: 'Technical Sales Support Engineer (On-site)',
      company: 'BD SOFT IT – Dhaka, Bangladesh',
      period: 'Jun 2009 – Feb 2014',
      description: 'Customer Support for software installation, hardware troubleshooting, Web hosting, and Email support.',
      achievements: [
        'Configuration of Outlook, MySQL, Webmail, POP3, IMAP, and SMTP',
        'Provided comprehensive technical support for various IT solutions',
        'Hardware troubleshooting and system maintenance',
        'Web hosting and email server support'
      ]
    }
  ];

  const certifications = [
    'AWS Certified Solutions Architect',
    'Red Hat Certified System Administrator',
    'CompTIA Security+',
    'Microsoft Certified: Azure Administrator',
    'Certified Kubernetes Administrator'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        pageType="page" 
        pageSlug="about" 
        customTitle="About Fazla Rabby Azim - System Administrator"
        customDescription="Learn about Fazla Rabby Azim's 13+ years experience in system administration, cloud computing, and DevOps across Kosovo, UAE, and Bangladesh."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              AT
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
              <p className="text-lg text-gray-700 mb-4">
                <div dangerouslySetInnerHTML={{ 
                  __html: introContent?.content || 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Adept at troubleshooting, securing systems, and fostering collaboration.' 
                }} />
              </p>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {contactInfo?.address || 'Prishtina, Kosovo'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  13+ Years Experience
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Work Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-green-400 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-green-600 font-medium">{exp.period}</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                <p className="text-gray-600 mb-4">{exp.description}</p>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start text-gray-700">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Award className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-gray-800 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
