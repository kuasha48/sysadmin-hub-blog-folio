import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Settings, Globe, BarChart, FileText } from 'lucide-react';

const SiteSettingsEditor = () => {
  const { siteSettings, updateSiteSetting, loading } = useSEO();
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);

  const handleUpdateSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const error = await updateSiteSetting(key, value);
      if (error) throw error;
      
      toast({
        title: "Setting updated",
        description: "Site setting has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error updating setting",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setSaving(null);
  };

  const getSetting = (key: string) => {
    return siteSettings.find(s => s.setting_key === key)?.setting_value || '';
  };

  if (loading) {
    return <div className="p-4">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <div className="flex gap-2">
              <Input
                id="site_name"
                defaultValue={getSetting('site_name')}
                placeholder="Your site name"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('site_name')) {
                    handleUpdateSetting('site_name', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Default Site Description</Label>
            <div className="flex gap-2">
              <Textarea
                id="site_description"
                defaultValue={getSetting('site_description')}
                placeholder="Default description for your site"
                rows={3}
                onBlur={(e) => {
                  if (e.target.value !== getSetting('site_description')) {
                    handleUpdateSetting('site_description', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_url">Site URL</Label>
            <div className="flex gap-2">
              <Input
                id="site_url"
                defaultValue={getSetting('site_url')}
                placeholder="https://yourdomain.com"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('site_url')) {
                    handleUpdateSetting('site_url', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_og_image">Default Open Graph Image</Label>
            <div className="flex gap-2">
              <Input
                id="default_og_image"
                defaultValue={getSetting('default_og_image')}
                placeholder="https://yourdomain.com/default-og-image.jpg"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('default_og_image')) {
                    handleUpdateSetting('default_og_image', e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analytics & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
            <div className="flex gap-2">
              <Input
                id="google_analytics_id"
                defaultValue={getSetting('google_analytics_id')}
                placeholder="G-XXXXXXXXXX"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('google_analytics_id')) {
                    handleUpdateSetting('google_analytics_id', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_search_console_verification">Google Search Console Verification</Label>
            <div className="flex gap-2">
              <Input
                id="google_search_console_verification"
                defaultValue={getSetting('google_search_console_verification')}
                placeholder="verification code"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('google_search_console_verification')) {
                    handleUpdateSetting('google_search_console_verification', e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Robots.txt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="robots_txt_content">Robots.txt Content</Label>
            <div className="flex gap-2">
              <Textarea
                id="robots_txt_content"
                defaultValue={getSetting('robots_txt_content')}
                placeholder="User-agent: *&#10;Allow: /&#10;&#10;Sitemap: /sitemap.xml"
                rows={6}
                className="font-mono text-sm"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('robots_txt_content')) {
                    handleUpdateSetting('robots_txt_content', e.target.value);
                  }
                }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              This will be served at /robots.txt
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsEditor;