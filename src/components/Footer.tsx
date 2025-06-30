
import React, { useState, useEffect } from 'react';
import { Terminal, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useContent, useContactInfo } from '@/hooks/useContent';
import { supabase } from '@/integrations/supabase/client';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const Footer = () => {
  const { content: descriptionContent } = useContent('footer_description');
  const { contactInfo } = useContactInfo();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('social_links')
        .select('*')
        .order('platform');

      if (error && error.code !== 'PGRST116') {
        console.log('Social links table might not exist yet');
      } else if (data) {
        setSocialLinks(data);
      }
    } catch (err) {
      console.log('Error fetching social links:', err);
    }
  };

  const getSocialUrl = (platform: string) => {
    const link = socialLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase());
    return link?.url || '#';
  };

  const getMailUrl = () => {
    const mailLink = socialLinks.find(l => l.platform.toLowerCase() === 'mail');
    if (mailLink?.url) {
      return mailLink.url.startsWith('mailto:') ? mailLink.url : `mailto:${mailLink.url}`;
    }
    return `mailto:${contactInfo?.email || 'contact@azimstech.com'}`;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">AzimsTech.com</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              <div dangerouslySetInnerHTML={{ 
                __html: descriptionContent?.content || 'Experienced System Administrator with hands-on expertise in Linux/Unix, virtualization, and cloud computing. Building reliable, secure, and scalable infrastructure solutions.' 
              }} />
            </p>
            <div className="flex space-x-4">
              <a 
                href={getSocialUrl('github')} 
                className="text-gray-400 hover:text-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href={getSocialUrl('linkedin')} 
                className="text-gray-400 hover:text-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href={getSocialUrl('twitter')} 
                className="text-gray-400 hover:text-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={getMailUrl()} 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-green-400 transition-colors">About</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-green-400 transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/blog?category=infrastructure" className="text-gray-300 hover:text-green-400 transition-colors">Infrastructure</a></li>
              <li><a href="/blog?category=security" className="text-gray-300 hover:text-green-400 transition-colors">Security</a></li>
              <li><a href="/blog?category=devops" className="text-gray-300 hover:text-green-400 transition-colors">DevOps</a></li>
              <li><a href="/blog?category=tutorials" className="text-gray-300 hover:text-green-400 transition-colors">Tutorials</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 AzimsTech.com. All rights reserved. Built with passion for technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
