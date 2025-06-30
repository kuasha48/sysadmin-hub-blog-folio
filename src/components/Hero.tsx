
import React from 'react';
import { Terminal, Server, Shield, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';

const Hero = () => {
  const { content: titleContent } = useContent('hero_title');
  const { content: descriptionContent } = useContent('hero_description');
  const { content: profileImageContent } = useContent('hero_profile_image');
  const { content: profileImage2Content } = useContent('hero_profile_image_2');

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Profile Images */}
          <div className="flex justify-center mb-8 space-x-6">
            {/* Primary Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400 shadow-2xl animate-fade-in">
                {profileImageContent?.content ? (
                  <img 
                    src={profileImageContent.content}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Terminal className="h-16 w-16 text-green-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full border-4 border-gray-900">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Secondary Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-2xl animate-fade-in">
                {profileImage2Content?.content ? (
                  <img 
                    src={profileImage2Content.content}
                    alt="Profile 2"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Server className="h-16 w-16 text-blue-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-full border-4 border-gray-900">
                <Code className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <div dangerouslySetInnerHTML={{ 
              __html: titleContent?.content || 'System Administrator<br><span class="text-green-400">& Cloud Expert</span>' 
            }} />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            <div dangerouslySetInnerHTML={{ 
              __html: descriptionContent?.content || 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Skilled in automation, security, and building scalable infrastructure solutions.' 
            }} />
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in">
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 hover-scale">
              <Server className="h-5 w-5 text-blue-400" />
              <span>Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 hover-scale">
              <Shield className="h-5 w-5 text-red-400" />
              <span>Security</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 hover-scale">
              <Code className="h-5 w-5 text-purple-400" />
              <span>Automation</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors hover-scale"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-all hover-scale"
            >
              Read Blog Posts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
