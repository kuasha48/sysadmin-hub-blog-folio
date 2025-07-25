import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOMetadata {
  id?: string;
  page_type: string;
  page_slug?: string;
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  json_ld?: any;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
}

export const useSEO = (pageType?: string, pageSlug?: string) => {
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageType) {
      fetchSEOData(pageType, pageSlug);
    }
    fetchSiteSettings();
  }, [pageType, pageSlug]);

  const fetchSEOData = async (type: string, slug?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page_type', type)
        .eq('page_slug', slug || null)
        .single();

      if (!error && data) {
        setSeoData(data);
      }
    } catch (err) {
      console.warn('SEO data not found for', type, slug);
    }
    setLoading(false);
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (!error && data) {
      setSiteSettings(data);
    }
  };

  const getSiteSetting = (key: string): string => {
    const setting = siteSettings.find(s => s.setting_key === key);
    return setting?.setting_value || '';
  };

  const updateSEOData = async (data: Partial<SEOMetadata>) => {
    if (!pageType) return;

    const payload = {
      page_type: pageType,
      page_slug: pageSlug || null,
      ...data
    };

    const { error } = await supabase
      .from('seo_metadata')
      .upsert(payload, {
        onConflict: 'page_type,page_slug'
      });

    if (!error) {
      setSeoData(prev => ({ ...prev, ...payload }));
    }
    return error;
  };

  const updateSiteSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: value })
      .eq('setting_key', key);

    if (!error) {
      setSiteSettings(prev => 
        prev.map(setting => 
          setting.setting_key === key 
            ? { ...setting, setting_value: value }
            : setting
        )
      );
    }
    return error;
  };

  const generateMetaTags = () => {
    const siteName = getSiteSetting('site_name');
    const siteDescription = getSiteSetting('site_description');
    const siteUrl = getSiteSetting('site_url');
    const defaultOGImage = getSiteSetting('default_og_image');

    const title = seoData?.title || siteName;
    const description = seoData?.description || siteDescription;
    const ogTitle = seoData?.og_title || title;
    const ogDescription = seoData?.og_description || description;
    const ogImage = seoData?.og_image || defaultOGImage;
    const ogType = seoData?.og_type || 'website';

    return {
      title,
      description,
      keywords: seoData?.keywords || '',
      canonical: seoData?.canonical_url || '',
      robots: `${seoData?.robots_index !== false ? 'index' : 'noindex'}, ${seoData?.robots_follow !== false ? 'follow' : 'nofollow'}`,
      og: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
        type: ogType,
        url: siteUrl
      },
      twitter: {
        card: seoData?.twitter_card || 'summary_large_image',
        title: seoData?.twitter_title || ogTitle,
        description: seoData?.twitter_description || ogDescription,
        image: seoData?.twitter_image || ogImage
      },
      jsonLd: seoData?.json_ld
    };
  };

  return {
    seoData,
    siteSettings,
    loading,
    getSiteSetting,
    updateSEOData,
    updateSiteSetting,
    generateMetaTags,
    refetch: () => {
      if (pageType) fetchSEOData(pageType, pageSlug);
      fetchSiteSettings();
    }
  };
};