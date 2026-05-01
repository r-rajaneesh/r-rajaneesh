import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  
  // Skip static assets and internal requests
  const isStatic = url.pathname.match(/\.(well-known|favicon|webp|png|jpg|jpeg|svg|css|js|pdf|txt)$/);
  const isApi = url.pathname.startsWith('/api/');
  
  if (isStatic || isApi) {
    return next();
  }

  const headers = request.headers;
  
  // Get IP address (prioritize Vercel headers)
  const ip = headers.get('x-real-ip') || 
             headers.get('x-forwarded-for')?.split(',')[0] || 
             context.clientAddress;

  // Extract Vercel Geolocation headers
  const city = headers.get('x-vercel-ip-city');
  const region = headers.get('x-vercel-ip-country-region');
  const country = headers.get('x-vercel-ip-country');
  const latitude = headers.get('x-vercel-ip-latitude');
  const longitude = headers.get('x-vercel-ip-longitude');
  const userAgent = headers.get('user-agent');

  // Log to Supabase in the background
  if (supabase) {
    supabase
      .from('visitor_logs')
      .insert([
        {
          ip_address: ip,
          city: city || 'Unknown',
          region: region || 'Unknown',
          country: country || 'Unknown',
          latitude: latitude || null,
          longitude: longitude || null,
          user_agent: userAgent,
          path: url.pathname,
        },
      ])
      .then(({ error }: { error: any }) => {
        if (error) {
          console.error('Error logging visitor to Supabase:', error.message);
        }
      })
      .catch((err: any) => {
        console.error('Failed to log visitor:', err);
      });
  }

  return next();
});
