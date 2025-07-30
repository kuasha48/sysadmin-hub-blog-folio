
import React from 'react';
import { Shield, Server, Users, Award, Activity, Code, Database, Cloud, Zap } from 'lucide-react';
import { useContent, useStatsEntries } from '@/hooks/useContent';

const StatsSection = () => {
  const { content: titleContent } = useContent('stats_title');
  const { content: descriptionContent } = useContent('stats_description');
  const { statsEntries, loading: statsLoading } = useStatsEntries();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Shield,
      Server,
      Users,
      Award,
      Activity,
      Code,
      Database,
      Cloud,
      Zap
    };
    return icons[iconName] || Shield;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            <div dangerouslySetInnerHTML={{ 
              __html: titleContent?.content || 'Proven Track Record' 
            }} />
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in">
            <div dangerouslySetInnerHTML={{ 
              __html: descriptionContent?.content || 'Delivering reliable infrastructure solutions across the globe' 
            }} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : (
            statsEntries.map((stat, index) => {
              const Icon = getIconComponent(stat.icon_name);
              return (
                <div 
                  key={stat.id} 
                  className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color_class}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${stat.color_class}`}>
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-gray-600">
                    {stat.description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
