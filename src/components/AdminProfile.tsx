import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';

const AdminProfile = () => {
  const { toast } = useToast();
  const { getCredentials, updateCredentials, changePassword } = useAdminAuth();
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
  const [loading, setLoading] = useState({
    profile: false,
    password: false
  });

  // Load admin credentials on component mount
  useEffect(() => {
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

  const handleProfileUpdate = async (field: string, value: string) => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const newData = { ...adminData, [field]: value };
      setAdminData(newData);
      await updateCredentials({ [field]: value });
      toast({
        title: "Success",
        description: `${field === 'username' ? 'Username' : 'Email'} updated successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
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

    setLoading(prev => ({ ...prev, password: true }));
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
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile_username">Username</Label>
            <Input
              id="profile_username"
              placeholder="admin"
              value={adminData.username}
              onBlur={(e) => {
                if (e.target.value !== adminData.username) {
                  handleProfileUpdate('username', e.target.value);
                }
              }}
              disabled={loading.profile}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="profile_email"
                type="email"
                placeholder="admin@example.com"
                value={adminData.email}
                onBlur={(e) => {
                  if (e.target.value !== adminData.email) {
                    handleProfileUpdate('email', e.target.value);
                  }
                }}
                className="pl-10"
                disabled={loading.profile}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This email is used for password reset functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                disabled={loading.password}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                disabled={loading.password}
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
                placeholder="Enter new password (min. 6 characters)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                disabled={loading.password}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                disabled={loading.password}
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
                disabled={loading.password}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                disabled={loading.password}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handlePasswordChange}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || loading.password}
            className="w-full"
          >
            {loading.password ? 'Changing Password...' : 'Change Password'}
          </Button>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Password Requirements:</strong>
              <br />• Minimum 6 characters
              <br />• Keep it secure and unique
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;