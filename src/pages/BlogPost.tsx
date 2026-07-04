
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
  const { isDark } = useBlogTheme();

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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Post Not Found</h1>
          <Link to="/blog" className={isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-50'}>
      <SEOHead 
        pageType="blog_post" 
        pageSlug={post.slug}
        customTitle={post.title}
        customDescription={post.excerpt}
        customImage={post.thumbnail_url}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className={`inline-flex items-center ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <BlogThemeToggle />
        </div>

        <article className={`rounded-lg shadow-lg overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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

            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {post.title}
            </h1>

            <div className={`flex items-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar className="h-4 w-4 mr-2" />
              <span className="mr-6">{new Date(post.published_at).toLocaleDateString()}</span>
              <User className="h-4 w-4 mr-2" />
              <span>Fazla Rabby Azim</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className={`blog-content ${isDark ? 'blog-content-dark' : ''}`}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
