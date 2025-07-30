
import React from 'react';
import { Server, Shield, Code, Database, Cloud, Zap, Users, Award, Activity } from 'lucide-react';
import { useContent, useSkillsEntries } from '@/hooks/useContent';

const SkillsSection = () => {
  const { content: titleContent } = useContent('skills_title');
  const { content: descriptionContent } = useContent('skills_description');
  const { skillsEntries, loading: skillsLoading } = useSkillsEntries();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Server,
      Shield,
      Code,
      Database,
      Cloud,
      Zap,
      Users,
      Award,
      Activity
    };
    return icons[iconName] || Server;
  };

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
          {skillsLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded mr-3"></div>
                  <div className="h-6 bg-gray-300 rounded flex-1"></div>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, skillIndex) => (
                    <div key={skillIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                      <div className="h-4 bg-gray-300 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            skillsEntries.map((category, index) => {
              const Icon = getIconComponent(category.icon_name);
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow hover-scale">
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${category.color_class} mr-3`} />
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
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
