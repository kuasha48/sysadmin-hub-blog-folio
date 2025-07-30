
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

export const useStatsEntries = () => {
  const [statsEntries, setStatsEntries] = useState<StatsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatsEntries();
  }, []);

  const fetchStatsEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stats_entries')
      .select('*')
      .order('sort_order');

    if (!error && data) {
      setStatsEntries(data);
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
    const { data, error } = await supabase
      .from('skills_entries')
      .select('*')
      .order('sort_order');

    if (!error && data) {
      setSkillsEntries(data);
    }
    setLoading(false);
  };

  return { skillsEntries, loading, refetch: fetchSkillsEntries };
};
