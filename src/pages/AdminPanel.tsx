import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ContentEditor from '@/components/ContentEditor';
import SEOEditor from '@/components/SEOEditor';
import SiteSettingsEditor from '@/components/SiteSettingsEditor';
import AnalyticsSettings from '@/components/AnalyticsSettings';
import RichTextEditor from '@/components/RichTextEditor';
import CategoryManager from '@/components/CategoryManager';
import { useCategories } from '@/hooks/useCategories';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Tag, 
  User, 
  LogOut,
  Upload,
  Mail,
  MessageSquare,
  FileText,
  Search,
  Settings,
  BarChart
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  category: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  message: string;
  created_at: string;
}

const AdminPanel = () => {
  const { isAuthenticated, loading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    thumbnail_url: '',
    is_featured: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft',
      thumbnail_url: '',
      is_featured: false
    });
    setThumbnailFile(null);
    setEditingPost(null);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    } else if (isAuthenticated) {
      fetchPosts();
      fetchContacts();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await supabase.functions.invoke('manage-contacts', {
        body: { action: 'list' },
        headers: { 'X-Admin-Session': 'admin-authenticated' }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch contact submissions');
      }

      setContacts(response.data?.contacts || []);
    } catch (err: any) {
      console.error('Fetch contacts error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch contact submissions',
        variant: 'destructive',
      });
      setContacts([]);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      console.log('Deleting contact:', contactId);
      
      const response = await supabase.functions.invoke('manage-contacts', {
        body: { action: 'delete', id: contactId },
        headers: { 'X-Admin-Session': 'admin-authenticated' }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete contact message');
      }

      toast({
        title: 'Success',
        description: 'Contact message deleted successfully!',
      });
      
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
      fetchContacts();
    } catch (error: any) {
      console.error('Delete contact error:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete contact message',
        variant: 'destructive',
      });
    }
  };

  const toggleContactSelection = (id: string) => {
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDeleteSelectedContacts = async () => {
    try {
      if (selectedContacts.length === 0) return;
      const response = await supabase.functions.invoke('manage-contacts', {
        body: { action: 'delete', ids: selectedContacts },
        headers: { 'X-Admin-Session': 'admin-authenticated' }
      });
      if (response.error) throw new Error(response.error.message || 'Failed to delete selected messages');
      toast({ title: 'Success', description: `${selectedContacts.length} message(s) deleted` });
      setSelectedContacts([]);
      fetchContacts();
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to delete selected messages', variant: 'destructive' });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const uploadThumbnail = async (file: File, postId?: string) => {
    try {
      // Generate a unique post ID if not provided (for new posts)
      const uploadPostId = postId || `temp-${Date.now()}`;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      console.log('Getting signed upload URL for:', { uploadPostId, fileName });

      // Get signed upload URL from our edge function
      const signedUrlResponse = await supabase.functions.invoke('create-signed-upload-url', {
        body: {
          postId: uploadPostId,
          filename: fileName,
          contentType: file.type || 'application/octet-stream'
        }
      });

      if (signedUrlResponse.error) {
        console.error('Failed to get signed URL:', signedUrlResponse.error);
        throw new Error(signedUrlResponse.error.message || 'Failed to get upload URL');
      }

      const { signedUrl, publicUrl } = signedUrlResponse.data;

      console.log('Got signed URL, uploading file...');

      // Upload directly to the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unknown error');
        console.error('Upload failed:', uploadResponse.status, errorText);
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
      }

      console.log('Upload successful, public URL:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in as admin to create posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let thumbnailUrl = formData.thumbnail_url;
      
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        status: formData.status,
        thumbnail_url: thumbnailUrl,
        is_featured: formData.is_featured,
        author_id: 'admin',
        updated_at: new Date().toISOString(),
        ...(formData.status === 'published' && !editingPost && { published_at: new Date().toISOString() })
      };

      console.log('Saving post with data:', postData);

      if (editingPost) {
        // Use edge function to update the blog post
        const response = await supabase.functions.invoke('manage-blog-post', {
          method: 'PUT',
          headers: {
            'X-Admin-Session': 'admin-authenticated',
          },
          body: {
            postId: editingPost.id,
            ...postData
          }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Update failed');
        }
        
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Blog post created successfully!",
        });
      }

      resetForm();
      setIsCreateModalOpen(false);
      fetchPosts();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in as admin to delete posts",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting post:', postId);
      
      // First try to delete via edge function
      const response = await supabase.functions.invoke('manage-blog-post', {
        method: 'DELETE',
        headers: {
          'X-Admin-Session': 'admin-authenticated',
        },
        body: { postId }
      });

      if (response.error) {
        // If edge function fails, try direct database deletion as fallback
        console.warn('Edge function failed, trying direct deletion:', response.error);
        
        const { error: dbError } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);
          
        if (dbError) {
          throw new Error(dbError.message);
        }
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      
      // Always refresh the posts list
      fetchPosts();
    } catch (error: any) {
      console.error('Delete error:', error);
      
      // Even if there's an error, refresh the list to show current state
      fetchPosts();
      
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      status: post.status,
      thumbnail_url: post.thumbnail_url || '',
      is_featured: post.is_featured || false
    });
    setThumbnailFile(null);
    setIsCreateModalOpen(true);
  };

  const handleNewPost = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };


  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalContacts: contacts.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button 
              variant="outline"
              onClick={fetchPosts}
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Refresh Posts</span>
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
              setIsCreateModalOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPost} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-700">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({
                            ...formData, 
                            title,
                            slug: generateSlug(title)
                          });
                        }}
                        required
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug" className="text-gray-700">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        required
                        className="bg-white border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt" className="text-gray-700">Excerpt</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      required
                      className="bg-white border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail" className="text-gray-700">Thumbnail Image</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="bg-white border-gray-300"
                    />
                    {formData.thumbnail_url && (
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Current thumbnail" 
                        className="mt-2 w-32 h-20 object-cover rounded"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-gray-700">Content</Label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData({...formData, content: value})}
                      placeholder="Write your blog post content here..."
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-gray-700">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="bg-white border-gray-300">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-gray-700">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-gray-700">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="Docker, Security, Linux"
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="featured" className="text-gray-700">Featured Post</Label>
                    </div>
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
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'posts' ? 'default' : 'outline'}
              onClick={() => setActiveTab('posts')}
            >
              Blog Posts
            </Button>
            <Button
              variant={activeTab === 'contacts' ? 'default' : 'outline'}
              onClick={() => setActiveTab('contacts')}
            >
              Contact Messages
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'default' : 'outline'}
              onClick={() => setActiveTab('categories')}
            >
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </Button>
            <Button
              variant={activeTab === 'content' ? 'default' : 'outline'}
              onClick={() => setActiveTab('content')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content Management
            </Button>
            <Button
              variant={activeTab === 'seo' ? 'default' : 'outline'}
              onClick={() => setActiveTab('seo')}
            >
              <Search className="h-4 w-4 mr-2" />
              SEO Settings
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Analytics & Chat
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </div>

        {/* Posts Table */}
        {activeTab === 'posts' && (
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        {post.thumbnail_url && (
                          <img 
                            src={post.thumbnail_url} 
                            alt={post.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status}
                            </Badge>
                            {post.is_featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Featured
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {categories.find(cat => cat.slug === post.category)?.name || post.category}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
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
        )}

        {/* Categories Management */}
        {activeTab === 'categories' && <CategoryManager />}

        {/* Contact Messages */}
        {activeTab === 'contacts' && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Contact Messages</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={fetchContacts}>
                  Refresh
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDeleteSelectedContacts}
                  disabled={selectedContacts.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected {selectedContacts.length > 0 ? `(${selectedContacts.length})` : ''}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No contact messages found.</p>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3 w-full">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => toggleContactSelection(contact.id)}
                            aria-label="Select contact message"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.mobile && (
                              <p className="text-sm text-gray-600">{contact.mobile}</p>
                            )}
                            {contact.country && (
                              <p className="text-sm text-gray-600">{contact.country}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{contact.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics & Chat Settings */}
        {activeTab === 'analytics' && <AnalyticsSettings />}

        {/* Content Management */}
        {activeTab === 'content' && <ContentEditor />}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <SEOEditor pageType="page" pageSlug="home" />
                  <SEOEditor pageType="page" pageSlug="about" />
                  <SEOEditor pageType="page" pageSlug="blog" />
                  <SEOEditor pageType="page" pageSlug="contact" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Site Settings */}
        {activeTab === 'settings' && <SiteSettingsEditor />}
      </div>
    </div>
  );
};

export default AdminPanel;
