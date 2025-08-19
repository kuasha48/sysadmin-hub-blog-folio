import { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';

const FaviconUpdater = () => {
  const { content: profileImageContent } = useContent('hero_profile_image');

  useEffect(() => {
    if (profileImageContent?.content) {
      // Update favicon
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = profileImageContent.content;

      // Update shortcut icon
      let shortcutIcon = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
      if (!shortcutIcon) {
        shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        document.head.appendChild(shortcutIcon);
      }
      shortcutIcon.href = profileImageContent.content;

      // Update apple-touch-icon
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = profileImageContent.content;
    }
  }, [profileImageContent]);

  return null;
};

export default FaviconUpdater;