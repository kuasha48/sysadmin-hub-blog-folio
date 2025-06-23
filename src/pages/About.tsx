
import React from 'react';
import { Calendar, MapPin, Award, ExternalLink } from 'lucide-react';

const About = () => {
  const experiences = [
    {
      title: 'Senior System Administrator',
      company: 'Tech Corp',
      period: '2020 - Present',
      description: 'Leading infrastructure automation and security initiatives across 500+ servers',
      achievements: [
        'Reduced system downtime by 85% through proactive monitoring',
        'Implemented automated backup solutions saving 20 hours/week',
        'Led cloud migration project resulting in 40% cost reduction'
      ]
    },
    {
      title: 'DevOps Engineer',
      company: 'StartupXYZ',
      period: '2018 - 2020',
      description: 'Built CI/CD pipelines and managed containerized applications',
      achievements: [
        'Implemented Docker containerization for 50+ applications',
        'Set up Kubernetes clusters handling 1M+ requests daily',
        'Automated deployment process reducing release time by 60%'
      ]
    },
    {
      title: 'Junior System Administrator',
      company: 'IT Solutions Inc',
      period: '2016 - 2018',
      description: 'Managed Windows and Linux servers, network infrastructure',
      achievements: [
        'Maintained 99.9% uptime for critical business applications',
        'Implemented security hardening across all systems',
        'Created documentation and training materials for team'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              SA
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
              <p className="text-lg text-gray-700 mb-4">
                I'm a passionate System Administrator with over 7 years of experience in managing complex IT infrastructures, 
                implementing security best practices, and automating operational processes. I love sharing knowledge through 
                technical blog posts and helping others solve challenging infrastructure problems.
              </p>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  San Francisco, CA
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  7+ Years Experience
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
