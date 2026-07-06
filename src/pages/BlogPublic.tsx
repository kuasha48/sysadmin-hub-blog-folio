
import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

const BlogPublic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useBlogTheme();

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'security', name: 'Security' },
    { id: 'devops', name: 'DevOps' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'automation', name: 'Automation' },
    { id: 'networking', name: 'Networking' },
    { id: 'cloud', name: 'Cloud Computing' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0d1117]' : 'bg-gray-50'}`}>
        <div className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Loading posts...</div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'min-h-screen bg-[#0d1117]' : 'min-h-screen bg-gray-50'}>
      <SEOHead 
        pageType="page" 
        pageSlug="blog" 
        customTitle="Technical Blog - System Administration & DevOps Tutorials"
        customDescription="Expert insights, tutorials, and best practices in system administration, security, cloud computing, and DevOps from Azim's Tech."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-4">
          <BlogThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Technical Blog</h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sharing insights, tutorials, and best practices in system administration, security, and DevOps
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`rounded-lg shadow-lg p-6 mb-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDark
                      ? 'bg-[#0d1117] border-gray-700 text-gray-100 placeholder:text-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className={`rounded-lg shadow-lg overflow-hidden border transition-all hover:shadow-xl ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="relative">
                {post.thumbnail_url ? (
                  <img
                    src={post.thumbnail_url}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">Tech Blog</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-3 line-clamp-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {post.title}
                </h2>
                <p className={`mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>

                <div className={`flex items-center text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{new Date(post.published_at).toLocaleDateString()}</span>
                  <User className="h-4 w-4 mr-1" />
                  <span>Admin</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/blog/${post.slug}`}
                  className={`inline-flex items-center font-medium ${
                    isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPublic;
