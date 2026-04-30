import type { APIRoute } from 'astro';
import { updateRemoteConfig } from '../../../lib/supabase';
import { ConfigSchema } from '../../../data/schema';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const content = await request.json();
    const validated = ConfigSchema.safeParse(content);

    if (!validated.success) {
      return new Response(JSON.stringify({ error: validated.error }), { status: 400 });
    }

    const { error } = await updateRemoteConfig(validated.data);
    if (error) {
      const message = typeof error === 'string' ? error : (error as any).message;
      return new Response(JSON.stringify({ error: message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }
};
