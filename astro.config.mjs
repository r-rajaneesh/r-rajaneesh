import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret' }),
      SUPABASE_KEY: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret' }),
    }
  }
});
