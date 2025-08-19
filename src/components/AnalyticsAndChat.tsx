import React, { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const AnalyticsAndChat = () => {
  const { getSiteSetting } = useSEO();

  useEffect(() => {
    // Google Analytics
    const enableGA = getSiteSetting('enable_ga') === 'true';
    const gaMeasurementId = getSiteSetting('ga_measurement_id');

    if (enableGA && gaMeasurementId) {
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
    }

    // Tawk.to Chat
    const enableTawk = getSiteSetting('enable_tawk') === 'true';
    const tawkWidgetCode = getSiteSetting('tawk_widget_code');

    if (enableTawk && tawkWidgetCode) {
      const div = document.createElement('div');
      div.innerHTML = tawkWidgetCode;
      document.body.appendChild(div);
    }
  }, [getSiteSetting]);

  return null;
};

export default AnalyticsAndChat;