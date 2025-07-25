import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

interface SEOHeadProps {
  pageType: string;
  pageSlug?: string;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

const SEOHead = ({ 
  pageType, 
  pageSlug, 
  customTitle, 
  customDescription, 
  customImage 
}: SEOHeadProps) => {
  const { generateMetaTags, loading } = useSEO(pageType, pageSlug);

  useEffect(() => {
    if (loading) return;

    const metaTags = generateMetaTags();
    
    // Override with custom values if provided
    const title = customTitle || metaTags.title;
    const description = customDescription || metaTags.description;
    const ogImage = customImage || metaTags.og.image;

    // Update document title
    document.title = title;

    // Update or create meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', metaTags.keywords);
    updateMetaTag('robots', metaTags.robots);

    // Open Graph tags
    updateMetaTag('og:title', metaTags.og.title, 'property');
    updateMetaTag('og:description', metaTags.og.description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:type', metaTags.og.type, 'property');
    updateMetaTag('og:url', metaTags.og.url, 'property');

    // Twitter tags
    updateMetaTag('twitter:card', metaTags.twitter.card);
    updateMetaTag('twitter:title', metaTags.twitter.title);
    updateMetaTag('twitter:description', metaTags.twitter.description);
    updateMetaTag('twitter:image', metaTags.twitter.image);

    // Canonical URL
    if (metaTags.canonical) {
      updateLinkTag('canonical', metaTags.canonical);
    }

    // JSON-LD structured data
    if (metaTags.jsonLd) {
      updateJsonLd(metaTags.jsonLd);
    }
  }, [loading, customTitle, customDescription, customImage]);

  return null;
};

const updateMetaTag = (name: string, content: string, type: 'name' | 'property' = 'name') => {
  if (!content) return;

  let meta = document.querySelector(`meta[${type}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(type, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  if (!href) return;

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

const updateJsonLd = (data: any) => {
  // Remove existing JSON-LD
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new JSON-LD
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export default SEOHead;