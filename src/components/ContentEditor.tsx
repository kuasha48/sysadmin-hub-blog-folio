
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit, Upload } from 'lucide-react';

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

const ContentEditor = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentSections();
    fetchContactInfo();
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

  const uploadProfileImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `profile.${fileExt}`;
    
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

  const handleUploadProfileImage = async () => {
    if (!profileImageFile) return;

    setLoading(true);
    try {
      const imageUrl = await uploadProfileImage(profileImageFile);
      
      // Update or create hero_profile_image content section
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: 'hero_profile_image',
          title: 'Hero Profile Image',
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
      
      setProfileImageFile(null);
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Site Profile Image</CardTitle>
          <CardDescription>
            Upload your profile image for the homepage hero section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              onClick={handleUploadProfileImage} 
              disabled={!profileImageFile || loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Profile Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
          <CardDescription>
            Edit content sections that appear throughout the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {contentSections.map((section) => (
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
                      {section.section_type === 'image' ? (
                        <Input
                          id="content"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="Image URL"
                        />
                      ) : (
                        <Editor
                          apiKey="your-tinymce-api-key"
                          value={editingContent}
                          onEditorChange={(content) => setEditingContent(content)}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                              'bold italic forecolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                        />
                      )}
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
                    {section.section_type === 'image' ? (
                      section.content ? (
                        <img src={section.content} alt={section.title} className="max-w-xs rounded-lg" />
                      ) : (
                        <p className="text-gray-500">No image uploaded</p>
                      )
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update contact details displayed on the website
          </CardDescription>
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
    </div>
  );
};

export default ContentEditor;
