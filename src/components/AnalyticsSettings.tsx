
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { BarChart, MessageCircle, Globe, Save } from 'lucide-react';

const AnalyticsSettings = () => {
  const { siteSettings, updateSiteSetting, loading } = useSEO();
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [gaId, setGaId] = useState('');
  const [tawkCode, setTawkCode] = useState('');
  const [searchConsoleCode, setSearchConsoleCode] = useState('');

  const handleUpdateSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const error = await updateSiteSetting(key, value);
      if (error) throw error;
      
      toast({
        title: "Setting updated",
        description: "Analytics setting has been saved successfully"
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

  // Initialize local state when siteSettings change
  React.useEffect(() => {
    if (siteSettings.length > 0) {
      setGaId(getSetting('ga_measurement_id'));
      setTawkCode(getSetting('tawk_widget_code'));
      setSearchConsoleCode(getSetting('google_search_console_verification'));
    }
  }, [siteSettings]);

  const handleToggleGA = async (enabled: boolean) => {
    await handleUpdateSetting('enable_ga', enabled.toString());
  };

  const handleToggleTawk = async (enabled: boolean) => {
    await handleUpdateSetting('enable_tawk', enabled.toString());
  };

  // Show loading only if we're actually loading and have no settings data
  if (loading && siteSettings.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-lg text-muted-foreground">Loading analytics settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Google Analytics (GA4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Google Analytics</Label>
              <div className="text-sm text-muted-foreground">
                Track website visitors and behavior
              </div>
            </div>
            <Switch
              checked={getSetting('enable_ga') === 'true'}
              onCheckedChange={handleToggleGA}
              disabled={saving === 'enable_ga'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ga_measurement_id">GA Measurement ID</Label>
            <div className="flex gap-2">
              <Input
                id="ga_measurement_id"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="G-V9GB54TCZF"
                disabled={saving === 'ga_measurement_id'}
              />
              <Button
                onClick={() => handleUpdateSetting('ga_measurement_id', gaId)}
                disabled={saving === 'ga_measurement_id' || gaId === getSetting('ga_measurement_id')}
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Find this in your Google Analytics 4 property settings. Go to Admin → Data Streams → Web → Your Stream → Measurement ID
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tawk.to Live Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Tawk.to Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Live Chat</Label>
              <div className="text-sm text-muted-foreground">
                Add live chat widget to all pages
              </div>
            </div>
            <Switch
              checked={getSetting('enable_tawk') === 'true'}
              onCheckedChange={handleToggleTawk}
              disabled={saving === 'enable_tawk'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tawk_widget_code">Tawk.to Widget Code</Label>
            <Textarea
              id="tawk_widget_code"
              value={tawkCode}
              onChange={(e) => setTawkCode(e.target.value)}
              placeholder="Paste your complete Tawk.to script code here..."
              rows={8}
              className="font-mono text-sm"
              disabled={saving === 'tawk_widget_code'}
            />
            <Button
              onClick={() => handleUpdateSetting('tawk_widget_code', tawkCode)}
              disabled={saving === 'tawk_widget_code' || tawkCode === getSetting('tawk_widget_code')}
              className="mt-2"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Tawk.to Code
            </Button>
            <div className="text-sm text-muted-foreground">
              Copy the complete script code from your Tawk.to dashboard → Administration → Chat Widget → Direct Chat Link
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Search Console */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Search Console Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_search_console_verification">Google Search Console Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="google_search_console_verification"
                value={searchConsoleCode}
                onChange={(e) => setSearchConsoleCode(e.target.value)}
                placeholder="verification code"
                disabled={saving === 'google_search_console_verification'}
              />
              <Button
                onClick={() => handleUpdateSetting('google_search_console_verification', searchConsoleCode)}
                disabled={saving === 'google_search_console_verification' || searchConsoleCode === getSetting('google_search_console_verification')}
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Find this in Google Search Console → Settings → Ownership verification → HTML tag method
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSettings;
