
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, User, BookOpen, Settings, Home } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

const Header = () => {
  const location = useLocation();
  const { content: profileImageContent } = useContent('hero_profile_image');

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: Settings },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {profileImageContent?.content ? (
              <img 
                src={profileImageContent.content}
                alt="Azim's Tech Logo"
                className="h-8 w-8 rounded-full object-cover border-2 border-green-400"
              />
            ) : (
              <Terminal className="h-8 w-8 text-green-400" />
            )}
            <span className="text-xl font-bold text-white">AzimsTech.com</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-green-400 bg-gray-800'
                      : 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/auth"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-green-400">
              <Terminal className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
