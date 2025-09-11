
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, User, BookOpen, Settings, Home, Menu, X } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

const Header = () => {
  const location = useLocation();
  const { content: profileImageContent } = useContent('hero_profile_image');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: Settings },
  ];

  return (
    <header className="bg-header-bg border-b border-header-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            {profileImageContent?.content ? (
              <img 
                src={profileImageContent.content}
                alt="Azim's Tech Logo"
                className="h-8 w-8 rounded-full object-cover border-2 border-nav-accent"
              />
            ) : (
              <Terminal className="h-8 w-8 text-nav-accent" />
            )}
            <span className="text-lg md:text-xl font-bold text-header-text">AzimsTech.com</span>
          </Link>
          
          {/* Desktop Navigation - hidden on mobile and tablet */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-nav-accent bg-nav-hover-bg'
                      : 'text-muted-foreground hover:text-nav-accent hover:bg-nav-hover-bg'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/auth"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-nav-accent hover:bg-nav-hover-bg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile menu button - visible on tablet and mobile */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-nav-accent transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu - visible on tablet and mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-header-border">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-nav-hover-bg">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors w-full ${
                      location.pathname === item.path
                        ? 'text-nav-accent bg-background/10'
                        : 'text-muted-foreground hover:text-nav-accent hover:bg-background/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-nav-accent hover:bg-background/10 transition-colors w-full"
              >
                <Settings className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
