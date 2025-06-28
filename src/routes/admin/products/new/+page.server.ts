import { fail, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { Actions } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const actions: Actions = {
  createProduct: async ({ request }) => {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    
    // Variant data
    const variantSize = formData.get('variantSize') as string;
    const variantColor = formData.get('variantColor') as string;
    const variantStockStr = formData.get('variantStock') as string;
    const variantImages = formData.get('variantImages') as string;

    // Parse and validate numeric values
    const price = parseFloat(priceStr);
    const variantStock = parseInt(variantStockStr);

    // Validation
    if (!name || !description || !priceStr || !variantSize || !variantColor || !variantStockStr || !variantImages) {
      return fail(400, {
        error: 'All fields are required'
      });
    }

    if (isNaN(price) || price < 0) {
      return fail(400, {
        error: 'Price must be a valid positive number'
      });
    }

    if (isNaN(variantStock) || variantStock < 0) {
      return fail(400, {
        error: 'Stock must be a valid non-negative number'
      });
    }

    // Parse images (expecting JSON array as string)
    let images: string[];
    try {
      images = JSON.parse(variantImages);
      if (!Array.isArray(images)) {
        throw new Error('Images must be an array');
      }
    } catch {
      return fail(400, {
        error: 'Images must be a valid JSON array of image URLs'
      });
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      return fail(500, {
        error: 'Failed to create product: ' + productError.message
      });
    }

    // Create variant
    const { error: variantError } = await supabase
      .from('variants')
      .insert({
        product_id: product.id,
        size: variantSize,
        color: variantColor,
        stock: variantStock,
        images
      });

    if (variantError) {
      console.error('Variant creation error:', variantError);
      // Rollback: delete the product
      await supabase.from('products').delete().eq('id', product.id);
      
      return fail(500, {
        error: 'Failed to create variant: ' + variantError.message
      });
    }

    // Success! Redirect to products page
    redirect(302, '/admin/products');
  }
};
