import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, RefreshCw, Database } from 'lucide-react';

interface FTPSettings {
  id: string;
  ftp_host: string;
  ftp_username: string;
  ftp_password: string;
  ftp_port: number;
  backup_enabled: boolean;
  last_backup_at: string | null;
}

const FTPBackupSettings = () => {
  const [settings, setSettings] = useState<FTPSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ftp_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching FTP settings:', error);
        throw error;
      }
      
      console.log('Fetched FTP settings:', data);
      if (data) {
        setSettings(data);
      }
    } catch (err: any) {
      console.error('Error fetching FTP settings:', err);
      toast({
        title: "Error",
        description: `Failed to load FTP settings: ${err.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      console.log('Saving FTP settings:', settings);
      
      const { data, error } = await supabase
        .from('ftp_settings')
        .update({
          ftp_host: settings.ftp_host,
          ftp_username: settings.ftp_username,
          ftp_password: settings.ftp_password,
          ftp_port: settings.ftp_port,
          backup_enabled: settings.backup_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id)
        .select();

      console.log('Save result:', { data, error });

      if (error) throw error;

      toast({
        title: "Success",
        description: "FTP settings saved successfully!",
      });
      fetchSettings();
    } catch (err: any) {
      console.error('Error saving FTP settings:', err);
      toast({
        title: "Error",
        description: `Failed to save FTP settings: ${err.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  const handleTestBackup = async () => {
    toast({
      title: "Backup Triggered",
      description: "Manual backup has been initiated. This may take a few minutes.",
    });
    
    try {
      const { error } = await supabase.functions.invoke('database-backup');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Backup completed successfully!",
      });
      fetchSettings();
    } catch (err) {
      console.error('Error triggering backup:', err);
      toast({
        title: "Error",
        description: "Failed to trigger backup. Please check your FTP settings.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No FTP settings found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Backup Settings</CardTitle>
        <CardDescription>
          Configure automatic daily FTP backups of your database
          {settings.last_backup_at && (
            <span className="block mt-2 text-sm">
              Last backup: {new Date(settings.last_backup_at).toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Backup database daily at midnight UTC
              </p>
            </div>
            <Switch
              checked={settings.backup_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, backup_enabled: checked })
              }
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ftp-host">FTP Host/IP</Label>
              <Input
                id="ftp-host"
                value={settings.ftp_host}
                onChange={(e) =>
                  setSettings({ ...settings, ftp_host: e.target.value })
                }
                placeholder="23.166.88.239"
              />
            </div>

            <div>
              <Label htmlFor="ftp-username">FTP Username</Label>
              <Input
                id="ftp-username"
                value={settings.ftp_username}
                onChange={(e) =>
                  setSettings({ ...settings, ftp_username: e.target.value })
                }
                placeholder="username"
              />
            </div>

            <div>
              <Label htmlFor="ftp-password">FTP Password</Label>
              <Input
                id="ftp-password"
                type="password"
                value={settings.ftp_password}
                onChange={(e) =>
                  setSettings({ ...settings, ftp_password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>

            <div>
              <Label htmlFor="ftp-port">FTP Port</Label>
              <Input
                id="ftp-port"
                type="number"
                value={settings.ftp_port}
                onChange={(e) =>
                  setSettings({ ...settings, ftp_port: parseInt(e.target.value) || 21 })
                }
                placeholder="21"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button variant="secondary" onClick={() => fetchSettings()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Settings
            </Button>
            <Button variant="outline" onClick={handleTestBackup}>
              <Database className="h-4 w-4 mr-2" />
              Test Backup Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FTPBackupSettings;
