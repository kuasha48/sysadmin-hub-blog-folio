
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import SkillsSection from '@/components/SkillsSection';
import FeaturedBlog from '@/components/FeaturedBlog';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        pageType="page" 
        pageSlug="home" 
        customTitle="Azim's Tech - System Administrator & Cloud Expert"
        customDescription="Expert System Administrator with 13+ years experience in Linux/Unix, cloud computing, virtualization, and DevOps solutions."
      />
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
