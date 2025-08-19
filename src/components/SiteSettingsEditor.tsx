import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Settings, Globe, BarChart, FileText, User, Mail } from 'lucide-react';

const SiteSettingsEditor = () => {
  const { siteSettings, updateSiteSetting, loading } = useSEO();
  const { toast } = useToast();
  const { getCredentials, updateCredentials } = useAdminAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [adminData, setAdminData] = useState(() => getCredentials() || { username: '', password: '', email: '' });
  const [emailjsConfig, setEmailjsConfig] = useState(() => {
    const stored = localStorage.getItem('emailjs_config');
    return stored ? JSON.parse(stored) : { serviceId: '', templateId: '', publicKey: '' };
  });

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

  const handleAdminUpdate = (field: string, value: string) => {
    const newData = { ...adminData, [field]: value };
    setAdminData(newData);
    updateCredentials(newData);
    toast({
      title: "Success",
      description: `Admin ${field} updated successfully!`,
    });
  };

  const handleEmailjsUpdate = (field: string, value: string) => {
    const newConfig = { ...emailjsConfig, [field]: value };
    setEmailjsConfig(newConfig);
    localStorage.setItem('emailjs_config', JSON.stringify(newConfig));
    toast({
      title: "Success",
      description: `EmailJS ${field} updated successfully!`,
    });
  };

  if (loading) {
    return <div className="p-4">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Admin Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Admin Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin_username">Admin Username</Label>
            <Input
              id="admin_username"
              placeholder="admin"
              value={adminData.username}
              onChange={(e) => handleAdminUpdate('username', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin_password">Admin Password</Label>
            <Input
              id="admin_password"
              type="password"
              placeholder="Enter new password"
              value={adminData.password}
              onChange={(e) => handleAdminUpdate('password', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin_email">Admin Email (for password reset)</Label>
            <Input
              id="admin_email"
              type="email"
              placeholder="admin@example.com"
              value={adminData.email}
              onChange={(e) => handleAdminUpdate('email', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* EmailJS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            EmailJS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailjs_service">Service ID</Label>
            <Input
              id="emailjs_service"
              placeholder="service_xxxxxxx"
              value={emailjsConfig.serviceId}
              onChange={(e) => handleEmailjsUpdate('serviceId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailjs_template">Template ID</Label>
            <Input
              id="emailjs_template"
              placeholder="template_xxxxxxx"
              value={emailjsConfig.templateId}
              onChange={(e) => handleEmailjsUpdate('templateId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailjs_public">Public Key</Label>
            <Input
              id="emailjs_public"
              placeholder="xxxxxxxxxxxxxxxx"
              value={emailjsConfig.publicKey}
              onChange={(e) => handleEmailjsUpdate('publicKey', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

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
        <CardContent className="space-y-6">
          {/* Google Analytics Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Google Analytics (GA4)</h4>
            <div className="space-y-2">
              <Label htmlFor="enable_ga">Enable Google Analytics</Label>
              <select
                id="enable_ga"
                className="w-full px-3 py-2 border border-input rounded-md"
                defaultValue={getSetting('enable_ga') || 'false'}
                onChange={(e) => handleUpdateSetting('enable_ga', e.target.value)}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga_measurement_id">GA Measurement ID</Label>
              <Input
                id="ga_measurement_id"
                defaultValue={getSetting('ga_measurement_id')}
                placeholder="G-V9GB54TCZF"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('ga_measurement_id')) {
                    handleUpdateSetting('ga_measurement_id', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Tawk.to Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Tawk.to Live Chat</h4>
            <div className="space-y-2">
              <Label htmlFor="enable_tawk">Enable Tawk.to Chat</Label>
              <select
                id="enable_tawk"
                className="w-full px-3 py-2 border border-input rounded-md"
                defaultValue={getSetting('enable_tawk') || 'false'}
                onChange={(e) => handleUpdateSetting('enable_tawk', e.target.value)}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tawk_widget_code">Tawk.to Widget Code</Label>
              <Textarea
                id="tawk_widget_code"
                defaultValue={getSetting('tawk_widget_code')}
                placeholder="Paste your Tawk.to script code here"
                rows={6}
                className="font-mono text-sm"
                onBlur={(e) => {
                  if (e.target.value !== getSetting('tawk_widget_code')) {
                    handleUpdateSetting('tawk_widget_code', e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Search Console</h4>
            <div className="space-y-2">
              <Label htmlFor="google_search_console_verification">Google Search Console Verification</Label>
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