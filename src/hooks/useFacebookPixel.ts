// Facebook Pixel Hook
const PIXEL_ID = 'D4H50QRC77UA1JCPR9M0';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window === 'undefined') return;
  
  // Avoid duplicate initialization
  if (window.fbq) return;

  const f = window;
  const b = document;
  const e = 'script';
  
  const n = function() {
    // eslint-disable-next-line prefer-rest-params
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  } as unknown as typeof window.fbq & { 
    callMethod?: (...args: unknown[]) => void; 
    queue: unknown[]; 
    loaded: boolean; 
    version: string; 
    push: (...args: unknown[]) => void;
  };
  
  if (!f.fbq) f.fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  
  const t = b.createElement(e) as HTMLScriptElement;
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  const s = b.getElementsByTagName(e)[0];
  s?.parentNode?.insertBefore(t, s);

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
  
  console.log('Facebook Pixel initialized:', PIXEL_ID);
};

// Track InitiateCheckout event
export const trackInitiateCheckout = (value?: number, currency = 'BRL') => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }
  
  window.fbq('track', 'InitiateCheckout', {
    value: value,
    currency: currency,
  });
  
  console.log('Facebook Pixel: InitiateCheckout tracked', { value, currency });
};

// Track Purchase event
export const trackPurchase = (value: number, currency = 'BRL', orderId?: string) => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }
  
  window.fbq('track', 'Purchase', {
    value: value,
    currency: currency,
    content_type: 'product',
    order_id: orderId,
  });
  
  console.log('Facebook Pixel: Purchase tracked', { value, currency, orderId });
};

// Track custom events
export const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }
  
  window.fbq('trackCustom', eventName, params);
  
  console.log('Facebook Pixel: Custom event tracked', { eventName, params });
};
