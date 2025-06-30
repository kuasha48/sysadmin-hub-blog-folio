
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import SkillsSection from '@/components/SkillsSection';
import FeaturedBlog from '@/components/FeaturedBlog';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <StatsSection />
      <SkillsSection />
      <FeaturedBlog />
      <Footer />
    </div>
  );
};

export default Index;
