import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit, Upload, Settings, User, Home, Share2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

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

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const ContentEditor = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImage2File, setProfileImage2File] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentSections();
    fetchContactInfo();
    fetchSocialLinks();
  }, []);

  const fetchContentSections = async () => {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('section_key');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content sections",
        variant: "destructive",
      });
    } else {
      setContentSections(data || []);
    }
  };

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch contact info",
        variant: "destructive",
      });
    } else if (data) {
      setContactInfo(data);
    }
  };

  const fetchSocialLinks = async () => {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('platform');

    if (error && error.code !== 'PGRST116') {
      console.log('Social links table might not exist yet');
    } else if (data) {
      setSocialLinks(data);
    }
  };

  const uploadProfileImage = async (file: File, imageKey: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${imageKey}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section.id);
    setEditingContent(section.content || '');
    setEditingTitle(section.title || '');
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('content_sections')
      .update({
        content: editingContent,
        title: editingTitle,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingSection);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update content section",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content section updated successfully!",
      });
      setEditingSection(null);
      fetchContentSections();
    }
    setLoading(false);
  };

  const handleSaveContactInfo = async () => {
    if (!contactInfo) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('contact_info')
      .update({
        ...contactInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactInfo.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update contact info",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Contact info updated successfully!",
      });
    }
    setLoading(false);
  };

  const handleUploadProfileImage = async (imageKey: string, file: File | null) => {
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadProfileImage(file, imageKey);
      
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: imageKey,
          title: imageKey === 'hero_profile_image' ? 'Hero Profile Image' : 'Hero Profile Image 2',
          content: imageUrl,
          section_type: 'image'
        }, {
          onConflict: 'section_key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile image updated successfully!",
      });
      
      if (imageKey === 'hero_profile_image') {
        setProfileImageFile(null);
      } else {
        setProfileImage2File(null);
      }
      fetchContentSections();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile image",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSaveSocialLink = async (platform: string, url: string) => {
    const { error } = await supabase
      .from('social_links')
      .upsert({
        platform,
        url,
        icon: platform.toLowerCase()
      }, {
        onConflict: 'platform'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update social link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social link updated successfully!",
      });
      fetchSocialLinks();
    }
  };

  const heroSections = contentSections.filter(s => s.section_key.includes('hero'));
  const footerSections = contentSections.filter(s => s.section_key.includes('footer'));
  const skillsSections = contentSections.filter(s => s.section_key.includes('skills'));
  const otherSections = contentSections.filter(s => 
    !s.section_key.includes('hero') && 
    !s.section_key.includes('footer') && 
    !s.section_key.includes('skills')
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Homepage
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Images
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content on homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {heroSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.section_key}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {editingSection === section.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <RichTextEditor
                            value={editingContent}
                            onChange={setEditingContent}
                            placeholder="Enter content..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveSection} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Expertise</CardTitle>
              <CardDescription>Skills and expertise section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.section_key}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {editingSection === section.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <RichTextEditor
                            value={editingContent}
                            onChange={setEditingContent}
                            placeholder="Enter content..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveSection} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Section */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>Footer section content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {footerSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.section_key}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {editingSection === section.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <RichTextEditor
                            value={editingContent}
                            onChange={setEditingContent}
                            placeholder="Enter content..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveSection} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Other Content Sections */}
          {otherSections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Other Content</CardTitle>
                <CardDescription>Additional content sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {otherSections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.section_key}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      
                      {editingSection === section.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="content">Content</Label>
                            <RichTextEditor
                              value={editingContent}
                              onChange={setEditingContent}
                              placeholder="Enter content..."
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleSaveSection} disabled={loading}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingSection(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Images</CardTitle>
              <CardDescription>Upload and manage profile images for the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Primary Profile Image</h3>
                  <div>
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button 
                    onClick={() => handleUploadProfileImage('hero_profile_image', profileImageFile)} 
                    disabled={!profileImageFile || loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Primary Image
                  </Button>
                  {contentSections.find(s => s.section_key === 'hero_profile_image')?.content && (
                    <img 
                      src={contentSections.find(s => s.section_key === 'hero_profile_image')?.content} 
                      alt="Primary Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-400"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Secondary Profile Image</h3>
                  <div>
                    <Label htmlFor="profileImage2">Profile Image 2</Label>
                    <Input
                      id="profileImage2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage2File(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button 
                    onClick={() => handleUploadProfileImage('hero_profile_image_2', profileImage2File)} 
                    disabled={!profileImage2File || loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Secondary Image
                  </Button>
                  {contentSections.find(s => s.section_key === 'hero_profile_image_2')?.content && (
                    <img 
                      src={contentSections.find(s => s.section_key === 'hero_profile_image_2')?.content} 
                      alt="Secondary Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update contact details displayed on the website</CardDescription>
            </CardHeader>
            <CardContent>
              {contactInfo && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={contactInfo.email || ''}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_primary">Primary Phone</Label>
                    <Input
                      id="phone_primary"
                      value={contactInfo.phone_primary || ''}
                      onChange={(e) => setContactInfo({...contactInfo, phone_primary: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_secondary">Secondary Phone</Label>
                    <Input
                      id="phone_secondary"
                      value={contactInfo.phone_secondary || ''}
                      onChange={(e) => setContactInfo({...contactInfo, phone_secondary: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={contactInfo.address || ''}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleSaveContactInfo} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Contact Info
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Manage social media profile links for the footer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Github', 'Linkedin', 'Twitter', 'Mail'].map((platform) => {
                  const existingLink = socialLinks.find(link => link.platform.toLowerCase() === platform.toLowerCase());
                  return (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={platform.toLowerCase()}>{platform}</Label>
                      <div className="flex space-x-2">
                        <Input
                          id={platform.toLowerCase()}
                          placeholder={`Your ${platform} URL`}
                          defaultValue={existingLink?.url || ''}
                          onBlur={(e) => {
                            if (e.target.value) {
                              handleSaveSocialLink(platform.toLowerCase(), e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
