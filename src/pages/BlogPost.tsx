
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import BlogThemeToggle from '@/components/BlogThemeToggle';
import { useBlogTheme } from '@/hooks/useBlogTheme';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  category: string;
  tags: string[];
  published_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'security', name: 'Security' },
    { id: 'devops', name: 'DevOps' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'automation', name: 'Automation' },
    { id: 'networking', name: 'Networking' },
    { id: 'cloud', name: 'Cloud Computing' }
  ];

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-200">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-green-400 hover:text-green-300">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SEOHead 
        pageType="blog_post" 
        pageSlug={post.slug}
        customTitle={post.title}
        customDescription={post.excerpt}
        customImage={post.thumbnail_url}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-green-400 hover:text-green-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          {post.thumbnail_url && (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="mb-6">
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                {categories.find(cat => cat.id === post.category)?.name}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-400 mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="mr-6">{new Date(post.published_at).toLocaleDateString()}</span>
              <User className="h-4 w-4 mr-2" />
              <span>Fazla Rabby Azim</span>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="prose prose-lg prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="blog-content blog-content-dark"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
