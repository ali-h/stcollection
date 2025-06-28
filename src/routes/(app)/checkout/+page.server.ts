import { error, fail, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

// Get environment variables
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseServiceKey = PRIVATE_SUPABASE_SERVICE_KEY;

// Type for cart items
interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

// Initialize Supabase with service key
const getServiceClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw error(500, 'Missing Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const actions: Actions = {
  placeOrder: async ({ request, cookies }) => {
    const formData = await request.formData();
    
    // Extract customer information
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const addressLine1 = formData.get('addressLine1') as string;
    const addressLine2 = formData.get('addressLine2') as string || null;
    const city = formData.get('city') as string;
    const postalCode = formData.get('postalCode') as string;
    const province = formData.get('province') as string;
    const country = formData.get('country') as string;
    const notes = formData.get('notes') as string || null;
    
    // Extract cart items
    let cartItems: CartItem[];
    try {
      const cartItemsJson = formData.get('cartItems') as string;
      cartItems = JSON.parse(cartItemsJson);
      
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return fail(400, { 
          error: true, 
          message: 'No items in cart' 
        });
      }
    } catch (e) {
      console.error('Error parsing cart items:', e);
      return fail(400, { 
        error: true, 
        message: 'Invalid cart data' 
      });
    }
    
    // Format order items for database storage
    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));
    
    try {
      // Create Supabase client with service key for admin privileges
      const supabase = getServiceClient();
      
      // Create the order in the database
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert({
          full_name: fullName,
          email: email,
          phone: phone,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city: city,
          postal_code: postalCode,
          province: province,
          country: country,
          items: orderItems,
          notes: notes,
          shipping_cost: 100 // Rs 100 for shipping
        })
        .select('id')
        .single();
      
      if (orderError) {
        console.error('Error creating order:', orderError);
        return fail(500, { 
          error: true, 
          message: 'Failed to create order' 
        });
      }
      
      // Format order data for the success page
      const orderData = {
        id: data.id,
        orderIdShort: data.id.substring(data.id.length - 8),
        fullName: fullName,
        email: email,
        phone: phone,
        items: orderItems,
        subtotal: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingCost: 100,
        total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 100,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        province: province,
        postalCode: postalCode,
        country: country
      };
      
      // Return success with order data
      return {
        success: true,
        orderData: orderData
      };
      
    } catch (err) {
      console.error('Server error:', err);
      return fail(500, { 
        error: true, 
        message: 'An unexpected error occurred' 
      });
    }
  }
};
