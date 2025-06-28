<script lang="ts">
  let { data } = $props();

  function formatCurrency(amount: number): string {
    return `Rs. ${amount.toFixed(0)}`;
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

  function getTotalStock(variants: any[]): number {
    return variants.reduce((total, variant) => total + variant.stock, 0);
  }

  function getUniqueColors(variants: any[]): string[] {
    const colors = variants.map(v => v.color);
    return [...new Set(colors)];
  }

  function getUniqueColorVariants(variants: any[]): any[] {
    const uniqueColors = new Set<string>();
    const uniqueVariants: any[] = [];
    
    for (const variant of variants) {
      if (!uniqueColors.has(variant.color)) {
        uniqueColors.add(variant.color);
        uniqueVariants.push(variant);
      }
    }
    
    return uniqueVariants;
  }

  // Track expanded products
  let expandedProducts = $state(new Set<string>());

  function toggleProductExpansion(productId: string) {
    if (expandedProducts.has(productId)) {
      expandedProducts.delete(productId);
    } else {
      expandedProducts.add(productId);
    }
    expandedProducts = new Set(expandedProducts);
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product? This will also delete all its variants.')) {
      return;
    }

    try {
      const response = await fetch(`/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    }
  }

  function handleProductKeydown(event: KeyboardEvent, productId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleProductExpansion(productId);
    }
  }
</script>

<svelte:head>
  <title>Manage Products - ST Collection Admin</title>
</svelte:head>

<div class="products-page">
  <div class="page-header">
    <h1 class="page-title">Manage Products</h1>
    <a href="/admin/products/new" class="btn-primary">Add New Product</a>
  </div>

  {#if data.products.length > 0}
    <div class="products-table">
      <div class="table-header">
        <div class="header-cell">Product</div>
        <div class="header-cell">Price</div>
        <div class="header-cell">Stock</div>
        <div class="header-cell">Colors</div>
        <div class="header-cell">Variants</div>
        <div class="header-cell">Actions</div>
      </div>

      {#each data.products as product}
        <div class="product-row" class:expanded={expandedProducts.has(product.id)}>
          <div 
            class="product-main-row" 
            onclick={() => toggleProductExpansion(product.id)}
            onkeydown={(e) => handleProductKeydown(e, product.id)}
            role="button"
            tabindex="0"
            aria-expanded={expandedProducts.has(product.id)}
            aria-label="Toggle product details for {product.name}"
          >
            <div class="cell product-cell">
              <div class="product-basic-info">
                <h3 class="product-name">{product.name}</h3>
                <p class="product-description">{product.description}</p>
                
                <!-- Mobile-only stats -->
                <div class="mobile-info">
                  <div class="mobile-stat">
                    <span class="mobile-stat-label">Price</span>
                    <span class="mobile-stat-value">{formatCurrency(product.price)}</span>
                  </div>
                  <div class="mobile-stat">
                    <span class="mobile-stat-label">Stock</span>
                    <span class="mobile-stat-value" class:low-stock={getTotalStock(product.variants) < 10}>
                      {getTotalStock(product.variants)}
                    </span>
                  </div>
                  <div class="mobile-stat">
                    <span class="mobile-stat-label">Variants</span>
                    <span class="mobile-stat-value">{product.variants.length}</span>
                  </div>
                  <div class="mobile-stat">
                    <span class="mobile-stat-label">Colors</span>
                    <div class="color-dots">
                      {#each getUniqueColorVariants(product.variants) as variant}
                        <span 
                          class="color-dot" 
                          style="background-color: {normalizeColor(variant.color)};" 
                          title="{variant.color}"
                        ></span>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="cell price-cell">
              <span class="product-price">{formatCurrency(product.price)}</span>
            </div>
            
            <div class="cell stock-cell">
              <span class="total-stock" class:low-stock={getTotalStock(product.variants) < 10}>
                {getTotalStock(product.variants)}
              </span>
            </div>
            
            <div class="cell colors-cell">
              <div class="color-dots">
                {#each getUniqueColorVariants(product.variants) as variant}
                  <span 
                    class="color-dot" 
                    style="background-color: {normalizeColor(variant.color)};" 
                    title="{variant.color}"
                  ></span>
                {/each}
              </div>
            </div>
            
            <div class="cell variants-cell">
              <span class="variant-count">{product.variants.length}</span>
            </div>
            
            <div class="cell actions-cell">
              <div class="product-actions">
                <a href="/admin/products/{product.id}" class="btn-edit">Edit</a>
                <button class="btn-delete" onclick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}>
                  Delete
                </button>
              </div>
            </div>
            
            <div class="expand-icon">
              {expandedProducts.has(product.id) ? '▼' : '▶'}
            </div>
          </div>

          {#if expandedProducts.has(product.id)}
            <div class="variants-expanded">
              <div class="variants-header">
                <h4>Product Variants</h4>
              </div>
              <div class="variants-table">
                <div class="variant-header-row">
                  <span>Color</span>
                  <span>Size</span>
                  <span>Stock</span>
                  <span>Images</span>
                </div>
                {#each product.variants as variant}
                  <div class="variant-row">
                    <span class="variant-color">
                      <span 
                        class="color-dot-small" 
                        style="background-color: {normalizeColor(variant.color)};"
                      ></span>
                      {variant.color}
                    </span>
                    <span class="variant-size">{variant.size}</span>
                    <span class="variant-stock" class:low-stock={variant.stock < 5}>
                      {variant.stock}
                    </span>
                    <span class="variant-images">{variant.images?.length || 0} image(s)</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">📦</div>
      <h2>No products yet</h2>
      <p>Start by adding your first product to the store.</p>
      <a href="/admin/products/new" class="btn-primary">Add First Product</a>
    </div>
  {/if}
</div>

<style>
  .products-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .btn-primary {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
  }

  .products-table {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1.5fr 1fr 1.5fr;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    font-weight: 600;
  }

  .header-cell {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .product-row {
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s ease;
  }

  .product-row:hover {
    background: #f8f9fa;
  }

  .product-row.expanded {
    background: #f8f9fa;
  }

  .product-main-row {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1.5fr 1fr 1.5fr auto;
    gap: 1rem;
    padding: 1.5rem 2rem;
    align-items: center;
    cursor: pointer;
    position: relative;
    outline: none;
    transition: all 0.3s ease;
  }

  /* .product-main-row:focus {
    outline: 2px solid #ffc107;
    outline-offset: -2px;
  }

  .product-main-row:focus-visible {
    outline: 2px solid #ffc107;
    outline-offset: -2px;
  } */

  .cell {
    display: flex;
    align-items: center;
  }

  .product-basic-info {
    flex: 1;
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.25rem 0;
  }

  .product-description {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffc107;
  }

  .total-stock {
    font-weight: 600;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    background: #e8f5e8;
  }

  .total-stock.low-stock {
    background: #ffeaa7;
    color: #d63031;
  }

  .color-dots {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
  }

  .color-dot:hover {
    transform: scale(1.2);
    z-index: 10;
  }

  .color-dot:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 20;
  }

  .variant-count {
    font-weight: 600;
    color: #333;
    background: #e3f2fd;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
  }

  .product-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-edit {
    background: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-edit:hover {
    background: #218838;
    transform: translateY(-1px);
  }

  .btn-delete {
    background: #dc3545;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: none;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-delete:hover {
    background: #c82333;
    transform: translateY(-1px);
  }

  .expand-icon {
    color: #666;
    font-size: 1rem;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .product-row.expanded .expand-icon {
    transform: rotate(0deg);
  }

  .variants-expanded {
    padding: 0 2rem 1.5rem 2rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }

  .variants-header {
    margin-bottom: 1rem;
  }

  .variants-header h4 {
    color: #333;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .variants-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e9ecef;
  }

  .variant-header-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #e9ecef;
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  .variant-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    font-size: 0.9rem;
  }

  .variant-row:last-child {
    border-bottom: none;
  }

  .variant-row:hover {
    background: #f8f9fa;
  }

  .variant-color {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .color-dot-small {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .variant-stock {
    font-weight: 500;
  }

  .variant-stock.low-stock {
    color: #dc3545;
    font-weight: 600;
  }

  .mobile-info {
    display: none;
  }

  @media (max-width: 768px) {
    .mobile-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    .mobile-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
    }

    .mobile-stat-label {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
    }

    .mobile-stat-value {
      font-weight: 600;
      color: #333;
    }

    .mobile-stat-value.low-stock {
      color: #dc3545;
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .table-header {
      display: none;
    }

    .product-main-row {
      grid-template-columns: 1fr auto;
      gap: 1rem;
    }

    .cell:not(.product-cell) {
      display: none;
    }

    .product-cell {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .product-actions {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .variant-header-row {
      display: none;
    }

    .variant-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      background: white;
    }

    .variant-row .variant-color,
    .variant-row .variant-size,
    .variant-row .variant-stock,
    .variant-row .variant-images {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }

    .variant-row .variant-color::before {
      content: "Color: ";
      font-weight: 600;
      color: #666;
    }

    .variant-row .variant-size::before {
      content: "Size: ";
      font-weight: 600;
      color: #666;
    }

    .variant-row .variant-stock::before {
      content: "Stock: ";
      font-weight: 600;
      color: #666;
    }

    .variant-row .variant-images::before {
      content: "Images: ";
      font-weight: 600;
      color: #666;
    }
  }
</style>
