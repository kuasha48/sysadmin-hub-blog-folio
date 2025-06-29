
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  section_type: string;
}

interface ContactInfo {
  id: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  address: string;
}

export const useContent = (sectionKey?: string) => {
  const [content, setContent] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sectionKey) {
      fetchContent(sectionKey);
    }
  }, [sectionKey]);

  const fetchContent = async (key: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', key)
      .single();

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  return { content, loading, refetch: () => sectionKey && fetchContent(sectionKey) };
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (!error && data) {
      setContactInfo(data);
    }
    setLoading(false);
  };

  return { contactInfo, loading, refetch: fetchContactInfo };
};
