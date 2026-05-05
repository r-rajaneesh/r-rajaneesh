import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";
import { generatePoisonedResponse } from "./lib/poison";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  
  const headers = request.headers;
  
  // Get IP address (prioritize Vercel headers)
  const ip = headers.get('x-real-ip') || 
             headers.get('x-forwarded-for')?.split(',')[0] || 
             context.clientAddress;

  const userAgent = headers.get('user-agent') || '';
  const lowerUA = userAgent.toLowerCase();

  // Extract Vercel Geolocation headers
  const city = headers.get('x-vercel-ip-city');
  const region = headers.get('x-vercel-ip-country-region');
  const country = headers.get('x-vercel-ip-country');
  const latitude = headers.get('x-vercel-ip-latitude');
  const longitude = headers.get('x-vercel-ip-longitude');

  // Define bot detection patterns (excluding googlebot)
  const isGooglebot = lowerUA.includes('googlebot');
  const botPatterns = [
    'bot', 'spider', 'crawler', 'scraper', 
    'python', 'curl', 'wget', 'urllib', 'httpclient',
    'headless', 'phantomjs', 'selenium', 'puppeteer',
    'mixrankbot', 'ev-crawler'
  ];
  
  const isBot = botPatterns.some(pattern => lowerUA.includes(pattern));

  // Serve "poisoned" content to bots/scrapers except googlebot
  const isResumePath = url.pathname.toLowerCase().includes('resume');
  const isStatic = url.pathname.match(/\.(well-known|favicon|webp|png|jpg|jpeg|svg|css|js|pdf|txt)$/) && !isResumePath;
  const isApi = url.pathname.startsWith('/api/') && !isResumePath;
  
  // Special test route to view the bot defense content in a normal browser
  const isTestRoute = url.pathname === '/test-bot-defense';
  
  if (isBot && !isGooglebot && (!isStatic && !isApi) || isTestRoute) {
    console.log(`[Poisoning Bot${isTestRoute ? ' (TEST)' : ''}] UA: ${userAgent} | IP: ${ip} | Path: ${url.pathname}`);
    return generatePoisonedResponse();
  }

  // Skip static assets and other internal requests
  if (isStatic || isApi) {
    return next();
  }

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
