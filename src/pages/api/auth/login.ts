import type { APIRoute } from 'astro';
import { ADMIN_PASSWORD } from 'astro:env/server';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get('password');
  const adminPassword = ADMIN_PASSWORD;

  if (password === adminPassword) {
    // In a real app, use a proper session token. 
    // Here we use a simple proof-of-concept.
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return redirect('/admin');
  }

  return redirect('/admin/login?error=1');
};
