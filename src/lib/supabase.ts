import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_KEY } from 'astro:env/server';

const supabaseUrl = SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = SUPABASE_KEY || 'placeholder';

let supabase: any;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
  supabase = null;
}

export { supabase };

export async function getRemoteConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !supabase) return null;
  
  const { data, error } = await supabase
    .from('portfolio_config')
    .select('content')
    .single();

  if (error) {
    console.error('Supabase fetch error:', error.message, error.details);
    return null;
  }
  return data?.content;
}

export async function updateRemoteConfig(content: any) {
  if (!supabase) return { error: 'Supabase client not initialized' };
  
  const { error } = await supabase
    .from('portfolio_config')
    .upsert({ id: 1, content, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Supabase update error:', error.message, error.details);
  }

  return { error };
}
