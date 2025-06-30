
import React from 'react';
import { Server, Shield, Code, Database, Cloud, Zap } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

const SkillsSection = () => {
  const { content: titleContent } = useContent('skills_title');
  const { content: descriptionContent } = useContent('skills_description');

  const skillCategories = [
    {
      title: 'Infrastructure & Servers',
      icon: Server,
      color: 'text-blue-400',
      skills: ['Linux Administration', 'Windows Server', 'VMware vSphere', 'Docker', 'Kubernetes']
    },
    {
      title: 'Security & Compliance',
      icon: Shield,
      color: 'text-red-400',
      skills: ['Firewall Management', 'SSL/TLS', 'Active Directory', 'SIEM', 'Vulnerability Assessment']
    },
    {
      title: 'Automation & Scripting',
      icon: Code,
      color: 'text-purple-400',
      skills: ['Bash/Shell', 'PowerShell', 'Python', 'Ansible', 'Terraform']
    },
    {
      title: 'Database Management',
      icon: Database,
      color: 'text-yellow-400',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Backup']
    },
    {
      title: 'Cloud Platforms',
      icon: Cloud,
      color: 'text-cyan-400',
      skills: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Migration']
    },
    {
      title: 'Monitoring & DevOps',
      icon: Zap,
      color: 'text-green-400',
      skills: ['Nagios', 'Prometheus', 'Grafana', 'Jenkins', 'GitLab CI/CD']
    }
  ];

  return (
    <section className="py-20 bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <div dangerouslySetInnerHTML={{ 
              __html: titleContent?.content || 'Technical Expertise' 
            }} />
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <div dangerouslySetInnerHTML={{ 
              __html: descriptionContent?.content || 'Years of experience in system administration, security, and DevOps practices' 
            }} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow hover-scale">
                <div className="flex items-center mb-4">
                  <Icon className={`h-8 w-8 ${category.color} mr-3`} />
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
