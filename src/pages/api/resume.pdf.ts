import type { APIRoute } from 'astro';
import { getConfig } from '../../data/config';

export const GET: APIRoute = async () => {
  try {
    const config = await getConfig();
    const resumeUrl = config.resumeUrl;

    if (!resumeUrl || !resumeUrl.startsWith('http')) {
      return new Response('Resume URL not found or is local', { status: 404 });
    }

    // Handle Google Drive links to ensure they are direct download links
    let finalUrl = resumeUrl;
    if (resumeUrl.includes('drive.google.com')) {
      const docIdMatch = resumeUrl.match(/\/d\/([a-zA-Z0-9-_]+)/) || resumeUrl.match(/id=([a-zA-Z0-9-_]+)/);
      if (docIdMatch && docIdMatch[1]) {
        finalUrl = `https://drive.google.com/uc?export=download&id=${docIdMatch[1]}`;
      }
    }

    const response = await fetch(finalUrl);
    console.log(`Proxy fetching: ${finalUrl}, Status: ${response.status}`);
    
    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      return new Response(`Failed to fetch resume: ${response.statusText}`, { status: response.status });
    }

    if (contentType && contentType.includes('text/html')) {
      return new Response('Error: Received HTML instead of PDF. Ensure your Google Drive file is set to "Anyone with the link can view".', { status: 403 });
    }

    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Disposition': 'inline; filename="resume.pdf"'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
