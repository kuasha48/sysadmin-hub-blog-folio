import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Globe, Twitter, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface SEOEditorProps {
  pageType: string;
  pageSlug?: string;
  contentTitle?: string;
  contentExcerpt?: string;
  onSave?: () => void;
}

const SEOEditor = ({ 
  pageType, 
  pageSlug, 
  contentTitle, 
  contentExcerpt,
  onSave 
}: SEOEditorProps) => {
  const { seoData, updateSEOData, generateMetaTags, loading } = useSEO(pageType, pageSlug);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
    json_ld: ''
  });

  useEffect(() => {
    if (seoData) {
      setFormData({
        title: seoData.title || '',
        description: seoData.description || '',
        keywords: seoData.keywords || '',
        og_title: seoData.og_title || '',
        og_description: seoData.og_description || '',
        og_image: seoData.og_image || '',
        twitter_title: seoData.twitter_title || '',
        twitter_description: seoData.twitter_description || '',
        twitter_image: seoData.twitter_image || '',
        canonical_url: seoData.canonical_url || '',
        robots_index: seoData.robots_index !== false,
        robots_follow: seoData.robots_follow !== false,
        json_ld: seoData.json_ld ? JSON.stringify(seoData.json_ld, null, 2) : ''
      });
    } else {
      // Set defaults from content if available
      setFormData(prev => ({
        ...prev,
        title: contentTitle || '',
        description: contentExcerpt || '',
        og_title: contentTitle || '',
        og_description: contentExcerpt || '',
        twitter_title: contentTitle || '',
        twitter_description: contentExcerpt || ''
      }));
    }
  }, [seoData, contentTitle, contentExcerpt]);

  const handleSave = async () => {
    try {
      let jsonLd = null;
      if (formData.json_ld.trim()) {
        try {
          jsonLd = JSON.parse(formData.json_ld);
        } catch (e) {
          toast({
            title: "Invalid JSON-LD",
            description: "Please check your JSON-LD syntax",
            variant: "destructive"
          });
          return;
        }
      }

      const error = await updateSEOData({
        ...formData,
        json_ld: jsonLd
      });

      if (error) {
        throw error;
      }

      toast({
        title: "SEO data saved",
        description: "SEO metadata has been updated successfully"
      });

      onSave?.();
    } catch (error) {
      toast({
        title: "Error saving SEO data",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getSEOScore = () => {
    let score = 0;
    let issues = [];
    let suggestions = [];

    // Title checks
    if (formData.title) {
      score += 20;
      if (formData.title.length >= 30 && formData.title.length <= 60) {
        score += 10;
      } else {
        issues.push("Title should be 30-60 characters");
      }
    } else {
      issues.push("Title is required");
    }

    // Description checks
    if (formData.description) {
      score += 20;
      if (formData.description.length >= 120 && formData.description.length <= 160) {
        score += 10;
      } else {
        issues.push("Description should be 120-160 characters");
      }
    } else {
      issues.push("Meta description is required");
    }

    // Keywords check
    if (formData.keywords) {
      score += 10;
    } else {
      suggestions.push("Add focus keywords");
    }

    // OG tags check
    if (formData.og_title && formData.og_description) {
      score += 15;
    } else {
      suggestions.push("Add Open Graph tags for better social sharing");
    }

    // Image check
    if (formData.og_image) {
      score += 10;
    } else {
      suggestions.push("Add an Open Graph image");
    }

    // Twitter cards
    if (formData.twitter_title && formData.twitter_description) {
      score += 10;
    } else {
      suggestions.push("Add Twitter card data");
    }

    // JSON-LD
    if (formData.json_ld) {
      score += 5;
    } else {
      suggestions.push("Add structured data (JSON-LD)");
    }

    return { score, issues, suggestions };
  };

  const seoScore = getSEOScore();

  if (loading) {
    return <div className="p-4">Loading SEO editor...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Settings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={seoScore.score >= 80 ? 'default' : seoScore.score >= 60 ? 'secondary' : 'destructive'}>
              SEO Score: {seoScore.score}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">SEO Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter SEO title"
              />
              <div className="text-sm text-muted-foreground">
                {formData.title.length}/60 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter meta description"
                rows={3}
              />
              <div className="text-sm text-muted-foreground">
                {formData.description.length}/160 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Focus Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonical">Canonical URL</Label>
              <Input
                id="canonical"
                value={formData.canonical_url}
                onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="robots_index"
                  checked={formData.robots_index}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, robots_index: checked }))}
                />
                <Label htmlFor="robots_index">Allow indexing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="robots_follow"
                  checked={formData.robots_follow}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, robots_follow: checked }))}
                />
                <Label htmlFor="robots_follow">Follow links</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                  placeholder="Open Graph title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                  placeholder="Open Graph description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={formData.og_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-2 mb-4 mt-6">
                <Twitter className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Twitter Cards</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={formData.twitter_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                  placeholder="Twitter card title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={formData.twitter_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                  placeholder="Twitter card description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  value={formData.twitter_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json_ld">JSON-LD Structured Data</Label>
              <Textarea
                id="json_ld"
                value={formData.json_ld}
                onChange={(e) => setFormData(prev => ({ ...prev, json_ld: e.target.value }))}
                placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                rows={10}
                className="font-mono text-sm"
              />
              <div className="text-sm text-muted-foreground">
                Enter valid JSON-LD structured data for Google rich snippets
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <h3 className="text-lg font-semibold">SEO Analysis</h3>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    seoScore.score >= 80 ? 'bg-green-500' : seoScore.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {seoScore.score}
                  </div>
                  <div>
                    <div className="font-semibold">SEO Score</div>
                    <div className="text-sm text-muted-foreground">
                      {seoScore.score >= 80 ? 'Excellent' : seoScore.score >= 60 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>
              </div>

              {seoScore.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Issues to Fix
                  </h4>
                  <ul className="space-y-1">
                    {seoScore.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-600 rounded-full" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {seoScore.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {seoScore.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-yellow-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            Save SEO Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOEditor;