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
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData: { name: string; slug: string; description?: string }) => {
    try {
      const session = localStorage.getItem('admin_session');
      const res = await fetch('https://cnuphfizhokzywhsvbln.supabase.co/functions/v1/manage-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': session || ''
        },
        body: JSON.stringify({ action: 'create', category: categoryData })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create category');
      }

      const created = json.category as Category;
      setCategories([...categories, created]);
      return created;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: { name: string; slug: string; description?: string }) => {
    try {
      if (!id) throw new Error('Category id is required');
      const session = localStorage.getItem('admin_session');
      const res = await fetch('https://cnuphfizhokzywhsvbln.supabase.co/functions/v1/manage-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': session || ''
        },
        body: JSON.stringify({ action: 'update', id, updates: categoryData })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update category');
      }

      const updated = json.category as Category;
      setCategories(categories.map(cat => cat.id === id ? updated : cat));
      return updated;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      if (!id) throw new Error('Category id is required');
      const session = localStorage.getItem('admin_session');
      const res = await fetch('https://cnuphfizhokzywhsvbln.supabase.co/functions/v1/manage-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': session || ''
        },
        body: JSON.stringify({ action: 'delete', id })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete category');
      }

      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
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