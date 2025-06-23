
import React, { useState } from 'react';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'infrastructure', name: 'Infrastructure', count: 4 },
    { id: 'security', name: 'Security', count: 3 },
    { id: 'devops', name: 'DevOps', count: 2 },
    { id: 'tutorials', name: 'Tutorials', count: 3 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Docker Container Security',
      excerpt: 'Learn how to secure your Docker containers with best practices, vulnerability scanning, and runtime protection.',
      category: 'security',
      date: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
      tags: ['Docker', 'Security', 'Containers']
    },
    {
      id: 2,
      title: 'Setting up High Availability with HAProxy',
      excerpt: 'Step-by-step guide to configure HAProxy for load balancing and high availability in production environments.',
      category: 'infrastructure',
      date: '2024-01-10',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=300&fit=crop',
      tags: ['HAProxy', 'Load Balancing', 'High Availability']
    },
    {
      id: 3,
      title: 'Kubernetes Monitoring with Prometheus and Grafana',
      excerpt: 'Complete tutorial on setting up monitoring stack for your Kubernetes cluster using Prometheus and Grafana.',
      category: 'devops',
      date: '2024-01-05',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
      tags: ['Kubernetes', 'Monitoring', 'Prometheus', 'Grafana']
    },
    {
      id: 4,
      title: 'Automating Server Provisioning with Ansible',
      excerpt: 'Learn how to automate your server setup and configuration management using Ansible playbooks.',
      category: 'tutorials',
      date: '2024-01-01',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500&h=300&fit=crop',
      tags: ['Ansible', 'Automation', 'Configuration Management']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technical Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sharing insights, tutorials, and best practices in system administration, security, and DevOps
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
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
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
