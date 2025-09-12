import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // Don't show chat on admin pages
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/auth');

  useEffect(() => {
    console.log('AnalyticsAndChat: useEffect triggered, siteSettings length:', siteSettings.length);
    console.log('AnalyticsAndChat: All site settings:', siteSettings);
    
    // Wait for site settings to load
    if (siteSettings.length === 0) {
      console.log('AnalyticsAndChat: Waiting for site settings to load...');
      return;
    }

    console.log('AnalyticsAndChat: Site settings loaded, processing analytics and chat...');

    // Google Analytics
    const enableGA = getSiteSetting('enable_ga') === 'true';
    const gaMeasurementId = getSiteSetting('ga_measurement_id');

    console.log('GA Settings:', { enableGA, gaMeasurementId });

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

    // Tawk.to Chat - only show on frontend pages
    const enableTawk = getSiteSetting('enable_tawk') === 'true';
    const tawkWidgetCode = getSiteSetting('tawk_widget_code');

    console.log('Tawk Settings:', { 
      enableTawk, 
      hasCode: !!tawkWidgetCode, 
      codeLength: tawkWidgetCode?.length || 0,
      codePreview: tawkWidgetCode?.substring(0, 100) + '...',
      isAdminPage
    });

    if (enableTawk && tawkWidgetCode && tawkWidgetCode.trim() && !isAdminPage) {
      console.log('Processing Tawk.to chat widget...');
      
      // Remove existing Tawk scripts and widgets
      const existingTawkScripts = document.querySelectorAll('script[src*="tawk.to"], script[src*="embed.tawk.to"]');
      console.log('Removing existing Tawk scripts:', existingTawkScripts.length);
      existingTawkScripts.forEach(script => script.remove());
      
      // Remove existing Tawk widget containers
      const existingWidgets = document.querySelectorAll('#tawk-to-container, [id*="tawk"], .tawk-embed');
      console.log('Removing existing Tawk widgets:', existingWidgets.length);
      existingWidgets.forEach(widget => widget.remove());
      
      // Clean any existing Tawk_API and related globals
      if (window.Tawk_API) {
        console.log('Cleaning existing Tawk_API');
        delete window.Tawk_API;
      }

      // Clear any existing Tawk timers or intervals
      if ((window as any).Tawk_LoadStart) {
        delete (window as any).Tawk_LoadStart;
      }

      try {
        // Extract the script content properly
        let scriptContent = tawkWidgetCode.trim();
        
        // Remove any HTML script tags if they exist
        scriptContent = scriptContent.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '').trim();
        
        console.log('Cleaned script content length:', scriptContent.length);
        console.log('Script content preview:', scriptContent.substring(0, 200) + '...');
        
        // Create and inject the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.id = 'tawk-to-script';
        scriptElement.innerHTML = scriptContent;
        
        // Add to document head for better script execution
        document.head.appendChild(scriptElement);

        console.log('Tawk.to script element created and appended to head');
        
        // Wait for script to execute and check for Tawk_API
        let checkAttempts = 0;
        const maxAttempts = 10;
        
        const checkTawkAPI = () => {
          checkAttempts++;
          console.log(`Checking for Tawk_API (attempt ${checkAttempts}/${maxAttempts})`);
          
          if (window.Tawk_API) {
            console.log('✅ Tawk.to Live Chat API is ready!');
            
            // Additional check for the widget
            setTimeout(() => {
              const widget = document.querySelector('[src*="tawk.to"], [id*="tawk"]');
              if (widget) {
                console.log('✅ Tawk.to widget element found:', widget);
              } else {
                console.warn('⚠️ Tawk.to API ready but widget element not found');
              }
            }, 1000);
            
          } else if (checkAttempts < maxAttempts) {
            setTimeout(checkTawkAPI, 1000);
          } else {
            console.error('❌ Tawk.to Live Chat failed to load after multiple attempts');
            console.log('Current window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('tawk')));
          }
        };
        
        // Start checking after a brief delay
        setTimeout(checkTawkAPI, 500);
        
      } catch (error) {
        console.error('❌ Error loading Tawk.to Live Chat:', error);
      }
    } else if (enableTawk && !tawkWidgetCode) {
      console.warn('⚠️ Tawk.to is enabled but no widget code provided');
    } else if (!enableTawk) {
      console.log('ℹ️ Tawk.to chat is disabled');
    } else if (isAdminPage) {
      console.log('ℹ️ Tawk.to chat hidden on admin pages');
      // Remove chat widget if switching to admin
      const existingTawkScripts = document.querySelectorAll('script[src*="tawk.to"], script[src*="embed.tawk.to"]');
      existingTawkScripts.forEach(script => script.remove());
      const existingWidgets = document.querySelectorAll('#tawk-to-container, [id*="tawk"], .tawk-embed');
      existingWidgets.forEach(widget => widget.remove());
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
    }
  }, [getSiteSetting, siteSettings, location.pathname]);

  return null;
};

export default AnalyticsAndChat;