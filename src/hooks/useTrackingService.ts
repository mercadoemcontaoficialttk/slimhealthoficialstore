 import { useEffect, useCallback } from 'react';
 
 // ============================================
 // TRACKING SERVICE - 100% RELIABLE UTM TRACKING
 // ============================================
 
 // Storage keys
 const UTM_STORAGE_KEY = 'slimhealth_utm_params';
 const TRACKING_ID_KEY = 'slimhealth_tracking_id';
 const UTM_COOKIE_NAME = 'slimhealth_utm';
 const TRACKING_COOKIE_NAME = 'slimhealth_tid';
 
 // UTM parameter interface
 export interface TrackingParams {
   utm_source: string | null;
   utm_medium: string | null;
   utm_campaign: string | null;
   utm_content: string | null;
   utm_term: string | null;
   gclid: string | null;
   fbclid: string | null;
   src: string | null;
   sck: string | null;
 }
 
 export interface FullTrackingData extends TrackingParams {
   tracking_id: string;
   page_path: string;
 }
 
 // ============================================
 // COOKIE HELPERS
 // ============================================
 
 function setCookie(name: string, value: string, days = 30): void {
   try {
     const expires = new Date();
     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
     document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
   } catch (e) {
     console.warn('Failed to set cookie:', e);
   }
 }
 
 function getCookie(name: string): string | null {
   try {
     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
     return match ? decodeURIComponent(match[2]) : null;
   } catch (e) {
     console.warn('Failed to get cookie:', e);
     return null;
   }
 }
 
 // ============================================
 // UUID GENERATOR
 // ============================================
 
 function generateUUID(): string {
   if (typeof crypto !== 'undefined' && crypto.randomUUID) {
     return crypto.randomUUID();
   }
   // Fallback for older browsers
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     const r = Math.random() * 16 | 0;
     const v = c === 'x' ? r : (r & 0x3 | 0x8);
     return v.toString(16);
   });
 }
 
 // ============================================
 // TRACKING ID MANAGEMENT
 // ============================================
 
 function getOrCreateTrackingId(): string {
   // Try localStorage first
   let trackingId = localStorage.getItem(TRACKING_ID_KEY);
   
   // Fallback to cookie if not in localStorage
   if (!trackingId) {
     trackingId = getCookie(TRACKING_COOKIE_NAME);
   }
   
   // Create new if doesn't exist
   if (!trackingId) {
     trackingId = generateUUID();
     console.log('🆔 New tracking_id created:', trackingId);
   }
   
   // Save to both localStorage and cookie for redundancy
   try {
     localStorage.setItem(TRACKING_ID_KEY, trackingId);
   } catch (e) {
     console.warn('Failed to save tracking_id to localStorage:', e);
   }
   setCookie(TRACKING_COOKIE_NAME, trackingId, 30);
   
   return trackingId;
 }
 
 // ============================================
 // UTM PARAMETER MANAGEMENT
 // ============================================
 
 function getEmptyTrackingParams(): TrackingParams {
   return {
     utm_source: null,
     utm_medium: null,
     utm_campaign: null,
     utm_content: null,
     utm_term: null,
     gclid: null,
     fbclid: null,
     src: null,
     sck: null,
   };
 }
 
 function extractUtmFromUrl(): TrackingParams {
   const params = getEmptyTrackingParams();
   
   if (typeof window === 'undefined') return params;
   
   const urlParams = new URLSearchParams(window.location.search);
   
   // Extract all UTM and tracking params
   const utm_source = urlParams.get('utm_source');
   const utm_medium = urlParams.get('utm_medium');
   const utm_campaign = urlParams.get('utm_campaign');
   const utm_content = urlParams.get('utm_content');
   const utm_term = urlParams.get('utm_term');
   const gclid = urlParams.get('gclid');
   const fbclid = urlParams.get('fbclid');
   const src = urlParams.get('src');
   const sck = urlParams.get('sck');
   
   if (utm_source) params.utm_source = utm_source;
   if (utm_medium) params.utm_medium = utm_medium;
   if (utm_campaign) params.utm_campaign = utm_campaign;
   if (utm_content) params.utm_content = utm_content;
   if (utm_term) params.utm_term = utm_term;
   if (gclid) params.gclid = gclid;
   if (fbclid) params.fbclid = fbclid;
   if (src) params.src = src;
   if (sck) params.sck = sck;
   
   return params;
 }
 
 function getStoredUtmParams(): TrackingParams {
   let params = getEmptyTrackingParams();
   
   // Try localStorage first
   try {
     const stored = localStorage.getItem(UTM_STORAGE_KEY);
     if (stored) {
       const parsed = JSON.parse(stored);
       params = { ...params, ...parsed };
     }
   } catch (e) {
     console.warn('Failed to read UTM from localStorage:', e);
   }
   
   // Fallback to cookie if localStorage is empty
   if (!Object.values(params).some(v => v !== null)) {
     try {
       const cookieData = getCookie(UTM_COOKIE_NAME);
       if (cookieData) {
         const parsed = JSON.parse(cookieData);
         params = { ...params, ...parsed };
       }
     } catch (e) {
       console.warn('Failed to read UTM from cookie:', e);
     }
   }
   
   return params;
 }
 
 function saveUtmParams(params: TrackingParams): void {
   // Only save if there's at least one param
   const hasParams = Object.values(params).some(v => v !== null);
   if (!hasParams) return;
   
   // Clean null values for storage
   const cleanParams = Object.fromEntries(
     Object.entries(params).filter(([, v]) => v !== null)
   );
   
   const jsonData = JSON.stringify(cleanParams);
   
   // Save to localStorage
   try {
     localStorage.setItem(UTM_STORAGE_KEY, jsonData);
   } catch (e) {
     console.warn('Failed to save UTM to localStorage:', e);
   }
   
   // Save to cookie as backup
   setCookie(UTM_COOKIE_NAME, jsonData, 30);
   
   console.log('📊 UTM params saved:', cleanParams);
 }
 
 // ============================================
 // MAIN CAPTURE AND MERGE FUNCTION
 // ============================================
 
 /**
  * Captures UTM params from URL and merges with stored params.
  * URL params take precedence over stored params.
  * Also ensures tracking_id exists.
  */
 export function captureAndPersistTracking(): FullTrackingData {
   // Get or create tracking ID
   const tracking_id = getOrCreateTrackingId();
   
   // Get current page path
   const page_path = typeof window !== 'undefined' ? window.location.pathname : '/';
   
   // Get URL params (highest priority)
   const urlParams = extractUtmFromUrl();
   
   // Get stored params (fallback)
   const storedParams = getStoredUtmParams();
   
   // Merge: URL params override stored params
   const mergedParams: TrackingParams = {
     utm_source: urlParams.utm_source || storedParams.utm_source,
     utm_medium: urlParams.utm_medium || storedParams.utm_medium,
     utm_campaign: urlParams.utm_campaign || storedParams.utm_campaign,
     utm_content: urlParams.utm_content || storedParams.utm_content,
     utm_term: urlParams.utm_term || storedParams.utm_term,
     gclid: urlParams.gclid || storedParams.gclid,
     fbclid: urlParams.fbclid || storedParams.fbclid,
     src: urlParams.src || storedParams.src,
     sck: urlParams.sck || storedParams.sck,
   };
   
   // Check if we have new params from URL to save
   const hasNewUrlParams = Object.values(urlParams).some(v => v !== null);
   if (hasNewUrlParams) {
     saveUtmParams(mergedParams);
   }
   
   return {
     ...mergedParams,
     tracking_id,
     page_path,
   };
 }
 
 /**
  * Get current tracking data without capturing from URL.
  * Use this when you need to read tracking data but not capture from URL.
  */
 export function getTrackingData(): FullTrackingData {
   const tracking_id = getOrCreateTrackingId();
   const page_path = typeof window !== 'undefined' ? window.location.pathname : '/';
   const storedParams = getStoredUtmParams();
   
   return {
     ...storedParams,
     tracking_id,
     page_path,
   };
 }
 
 /**
  * Get tracking data for API calls (cleaned format for backend).
  * Converts null to undefined for cleaner API payloads.
  */
 export function getTrackingDataForApi(): {
   tracking_id: string;
   page_path: string;
   utm_source?: string;
   utm_medium?: string;
   utm_campaign?: string;
   utm_content?: string;
   utm_term?: string;
   gclid?: string;
   fbclid?: string;
   src?: string;
   sck?: string;
 } {
   const data = getTrackingData();
   
   return {
     tracking_id: data.tracking_id,
     page_path: data.page_path,
     ...(data.utm_source && { utm_source: data.utm_source }),
     ...(data.utm_medium && { utm_medium: data.utm_medium }),
     ...(data.utm_campaign && { utm_campaign: data.utm_campaign }),
     ...(data.utm_content && { utm_content: data.utm_content }),
     ...(data.utm_term && { utm_term: data.utm_term }),
     ...(data.gclid && { gclid: data.gclid }),
     ...(data.fbclid && { fbclid: data.fbclid }),
     ...(data.src && { src: data.src }),
     ...(data.sck && { sck: data.sck }),
   };
 }
 
 // ============================================
 // REACT HOOK
 // ============================================
 
 /**
  * React hook for tracking service.
  * Captures UTM params on mount and provides tracking data getter.
  */
 export function useTrackingService() {
   // Capture tracking on mount
   useEffect(() => {
     const data = captureAndPersistTracking();
     console.log('🔍 Tracking Service initialized:', {
       tracking_id: data.tracking_id,
       page_path: data.page_path,
       utm_source: data.utm_source,
       utm_campaign: data.utm_campaign,
     });
   }, []);
   
   // Provide stable getter function
   const getTracking = useCallback(() => getTrackingData(), []);
   const getTrackingForApi = useCallback(() => getTrackingDataForApi(), []);
   
   return {
     getTracking,
     getTrackingForApi,
   };
 }
 
 // Export for direct usage without React
 export const TrackingService = {
   captureAndPersist: captureAndPersistTracking,
   getData: getTrackingData,
   getDataForApi: getTrackingDataForApi,
   getTrackingId: getOrCreateTrackingId,
 };