
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface ProfileUploadProps {
  imageKey: string;
  title: string;
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
}

const ProfileUpload = ({ imageKey, title, currentImageUrl, onUploadComplete }: ProfileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageKey}-${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', fileName);
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update the content section with the new image URL
      const { error: updateError } = await supabase
        .from('content_sections')
        .upsert({
          section_key: imageKey,
          title: title,
          content: publicUrl,
          section_type: 'image'
        }, {
          onConflict: 'section_key'
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${title} uploaded successfully!`,
      });
      
      setFile(null);
      onUploadComplete(publicUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to upload ${title.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={imageKey}>Select Image</Label>
          <Input
            id={imageKey}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload ${title}`}
        </Button>
        
        {currentImageUrl && (
          <div className="mt-4">
            <Label>Current Image</Label>
            <img 
              src={currentImageUrl} 
              alt={title}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-400 mt-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileUpload;
