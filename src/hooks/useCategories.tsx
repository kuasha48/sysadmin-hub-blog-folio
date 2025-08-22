import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData: { name: string; slug: string; description?: string }) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (!error && data) {
      setCategories([...categories, data]);
      return data;
    }
    throw error;
  };

  const updateCategory = async (id: string, categoryData: { name: string; slug: string; description?: string }) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCategories(categories.map(cat => cat.id === id ? data : cat));
      return data;
    }
    throw error;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      setCategories(categories.filter(cat => cat.id !== id));
    } else {
      throw error;
    }
  };

  return {
    categories,
    loading,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};