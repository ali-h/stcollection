<script lang="ts">
  import Animate from '$lib/components/Animate.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let products = data.products;

  // Define TypeScript interfaces for our data
  interface Variant {
    id: string;
    product_id: string;
    size: string;
    color: string;
    stock: number;
    images: string[];
  }

  interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    created_at: string;
    firstVariant: Variant | null;
    allVariants: Variant[];
  }

  // Helper function to get unique variants by color
  function getUniqueColorVariants(variants: Variant[]): Variant[] {
    const uniqueColors = new Set<string>();
    const uniqueVariants: Variant[] = [];
    
    for (const variant of variants) {
      if (!uniqueColors.has(variant.color)) {
        uniqueColors.add(variant.color);
        uniqueVariants.push(variant);
      }
    }
    
    return uniqueVariants;
  }

  // Comprehensive color map with hex values for all our product colors
  const colorMap: Record<string, string> = {
    // Browns
    'lightbrown': '#D2B48C',
    'brown': '#A52A2A',
    'darkbrown': '#5D4037',
    
    // Blues
    'blue': '#0000FF',
    'darkblue': '#00008B',
    'navyblue': '#000080',
    
    // Blacks and Whites
    'black': '#000000',
    'white': '#FFFFFF',
    
    // Reds
    'red': '#FF0000',
    'maroon': '#800000',
    
    // Greens
    'lightgreen': '#90EE90',
    
    // Grays
    'lightgray': '#D3D3D3',
    
    // Purples
    'purple': '#800080',
    
    // Yellows
    'yellow': '#FFFF00'
  };

  // Helper function to ensure color is valid CSS
  function normalizeColor(color: string): string {
    // If the color already starts with # or rgb, return as is
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }

    // Remove spaces and convert to lowercase for consistent mapping
    const normalizedColor = color.replace(/\s+/g, '').toLowerCase();
    
    // Return the mapped color if available, otherwise fallback to a default color
    return colorMap[normalizedColor] || '#CCCCCC'; // Fallback to light gray if color not found
  }
</script>

<svelte:head>
  <title>All Products | ST Collection</title>
  <meta name="description" content="Browse our complete collection of products" />
</svelte:head>

<section class="products-page">
  <div class="products-container">
    <Animate animation="slide-up">
      <h1 class="page-title">All Products</h1>
      <p class="page-subtitle">Browse our complete collection</p>
    </Animate>
    
    <div class="products-grid">
      {#each products as product, index}
        <Animate animation="fade" delay={100 * Math.min(index + 1, 10)}>
          <div class="product-card">
            <div class="product-image">
              <!-- Use first variant image if available, otherwise fallback to product image -->
              <a href={`/products/${product.id}`}>
                <img 
                  src={product.firstVariant?.images?.[0] || product.images?.[0] || "https://placehold.co/400x500/FFC107/ffffff?text=Product"} 
                  alt={product.name}
                >
                <div class="product-overlay">
                  <button class="view-product">View</button>
                </div>
              </a>
            </div>
            <div class="product-info">
              <h3>{product.name}</h3>
              <p class="product-price">Rs. {product.price.toFixed(2)}</p>
              {#if product.allVariants && product.allVariants.length > 0}
                <div class="product-colors">
                  {#each getUniqueColorVariants(product.allVariants) as variant}
                    <span 
                      class="color-dot" 
                      style="background-color: {normalizeColor(variant.color)};" 
                      title="{variant.color}"
                    ></span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </Animate>
      {/each}
    </div>
  </div>
</section>

<style>
  .products-page {
    padding: 6rem 2rem;
    background: linear-gradient(135deg, #fff9e6, #fffdf2);
    min-height: 80vh;
  }
  
  .products-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #333;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .page-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(45deg, #ffc107, #ff9800);
  }
  
  .page-subtitle {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 3rem;
    color: #666;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2.5rem;
    margin-bottom: 3rem;
  }
  
  .product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    transform: translateY(0);
  }
  
  .product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    position: relative;
    overflow: hidden;
    height: 300px;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .product-card:hover .product-image img {
    transform: scale(1.05);
  }
  
  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .product-card:hover .product-overlay {
    opacity: 1;
  }
  
  .view-product {
    padding: 0.8rem 1.5rem;
    background: white;
    color: #333;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateY(20px);
    opacity: 0;
  }
  
  .product-card:hover .view-product {
    transform: translateY(0);
    opacity: 1;
  }
  
  .view-product:hover {
    background: #ffc107;
    color: white;
  }
  
  .product-info {
    padding: 1.5rem;
  }
  
  .product-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  .product-price {
    color: #ffc107;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }
  
  .product-colors {
    display: flex;
    gap: 5px;
  }
  
  .color-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-block;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-right: 6px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .color-dot:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  }
  
  .color-dot:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    z-index: 10;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .product-image {
      height: 250px;
    }
  }
</style>
