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
      // Remove existing Tawk script
      const existingTawkScripts = document.querySelectorAll('script[src*="tawk.to"]');
      existingTawkScripts.forEach(script => script.remove());

      // Create script element and inject the code
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.innerHTML = tawkWidgetCode.replace(/<script[^>]*>|<\/script>/gi, '');
      document.head.appendChild(scriptElement);

      console.log('Tawk.to Live Chat loaded');
    }
  }, [getSiteSetting, siteSettings]);

  return null;
};

export default AnalyticsAndChat;