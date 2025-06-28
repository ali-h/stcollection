import { error, json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw error(400, 'Product ID is required');
  }

  try {
    // Delete the product (variants will be deleted automatically due to cascade)
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw error(500, deleteError.message);
    }

    return json({ success: true });
  } catch (err) {
    throw error(500, 'Failed to delete product');
  }
};
