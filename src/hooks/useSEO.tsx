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
      console.log('Fetching SEO data for:', { type, slug });
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page_type', type)
        .eq('page_slug', slug || null)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no data gracefully

      console.log('SEO fetch result:', { data, error });
      
      if (!error && data) {
        setSeoData(data);
      } else if (!data) {
        setSeoData(null); // Explicitly set to null when no data found
      }
    } catch (err) {
      console.warn('SEO data fetch error:', err);
      setSeoData(null);
    }
    setLoading(false);
  };

  const fetchSiteSettings = async () => {
    try {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      console.log('Site settings fetch result:', { data, error, dataLength: data?.length });
      
      if (!error && data) {
        setSiteSettings(data);
      } else if (error) {
        console.error('Site settings fetch error:', error);
        setSiteSettings([]); // Set empty array on error
      }
    } catch (err) {
      console.error('Site settings fetch catch error:', err);
      setSiteSettings([]);
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
    console.log(`updateSiteSetting called with key: ${key}, value:`, value);
    
    // Use upsert to handle both insert and update cases
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ 
        setting_key: key, 
        setting_value: value,
        setting_type: 'text' // default type
      }, {
        onConflict: 'setting_key'
      })
      .select();

    console.log('Upsert result:', { data, error });

    if (!error) {
      // Update local state
      setSiteSettings(prev => {
        const existingIndex = prev.findIndex(setting => setting.setting_key === key);
        if (existingIndex >= 0) {
          // Update existing
          return prev.map(setting => 
            setting.setting_key === key 
              ? { ...setting, setting_value: value }
              : setting
          );
        } else {
          // Add new
          return [...prev, { 
            setting_key: key, 
            setting_value: value, 
            setting_type: 'text',
            description: '',
            id: '',
            created_at: '',
            updated_at: ''
          }];
        }
      });
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