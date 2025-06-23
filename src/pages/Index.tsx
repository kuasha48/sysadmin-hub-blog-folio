
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SkillsSection from '@/components/SkillsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SkillsSection />
      <Footer />
    </div>
  );
};

export default Index;
