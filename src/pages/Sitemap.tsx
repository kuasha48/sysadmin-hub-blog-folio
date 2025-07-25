import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    try {
      // Get site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*');
      
      const siteUrl = settings?.find(s => s.setting_key === 'site_url')?.setting_value || 'https://azimstech.com';

      // Get published blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .order('updated_at', { ascending: false });

      // Generate sitemap XML
      const staticPages = [
        { url: '', priority: '1.0', changefreq: 'weekly' },
        { url: 'about', priority: '0.8', changefreq: 'monthly' },
        { url: 'blog', priority: '0.9', changefreq: 'daily' },
        { url: 'contact', priority: '0.7', changefreq: 'monthly' }
      ];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      staticPages.forEach(page => {
        sitemap += `
  <url>
    <loc>${siteUrl}/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      // Add blog posts
      if (posts) {
        posts.forEach(post => {
          const lastmod = new Date(post.updated_at || post.published_at).toISOString().split('T')[0];
          sitemap += `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });
      }

      sitemap += `
</urlset>`;

      // Set content type and return XML
      const response = new Response(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });

      // Create blob and download
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Generating Sitemap</h1>
        <p className="text-gray-600">Your sitemap.xml is being generated and downloaded...</p>
      </div>
    </div>
  );
};

export default Sitemap;