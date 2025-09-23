import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Settings, Globe, FileText, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const SiteSettingsEditor = () => {
  const { siteSettings, updateSiteSetting, loading } = useSEO();
  const { toast } = useToast();
  const { getCredentials, updateCredentials, changePassword } = useAdminAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [adminData, setAdminData] = useState({ username: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [emailjsConfig, setEmailjsConfig] = useState(() => {
    const stored = localStorage.getItem('emailjs_config');
    return stored ? JSON.parse(stored) : { serviceId: '', templateId: '', publicKey: '' };
  });

  // Load admin credentials on component mount
  React.useEffect(() => {
    const loadCredentials = async () => {
      const credentials = await getCredentials();
      if (credentials) {
        setAdminData({
          username: credentials.username,
          email: credentials.email
        });
      }
    };
    loadCredentials();
  }, [getCredentials]);

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

  const handleAdminUpdate = async (field: string, value: string) => {
    try {
      const newData = { ...adminData, [field]: value };
      setAdminData(newData);
      await updateCredentials({ [field]: value });
      toast({
        title: "Success",
        description: `Admin ${field} updated successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update admin ${field}`,
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (success) {
        toast({
          title: "Success",
          description: "Password changed successfully!",
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive"
      });
    }
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
    return (
      <div className="p-8 text-center">
        <div className="text-lg text-muted-foreground">Loading site settings...</div>
        <div className="text-sm text-muted-foreground mt-2">
          If this persists, please check your database connection.
        </div>
      </div>
    );
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
        <CardContent className="space-y-6">
          {/* Basic Admin Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
            <div className="space-y-2">
              <Label htmlFor="admin_username">Admin Username</Label>
              <Input
                id="admin_username"
                placeholder="admin"
                value={adminData.username}
                onBlur={(e) => handleAdminUpdate('username', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email (for password reset)</Label>
              <Input
                id="admin_email"
                type="email"
                placeholder="admin@example.com"
                value={adminData.email}
                onBlur={(e) => handleAdminUpdate('email', e.target.value)}
              />
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h4>
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              onClick={handlePasswordChange}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full"
            >
              Change Password
            </Button>
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