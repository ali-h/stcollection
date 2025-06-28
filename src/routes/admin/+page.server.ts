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
  // Get dashboard statistics
  const [productsResult, ordersResult, recentOrdersResult] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('orders').select('*'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const products = productsResult.data || [];
  const orders = ordersResult.data || [];
  const recentOrders = recentOrdersResult.data || [];

  // Calculate statistics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const orderTotal = items.reduce((orderSum: number, item: any) => 
      orderSum + (item.price * item.quantity), 0
    );
    return sum + orderTotal + (order.shipping_cost || 0);
  }, 0);

  return {
    stats: {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue
    },
    recentOrders
  };
};
