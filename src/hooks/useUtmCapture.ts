 import { useEffect } from 'react';
 
 /**
  * Hook to capture and store UTM parameters from the URL.
  * Call this on landing pages to persist UTM data for later use in payment tracking.
  */
 export function useUtmCapture() {
   useEffect(() => {
     if (typeof window === 'undefined') return;
 
     const urlParams = new URLSearchParams(window.location.search);
     
     const utmParams = {
       utm_source: urlParams.get('utm_source') || undefined,
       utm_medium: urlParams.get('utm_medium') || undefined,
       utm_campaign: urlParams.get('utm_campaign') || undefined,
       utm_content: urlParams.get('utm_content') || undefined,
       utm_term: urlParams.get('utm_term') || undefined,
       src: urlParams.get('src') || undefined,
       sck: urlParams.get('sck') || undefined,
     };
 
     // Only save if at least one UTM param exists
     const hasUtm = Object.values(utmParams).some(v => v !== undefined);
     
     if (hasUtm) {
       // Clean undefined values before storing
       const cleanParams = Object.fromEntries(
         Object.entries(utmParams).filter(([, v]) => v !== undefined)
       );
       
       localStorage.setItem('utm_params', JSON.stringify(cleanParams));
       console.log('📊 UTM params captured:', cleanParams);
     }
   }, []);
 }