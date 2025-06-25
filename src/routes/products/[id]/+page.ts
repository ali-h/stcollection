import type { PageLoad } from "./$types";
import { createClient } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const load: PageLoad = async ({ params }) => {
  const productId = params.id;
  
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  // Get the specific product with all its variants joined
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      *,
      variants:variants(*)
    `)
    .eq("id", productId)
    .single();

  if (productError || !product) {
    throw error(404, {
      message: "Product not found"
    });
  }

  // Process the result to keep all variants but also identify the first one for easy access
  const allVariants = Array.isArray(product.variants) ? product.variants : [];
  const firstVariant = allVariants.length > 0 ? allVariants[0] : null;
  
  const processedProduct = {
    ...product,
    firstVariant,
    allVariants
  };

  return {
    product: processedProduct
  };
}
