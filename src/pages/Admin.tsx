
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Complete Guide to Docker Container Security',
      excerpt: 'Learn how to secure your Docker containers with best practices...',
      category: 'security',
      status: 'published',
      date: '2024-01-15',
      views: 1250
    },
    {
      id: 2,
      title: 'Setting up High Availability with HAProxy',
      excerpt: 'Step-by-step guide to configure HAProxy for load balancing...',
      category: 'infrastructure',
      status: 'published',
      date: '2024-01-10',
      views: 890
    },
    {
      id: 3,
      title: 'Kubernetes Best Practices Draft',
      excerpt: 'Draft article about Kubernetes security and performance...',
      category: 'devops',
      status: 'draft',
      date: '2024-01-08',
      views: 0
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  const categories = [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'security', name: 'Security' },
    { id: 'devops', name: 'DevOps' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'automation', name: 'Automation' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData, date: new Date().toISOString().split('T')[0] }
          : post
      ));
      setEditingPost(null);
    } else {
      const newPost = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        views: 0
      };
      setPosts([newPost, ...posts]);
    }
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || '',
      category: post.category,
      tags: post.tags || '',
      status: post.status
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                    placeholder="Write your blog post content here..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="Docker, Security, Linux"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingPost ? 'Update' : 'Create'} Post
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
