import { createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const load: PageServerLoad = async () => {
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    orders: orders || []
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;

    if (!orderId || !status) {
      return fail(400, { error: 'Order ID and status are required' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return fail(400, { error: 'Invalid status' });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      return fail(500, { error: 'Failed to update order status' });
    }

    return { success: true };
  }
};
