import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Robots = () => {
  const [robotsContent, setRobotsContent] = useState('');

  useEffect(() => {
    generateRobotsTxt();
  }, []);

  const generateRobotsTxt = async () => {
    try {
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*');
      
      const robotsContent = settings?.find(s => s.setting_key === 'robots_txt_content')?.setting_value || 
        'User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml';
      
      setRobotsContent(robotsContent);

      // Set content type and return as plain text
      const response = new Response(robotsContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600'
        }
      });

      // Create blob and download
      const blob = new Blob([robotsContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating robots.txt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Robots.txt Generated</h1>
        <p className="text-gray-600 mb-6">Your robots.txt file has been generated and downloaded.</p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-2">Content Preview:</h3>
          <pre className="text-left text-sm bg-gray-50 p-3 rounded border font-mono whitespace-pre-wrap">
            {robotsContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Robots;