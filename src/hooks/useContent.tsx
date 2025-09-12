
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

interface StatsEntry {
  id: string;
  icon_name: string;
  number: string;
  label: string;
  description: string;
  color_class: string;
  sort_order: number;
}

interface SkillsEntry {
  id: string;
  title: string;
  icon_name: string;
  color_class: string;
  skills: string[];
  sort_order: number;
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
    try {
      console.log('Fetching content for key:', key);
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', key)
        .maybeSingle(); // Use maybeSingle() instead of single()

      console.log('Content fetch result:', { key, data, error });
      
      if (!error && data) {
        setContent(data);
      } else if (!data) {
        setContent(null); // Explicitly set to null when no data found
      }
    } catch (err) {
      console.error('Content fetch error:', { key, err });
      setContent(null);
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
    try {
      console.log('Fetching contact info...');
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle(); // Use maybeSingle() instead of single()

      console.log('Contact info fetch result:', { data, error });
      
      if (!error && data) {
        setContactInfo(data);
      } else if (!data) {
        setContactInfo(null); // Explicitly set to null when no data found
      }
    } catch (err) {
      console.error('Contact info fetch error:', err);
      setContactInfo(null);
    }
    setLoading(false);
  };

  return { contactInfo, loading, refetch: fetchContactInfo };
};

export const useStatsEntries = () => {
  const [statsEntries, setStatsEntries] = useState<StatsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatsEntries();
  }, []);

  const fetchStatsEntries = async () => {
    setLoading(true);
    try {
      console.log('Fetching stats entries...');
      const { data, error } = await supabase
        .from('stats_entries')
        .select('*')
        .order('sort_order');

      console.log('Stats entries fetch result:', { data, error, count: data?.length });
      
      if (!error && data) {
        setStatsEntries(data);
      } else {
        setStatsEntries([]); // Set empty array on error
      }
    } catch (err) {
      console.error('Stats entries fetch error:', err);
      setStatsEntries([]);
    }
    setLoading(false);
  };

  return { statsEntries, loading, refetch: fetchStatsEntries };
};

export const useSkillsEntries = () => {
  const [skillsEntries, setSkillsEntries] = useState<SkillsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillsEntries();
  }, []);

  const fetchSkillsEntries = async () => {
    setLoading(true);
    try {
      console.log('Fetching skills entries...');
      const { data, error } = await supabase
        .from('skills_entries')
        .select('*')
        .order('sort_order');

      console.log('Skills entries fetch result:', { data, error, count: data?.length });
      
      if (!error && data) {
        setSkillsEntries(data);
      } else {
        setSkillsEntries([]); // Set empty array on error
      }
    } catch (err) {
      console.error('Skills entries fetch error:', err);
      setSkillsEntries([]);
    }
    setLoading(false);
  };

  return { skillsEntries, loading, refetch: fetchSkillsEntries };
};
