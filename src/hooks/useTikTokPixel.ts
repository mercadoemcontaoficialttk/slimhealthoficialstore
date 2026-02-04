// TikTok Pixel Hook
const PIXEL_ID = 'D4H50QRC77UA1JCPR9M0';

declare global {
  interface Window {
    ttq: {
      load: (pixelId: string) => void;
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
      instances: unknown[];
      _i: unknown[];
      _t?: Record<string, unknown>;
    };
    TiktokAnalyticsObject?: string;
  }
}

// Initialize TikTok Pixel
export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;
  
  // Avoid duplicate initialization
  if (window.ttq?.load) return;

  // TikTok Pixel base code - simplified version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const d = document;
  const t = 'ttq';

  w.TiktokAnalyticsObject = t;
  const ttq = w[t] = w[t] || [];
  ttq._i = ttq._i || [];
  
  ttq.load = function(pixelId: string) {
    const p = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    ttq._i.push([pixelId]);
    ttq._t = ttq._t || {};
    ttq._t[pixelId] = { _u: p };
    
    const s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = p + '?sdkid=' + pixelId + '&lib=' + t;
    const first = d.getElementsByTagName('script')[0];
    first?.parentNode?.insertBefore(s, first);
  };
  
  ttq.page = function() {
    ttq.track('Pageview');
  };
  
  ttq.track = ttq.track || function() {};
  ttq.identify = ttq.identify || function() {};
  ttq.instances = ttq.instances || [];

  w.ttq.load(PIXEL_ID);
  w.ttq.page();
  
  console.log('TikTok Pixel initialized:', PIXEL_ID);
};

// Track InitiateCheckout event
export const trackInitiateCheckout = (value?: number, currency = 'BRL') => {
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('TikTok Pixel not initialized');
    return;
  }
  
  window.ttq.track('InitiateCheckout', {
    value: value,
    currency: currency,
  });
  
  console.log('TikTok Pixel: InitiateCheckout tracked', { value, currency });
};

// Track CompletePayment (Purchase) event
export const trackPurchase = (value: number, currency = 'BRL', orderId?: string) => {
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('TikTok Pixel not initialized');
    return;
  }
  
  window.ttq.track('CompletePayment', {
    value: value,
    currency: currency,
    content_type: 'product',
    order_id: orderId,
  });
  
  console.log('TikTok Pixel: CompletePayment tracked', { value, currency, orderId });
};

// Track ViewContent event
export const trackViewContent = (contentId?: string, contentName?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('TikTok Pixel not initialized');
    return;
  }
  
  window.ttq.track('ViewContent', {
    content_id: contentId,
    content_name: contentName,
    value: value,
    currency: 'BRL',
  });
  
  console.log('TikTok Pixel: ViewContent tracked', { contentId, contentName, value });
};

// Track AddToCart event
export const trackAddToCart = (contentId?: string, contentName?: string, value?: number, quantity?: number) => {
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('TikTok Pixel not initialized');
    return;
  }
  
  window.ttq.track('AddToCart', {
    content_id: contentId,
    content_name: contentName,
    value: value,
    currency: 'BRL',
    quantity: quantity || 1,
  });
  
  console.log('TikTok Pixel: AddToCart tracked', { contentId, contentName, value, quantity });
};

// Track custom events
export const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.ttq?.track) {
    console.warn('TikTok Pixel not initialized');
    return;
  }
  
  window.ttq.track(eventName, params);
  
  console.log('TikTok Pixel: Custom event tracked', { eventName, params });
};
