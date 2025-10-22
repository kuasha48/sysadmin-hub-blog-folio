import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit, Settings, User, Home, Share2, Briefcase, Database } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ProfileUpload from './ProfileUpload';
import WorkExperienceManager from './WorkExperienceManager';
import CertificationManager from './CertificationManager';
import FTPBackupSettings from './FTPBackupSettings';

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

interface StatsEntry {
  id: string;
  icon_name: string;
  number: string;
  label: string;
  description: string;
  color_class: string;
  sort_order: number;
}

interface SkillsEntry {
  id: string;
  title: string;
  icon_name: string;
  color_class: string;
  skills: string[];
  sort_order: number;
}

const ContentEditor = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [statsEntries, setStatsEntries] = useState<StatsEntry[]>([]);
  const [skillsEntries, setSkillsEntries] = useState<SkillsEntry[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingStatsEntry, setEditingStatsEntry] = useState<string | null>(null);
  const [editingSkillsEntry, setEditingSkillsEntry] = useState<string | null>(null);
  const [editingStatsData, setEditingStatsData] = useState<Record<string, any>>({});
  const [editingSkillsData, setEditingSkillsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentSections();
    fetchContactInfo();
    fetchSocialLinks();
    fetchStatsEntries();
    fetchSkillsEntries();
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
    try {
      const { data, error } = await (supabase as any)
        .from('social_links')
        .select('*')
        .order('platform');

      if (error && error.code !== 'PGRST116') {
        console.log('Social links table might not exist yet');
      } else if (data) {
        setSocialLinks(data);
      }
    } catch (err) {
      console.log('Error fetching social links:', err);
    }
  };

  const fetchStatsEntries = async () => {
    const { data, error } = await supabase
      .from('stats_entries')
      .select('*')
      .order('sort_order');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch stats entries",
        variant: "destructive",
      });
    } else {
      setStatsEntries(data || []);
    }
  };

  const fetchSkillsEntries = async () => {
    const { data, error } = await supabase
      .from('skills_entries')
      .select('*')
      .order('sort_order');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills entries",
        variant: "destructive",
      });
    } else {
      setSkillsEntries(data || []);
    }
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

  const handleSaveSocialLink = async (platform: string, url: string) => {
    try {
      const { error } = await (supabase as any)
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
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update social link",
        variant: "destructive",
      });
    }
  };

  const handleSaveStatsEntry = async (entry: Partial<StatsEntry>) => {
    setLoading(true);
    const { error } = await supabase
      .from('stats_entries')
      .update(entry)
      .eq('id', entry.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update stats entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Stats entry updated successfully!",
      });
      fetchStatsEntries();
    }
    setLoading(false);
  };

  const handleSaveSkillsEntry = async (entry: Partial<SkillsEntry>) => {
    setLoading(true);
    const { error } = await supabase
      .from('skills_entries')
      .update(entry)
      .eq('id', entry.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update skills entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Skills entry updated successfully!",
      });
      fetchSkillsEntries();
    }
    setLoading(false);
  };

  const handleDoneSkillsEntry = () => {
    setEditingSkillsEntry(null);
    setEditingSkillsData({});
  };

  const handleDoneStatsEntry = () => {
    setEditingStatsEntry(null);
    setEditingStatsData({});
  };

  const handleUpdateContent = async (sectionKey: string, content: string, title: string) => {
    setLoading(true);
    const section = contentSections.find(s => s.section_key === sectionKey);
    
    if (section) {
      // Update existing section
      const { error } = await supabase
        .from('content_sections')
        .update({
          content: content || section.content,
          title: title || section.title,
          updated_at: new Date().toISOString()
        })
        .eq('section_key', sectionKey);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update content",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Content updated successfully!",
        });
        fetchContentSections();
      }
    } else {
      // Create new section
      const { error } = await supabase
        .from('content_sections')
        .insert({
          section_key: sectionKey,
          content: content,
          title: title,
          section_type: 'text'
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create content",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Content created successfully!",
        });
        fetchContentSections();
      }
    }
    setLoading(false);
  };

  const heroSections = contentSections.filter(s => s.section_key.includes('hero'));
  const footerSections = contentSections.filter(s => s.section_key.includes('footer'));
  const skillsSections = contentSections.filter(s => s.section_key.includes('skills'));
  const statsSections = contentSections.filter(s => s.section_key.includes('stats'));
  const ctaSections = contentSections.filter(s => s.section_key.includes('cta'));
  const otherSections = contentSections.filter(s => 
    !s.section_key.includes('hero') && 
    !s.section_key.includes('footer') && 
    !s.section_key.includes('skills') &&
    !s.section_key.includes('stats') &&
    !s.section_key.includes('cta')
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="homepage" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Homepage
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Images
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            About Page
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Links
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
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

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle>Proven Track Record</CardTitle>
              <CardDescription>Statistics and achievements section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {statsSections.map((section) => (
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

          {/* Stats Boxes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Stats Boxes</CardTitle>
              <CardDescription>Edit individual statistic boxes (13+, 500+, etc.)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {statsEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{entry.label}</h3>
                        <p className="text-sm text-gray-600">{entry.number} - {entry.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStatsEntry(entry.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {editingStatsEntry === entry.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`number-${entry.id}`}>Number</Label>
                            <Input
                              id={`number-${entry.id}`}
                              defaultValue={entry.number}
                              onChange={(e) => setEditingStatsData({...editingStatsData, number: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`icon-${entry.id}`}>Icon Name</Label>
                            <Input
                              id={`icon-${entry.id}`}
                              defaultValue={entry.icon_name}
                              placeholder="Shield, Server, Users, Award, etc."
                              onChange={(e) => setEditingStatsData({...editingStatsData, icon_name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`label-${entry.id}`}>Label</Label>
                            <Input
                              id={`label-${entry.id}`}
                              defaultValue={entry.label}
                              onChange={(e) => setEditingStatsData({...editingStatsData, label: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`color-${entry.id}`}>Color Class</Label>
                            <Input
                              id={`color-${entry.id}`}
                              defaultValue={entry.color_class}
                              placeholder="text-blue-500, text-green-500, etc."
                              onChange={(e) => setEditingStatsData({...editingStatsData, color_class: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${entry.id}`}>Description</Label>
                          <Input
                            id={`description-${entry.id}`}
                            defaultValue={entry.description}
                            onChange={(e) => setEditingStatsData({...editingStatsData, description: e.target.value})}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={async () => {
                              if (Object.keys(editingStatsData).length > 0) {
                                await handleSaveStatsEntry({ id: entry.id, ...editingStatsData });
                              }
                              handleDoneStatsEntry();
                            }}
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save & Done
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleDoneStatsEntry}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p><strong>Number:</strong> {entry.number}</p>
                        <p><strong>Icon:</strong> {entry.icon_name}</p>
                        <p><strong>Label:</strong> {entry.label}</p>
                        <p><strong>Description:</strong> {entry.description}</p>
                        <p><strong>Color:</strong> {entry.color_class}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Boxes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Boxes</CardTitle>
              <CardDescription>Edit individual skill category boxes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-sm text-gray-600">{entry.skills.length} skills</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSkillsEntry(entry.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {editingSkillsEntry === entry.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`skills-title-${entry.id}`}>Title</Label>
                            <Input
                              id={`skills-title-${entry.id}`}
                              defaultValue={entry.title}
                              onChange={(e) => setEditingSkillsData({...editingSkillsData, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`skills-icon-${entry.id}`}>Icon Name</Label>
                            <Input
                              id={`skills-icon-${entry.id}`}
                              defaultValue={entry.icon_name}
                              placeholder="Server, Shield, Code, Database, etc."
                              onChange={(e) => setEditingSkillsData({...editingSkillsData, icon_name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`skills-color-${entry.id}`}>Color Class</Label>
                          <Input
                            id={`skills-color-${entry.id}`}
                            defaultValue={entry.color_class}
                            placeholder="text-blue-400, text-red-400, etc."
                            onChange={(e) => setEditingSkillsData({...editingSkillsData, color_class: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`skills-list-${entry.id}`}>Skills (comma separated)</Label>
                          <Input
                            id={`skills-list-${entry.id}`}
                            defaultValue={entry.skills.join(', ')}
                            placeholder="Skill 1, Skill 2, Skill 3"
                            onChange={(e) => {
                              const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                              setEditingSkillsData({...editingSkillsData, skills: skillsArray});
                            }}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={async () => {
                              if (Object.keys(editingSkillsData).length > 0) {
                                await handleSaveSkillsEntry({ id: entry.id, ...editingSkillsData });
                              }
                              handleDoneSkillsEntry();
                            }}
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save & Done
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleDoneSkillsEntry}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p><strong>Title:</strong> {entry.title}</p>
                        <p><strong>Icon:</strong> {entry.icon_name}</p>
                        <p><strong>Color:</strong> {entry.color_class}</p>
                        <p><strong>Skills:</strong> {entry.skills.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hire/Contact CTA Section</CardTitle>
              <CardDescription>Edit the call-to-action section displayed after blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cta-title">Title</Label>
                  <Input
                    id="cta-title"
                    value={contentSections.find(s => s.section_key === 'cta_hire')?.title || ''}
                    onChange={(e) => {
                      setContentSections(prev => prev.map(s => 
                        s.section_key === 'cta_hire' ? { ...s, title: e.target.value } : s
                      ));
                    }}
                    placeholder="Want to hire for short term or long term project please contact"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-whatsapp">WhatsApp Number</Label>
                  <Input
                    id="cta-whatsapp"
                    value={contentSections.find(s => s.section_key === 'cta_whatsapp')?.content || ''}
                    onChange={(e) => {
                      setContentSections(prev => prev.map(s => 
                        s.section_key === 'cta_whatsapp' ? { ...s, content: e.target.value } : s
                      ));
                    }}
                    placeholder="+38345677497"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Include country code (e.g., +38345677497)
                  </p>
                </div>
                <Button 
                  onClick={async () => {
                    setLoading(true);
                    const ctaHire = contentSections.find(s => s.section_key === 'cta_hire');
                    const ctaWhatsapp = contentSections.find(s => s.section_key === 'cta_whatsapp');
                    
                    console.log('Saving CTA sections:', { ctaHire, ctaWhatsapp });
                    
                    const updates = [];
                    if (ctaHire) {
                      updates.push(
                        supabase.from('content_sections')
                          .update({ title: ctaHire.title })
                          .eq('section_key', 'cta_hire')
                      );
                    }
                    if (ctaWhatsapp) {
                      updates.push(
                        supabase.from('content_sections')
                          .update({ content: ctaWhatsapp.content })
                          .eq('section_key', 'cta_whatsapp')
                      );
                    }
                    
                    const results = await Promise.all(updates);
                    console.log('CTA save results:', results);
                    const hasError = results.some(r => r.error);
                    
                    if (hasError) {
                      toast({
                        title: "Error",
                        description: "Failed to update CTA section",
                        variant: "destructive",
                      });
                    } else {
                      toast({
                        title: "Success",
                        description: "CTA section updated successfully!",
                      });
                      fetchContentSections();
                    }
                    setLoading(false);
                  }}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save CTA Section
                </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileUpload
              imageKey="hero_profile_image"
              title="Primary Profile Image"
              currentImageUrl={contentSections.find(s => s.section_key === 'hero_profile_image')?.content}
              onUploadComplete={fetchContentSections}
            />
            
            <ProfileUpload
              imageKey="hero_profile_image_2"
              title="Secondary Profile Image"
              currentImageUrl={contentSections.find(s => s.section_key === 'hero_profile_image_2')?.content}
              onUploadComplete={fetchContentSections}
            />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <WorkExperienceManager />
          <CertificationManager />
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

        <TabsContent value="backup" className="space-y-6">
          <FTPBackupSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
