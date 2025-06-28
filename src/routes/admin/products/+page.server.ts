import { createClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const load: PageServerLoad = async () => {
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      variants:variants(*)
    `)
    .order('created_at', { ascending: false });

  return {
    products: products || []
  };
};
