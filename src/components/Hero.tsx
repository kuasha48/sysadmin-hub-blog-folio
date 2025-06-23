
import React from 'react';
import { Terminal, Server, Shield, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
              <Terminal className="h-16 w-16 text-green-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            System Administrator
            <span className="block text-green-400 mt-2">& DevOps Engineer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Passionate about infrastructure automation, security hardening, and building scalable systems. 
            Sharing knowledge through technical articles and tutorials.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <Server className="h-5 w-5 text-blue-400" />
              <span>Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <Shield className="h-5 w-5 text-red-400" />
              <span>Security</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <Code className="h-5 w-5 text-purple-400" />
              <span>Automation</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-all"
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
