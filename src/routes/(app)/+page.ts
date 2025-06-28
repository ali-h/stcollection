import type { PageLoad } from './$types';
import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const load: PageLoad = async () => {
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  // Get products with all their variants joined
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      variants:variants(*)
    `)
    .limit(4);

  // Process the results to keep all variants but also identify the first one for easy access
  const processedProducts = products?.map(product => {
    const allVariants = Array.isArray(product.variants) ? product.variants : [];
    const firstVariant = allVariants.length > 0 ? allVariants[0] : null;
    
    return {
      ...product,
      firstVariant,
      allVariants
    };
  }) || [];

  return {
    products: processedProducts
  };
}
