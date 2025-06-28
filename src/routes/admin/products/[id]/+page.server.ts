import { error, fail, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      variants:variants(*)
    `)
    .eq('id', id)
    .single();

  if (!product) {
    throw error(404, 'Product not found');
  }

  return {
    product
  };
};

export const actions: Actions = {
  updateProduct: async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);

    if (!name || !description || !price) {
      return fail(400, {
        error: 'All product fields are required',
        values: { name, description, price }
      });
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price
      })
      .eq('id', id);

    if (updateError) {
      return fail(500, {
        error: 'Failed to update product: ' + updateError.message,
        values: { name, description, price }
      });
    }

    return { success: true };
  },

  addVariant: async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    
    const size = formData.get('size') as string;
    const color = formData.get('color') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imagesJson = formData.get('images') as string;

    if (!size || !color || !stock || !imagesJson) {
      return fail(400, {
        error: 'All variant fields are required'
      });
    }

    try {
      const images = JSON.parse(imagesJson);
      if (!Array.isArray(images)) {
        throw new Error('Images must be an array');
      }

      const { error: insertError } = await supabase
        .from('variants')
        .insert({
          product_id: id,
          size,
          color,
          stock,
          images
        });

      if (insertError) {
        return fail(500, {
          error: 'Failed to add variant: ' + insertError.message
        });
      }

      return { success: true, action: 'addVariant' };
    } catch (error) {
      return fail(400, {
        error: 'Images must be a valid JSON array'
      });
    }
  },

  updateVariant: async ({ request }) => {
    const formData = await request.formData();
    
    const variantId = formData.get('variantId') as string;
    const size = formData.get('size') as string;
    const color = formData.get('color') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imagesJson = formData.get('images') as string;

    if (!variantId || !size || !color || !stock || !imagesJson) {
      return fail(400, {
        error: 'All variant fields are required'
      });
    }

    try {
      const images = JSON.parse(imagesJson);
      if (!Array.isArray(images)) {
        throw new Error('Images must be an array');
      }

      const { error: updateError } = await supabase
        .from('variants')
        .update({
          size,
          color,
          stock,
          images
        })
        .eq('id', variantId);

      if (updateError) {
        return fail(500, {
          error: 'Failed to update variant: ' + updateError.message
        });
      }

      return { success: true, action: 'updateVariant' };
    } catch (error) {
      return fail(400, {
        error: 'Images must be a valid JSON array'
      });
    }
  },

  deleteVariant: async ({ request }) => {
    const formData = await request.formData();
    const variantId = formData.get('variantId') as string;

    if (!variantId) {
      return fail(400, { error: 'Variant ID is required' });
    }

    const { error: deleteError } = await supabase
      .from('variants')
      .delete()
      .eq('id', variantId);

    if (deleteError) {
      return fail(500, {
        error: 'Failed to delete variant: ' + deleteError.message
      });
    }

    return { success: true, action: 'deleteVariant' };
  }
};
