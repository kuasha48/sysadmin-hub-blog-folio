import React, { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    Tawk_API?: any;
  }
}

const AnalyticsAndChat = () => {
  const { getSiteSetting, siteSettings } = useSEO();

  useEffect(() => {
    // Wait for site settings to load
    if (siteSettings.length === 0) return;

    // Google Analytics
    const enableGA = getSiteSetting('enable_ga') === 'true';
    const gaMeasurementId = getSiteSetting('ga_measurement_id');

    if (enableGA && gaMeasurementId) {
      // Remove existing GA scripts
      const existingGAScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      existingGAScripts.forEach(script => script.remove());

      // Load gtag script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaMeasurementId}');
      `;
      document.head.appendChild(script2);

      console.log('Google Analytics GA4 loaded with ID:', gaMeasurementId);
    }

    // Tawk.to Chat
    const enableTawk = getSiteSetting('enable_tawk') === 'true';
    const tawkWidgetCode = getSiteSetting('tawk_widget_code');

    if (enableTawk && tawkWidgetCode && tawkWidgetCode.trim()) {
      console.log('Loading Tawk.to with code:', tawkWidgetCode.substring(0, 100) + '...');
      
      // Remove existing Tawk scripts and widgets
      const existingTawkScripts = document.querySelectorAll('script[src*="tawk.to"]');
      existingTawkScripts.forEach(script => script.remove());
      
      // Remove existing Tawk widget if present
      const existingWidget = document.getElementById('tawk-to-container');
      if (existingWidget) {
        existingWidget.remove();
      }
      
      // Clean any existing Tawk_API
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }

      try {
        // Extract the script content properly
        let scriptContent = tawkWidgetCode;
        
        // Remove script tags if they exist
        scriptContent = scriptContent.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '');
        
        // Create and inject the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.innerHTML = scriptContent;
        
        // Add to body instead of head for better compatibility
        document.body.appendChild(scriptElement);

        console.log('Tawk.to Live Chat script injected successfully');
        
        // Check if Tawk_API is available after a short delay
        setTimeout(() => {
          if (window.Tawk_API) {
            console.log('Tawk.to Live Chat is ready');
          } else {
            console.warn('Tawk.to Live Chat may not have loaded correctly');
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error loading Tawk.to Live Chat:', error);
      }
    } else if (enableTawk) {
      console.warn('Tawk.to is enabled but no widget code provided');
    }
  }, [getSiteSetting, siteSettings]);

  return null;
};

export default AnalyticsAndChat;