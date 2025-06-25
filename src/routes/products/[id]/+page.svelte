<script lang="ts">
  import Animate from '$lib/components/Animate.svelte';
  import type { PageData } from './$types';
  import { cartActions } from '$lib/stores/cart';

  export let data: PageData;
  const product = data.product;

  // TypeScript interfaces
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
    price: number;
    created_at: string;
    firstVariant: Variant | null;
    allVariants: Variant[];
  }

  // State variables
  let selectedVariant = product.firstVariant;
  let selectedColor = selectedVariant?.color || '';
  let selectedSize = selectedVariant?.size || '';
  let currentImage = selectedVariant?.images?.[0] || product.images?.[0] || "https://placehold.co/600x800/FFC107/ffffff?text=Product";
  let imageIndex = 0;
  let quantity = 1;

  // Get unique colors from variants
  const uniqueColors = [...new Set(product.allVariants.map((v: Variant) => v.color))];
  
  // Get unique sizes from variants that match the selected color
  $: availableSizes = [...new Set(
    product.allVariants
      .filter((v: Variant) => v.color === selectedColor)
      .map((v: Variant) => v.size)
  )];

  // Update selected variant when color or size changes
  $: {
    const variant = product.allVariants.find(
      (v: Variant) => v.color === selectedColor && v.size === selectedSize
    );
    if (variant) {
      selectedVariant = variant;
      // Reset image index when variant changes, but keep the same color's images
      imageIndex = 0;
      updateCurrentImage();
    }
  }

  // Update available sizes when color changes
  function handleColorChange(color: string) {
    selectedColor = color;
    // Select the first available size for this color
    const firstSizeForColor = product.allVariants
      .filter((v: Variant) => v.color === color)
      .map((v: Variant) => v.size)[0];
    if (firstSizeForColor && firstSizeForColor !== selectedSize) {
      selectedSize = firstSizeForColor;
    }
  }

  // Helper function to normalize color for CSS display
  function normalizeColor(color: string): string {
    // Common color map
    const colorMap: Record<string, string> = {
      'lightbrown': '#D2B48C',
      'brown': '#A52A2A',
      'darkbrown': '#5D4037',
      'blue': '#0000FF',
      'darkblue': '#00008B',
      'navyblue': '#000080',
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'maroon': '#800000',
      'lightgreen': '#90EE90',
      'lightgray': '#D3D3D3',
      'purple': '#800080',
      'yellow': '#FFFF00'
    };

    // If the color already starts with # or rgb, return as is
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }

    // Remove spaces and convert to lowercase for consistent mapping
    const normalizedColor = color.replace(/\s+/g, '').toLowerCase();
    
    // Return the mapped color if available, otherwise fallback to a default color
    return colorMap[normalizedColor] || '#CCCCCC';
  }

  // Change image when navigating through the carousel
  function changeImage(direction: 'prev' | 'next') {
    const images = selectedVariant?.images || product.images || [];
    if (images.length === 0) return;

    if (direction === 'next') {
      imageIndex = (imageIndex + 1) % images.length;
    } else {
      imageIndex = (imageIndex - 1 + images.length) % images.length;
    }
    
    updateCurrentImage();
  }

  // Update current image based on selected variant and image index
  function updateCurrentImage() {
    const images = selectedVariant?.images || product.images || [];
    if (images.length > 0) {
      currentImage = images[imageIndex];
    } else {
      currentImage = "https://placehold.co/600x800/FFC107/ffffff?text=Product";
    }
  }

  // Handle quantity changes
  function decreaseQuantity() {
    if (quantity > 1) quantity--;
  }

  function increaseQuantity() {
    if (quantity < (selectedVariant?.stock || 10)) quantity++;
  }

  // Add to cart functionality
  function addToCart() {
    if (!selectedVariant) return;
    
    cartActions.addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: selectedVariant.images?.[0] || "https://placehold.co/400x500/FFC107/ffffff?text=Product"
    });
    
    // Show success message and checkout button
    const successMessage = document.getElementById('add-to-cart-success');
    const checkoutButton = document.getElementById('go-to-checkout');
    
    if (successMessage) {
      successMessage.classList.add('show');
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);
    }
    
    if (checkoutButton) {
      checkoutButton.style.display = 'block';
      checkoutButton.style.visibility = 'visible';
      checkoutButton.style.opacity = '1';
      checkoutButton.style.transform = 'translateY(0)';
    }
    
    // Animate cart icon bump
    const cartIcon = document.querySelector('.cart-floating-button');
    if (cartIcon) {
      cartIcon.classList.add('bump');
      setTimeout(() => {
        cartIcon.classList.remove('bump');
      }, 300);
    }
  }
</script>

<svelte:head>
  <title>{product.name} | ST Collection</title>
  <meta name="description" content={product.description} />
</svelte:head>

<section class="product-detail">
  <div class="breadcrumb">
    <Animate animation="fade">
      <div class="container">
        <a href="/">Home</a> &gt; <a href="/products">Products</a> &gt; <span>{product.name}</span>
      </div>
    </Animate>
  </div>

  <div class="container">
    <div class="product-layout">
      <!-- Product Images -->
      <Animate animation="slide-right">
        <div class="product-images">
          <div class="main-image">
            <button class="image-nav prev" on:click={() => changeImage('prev')} aria-label="Previous image">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <img src={currentImage} alt={product.name} />
            <button class="image-nav next" on:click={() => changeImage('next')} aria-label="Next image">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          
          {#if (selectedVariant?.images || product.images || []).length > 1}
            <div class="thumbnail-images">
              {#each (selectedVariant?.images || product.images || []) as image, i}
                <div 
                  class="thumbnail" 
                  class:active={i === imageIndex}
                  on:click={() => {
                    imageIndex = i;
                    updateCurrentImage();
                  }}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      imageIndex = i;
                      updateCurrentImage();
                    }
                  }}
                  role="button"
                  tabindex="0"
                  aria-label={`View image ${i + 1} of ${product.name}`}
                >
                  <img src={image} alt={`${product.name} - view ${i + 1}`} />
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </Animate>

      <!-- Product Info -->
      <Animate animation="slide-left">
        <div class="product-info">
          <h1>{product.name}</h1>
          <p class="price">Rs. {product.price.toFixed(2)}</p>
          
          <div class="description">
            <p>{product.description}</p>
          </div>
          
          {#if uniqueColors.length > 0}
            <div class="colors">
              <h3>Color: <span class="selected-option">{selectedColor}</span></h3>
              <div class="color-options">
                {#each uniqueColors as color}
                  <button 
                    class="color-option" 
                    class:active={color === selectedColor}
                    style="background-color: {normalizeColor(String(color))};" 
                    title={String(color)}
                    on:click={() => handleColorChange(String(color))}
                    aria-label={`Select ${color} color`}
                  ></button>
                {/each}
              </div>
            </div>
          {/if}
          
          {#if availableSizes.length > 0}
            <div class="sizes">
              <h3>Size: <span class="selected-option">{selectedSize}</span></h3>
              <div class="size-options">
                {#each availableSizes as size}
                  <button 
                    class="size-option" 
                    class:active={size === selectedSize}
                    on:click={() => selectedSize = size}
                  >
                    {size}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
          
          <div class="quantity">
            <h3>Quantity:</h3>
            <div class="quantity-selector">
              <button on:click={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button on:click={increaseQuantity}>+</button>
            </div>
            <p class="stock">
              {#if selectedVariant}
                {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} available)` : 'Out of Stock'}
              {:else}
                Stock information unavailable
              {/if}
            </p>
          </div>
          
          <button 
            class="add-to-cart" 
            on:click={addToCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            Add to Cart
          </button>

          <!-- Success message for adding to cart -->
          <div id="add-to-cart-success" class="success-message">
            Product added to cart successfully!
          </div>
          
          <!-- Go to checkout button that appears after adding to cart -->
          <a href="/cart" id="go-to-checkout" class="go-to-checkout" style="display: none;">
            <span class="checkout-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </span>
            Go to Checkout
          </a>
        </div>
      </Animate>
    </div>
  </div>
</section>

<style>
  .product-detail {
    padding-bottom: 6rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .breadcrumb {
    background-color: #f8f8f8;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  .breadcrumb a {
    color: #666;
    text-decoration: none;
  }
  
  .breadcrumb a:hover {
    color: #ffc107;
  }
  
  .breadcrumb span {
    color: #333;
    font-weight: 600;
  }
  
  .product-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
  
  .product-images {
    position: relative;
  }
  
  .main-image {
    position: relative;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    aspect-ratio: 3/4;
  }
  
  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .image-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  
  .image-nav:hover {
    opacity: 1;
  }
  
  .image-nav.prev {
    left: 10px;
  }
  
  .image-nav.next {
    right: 10px;
  }
  
  .thumbnail-images {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .thumbnail:hover {
    opacity: 0.9;
  }
  
  .thumbnail.active {
    opacity: 1;
    border-color: #ffc107;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-info h1 {
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 1.8rem;
    color: #ffc107;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .description {
    margin-bottom: 2rem;
    line-height: 1.6;
    color: #555;
  }
  
  .colors, .sizes {
    margin-bottom: 1.5rem;
  }
  
  .colors h3, .sizes h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .selected-option {
    font-weight: normal;
    color: #666;
  }
  
  .color-options {
    display: flex;
    gap: 0.5rem;
  }
  
  .color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #eee;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
  }
  
  .color-option:hover {
    transform: scale(1.1);
  }
  
  .color-option.active {
    border-color: #ffc107;
  }
  
  .color-option.active::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 1px solid #ffc107;
    border-radius: 50%;
  }
  
  .size-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .size-option {
    min-width: 40px;
    padding: 0.5rem;
    border: 1px solid #eee;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  
  .size-option:hover {
    border-color: #ddd;
    background: #f9f9f9;
  }
  
  .size-option.active {
    border-color: #ffc107;
    background: #fff9e6;
    font-weight: 600;
  }
  
  .quantity {
    margin-bottom: 2rem;
  }
  
  .quantity h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .quantity-selector {
    display: flex;
    align-items: center;
    max-width: 120px;
    margin-bottom: 0.5rem;
  }
  
  .quantity-selector button {
    width: 36px;
    height: 36px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .quantity-selector button:hover {
    background: #eee;
  }
  
  .quantity-selector span {
    flex: 1;
    text-align: center;
    padding: 0 0.5rem;
    height: 36px;
    line-height: 36px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  
  .stock {
    font-size: 0.9rem;
    color: #666;
  }
  
  .add-to-cart {
    width: 100%;
    padding: 1rem;
    background: #ffc107;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .add-to-cart:hover:not(:disabled) {
    background: #ffb300;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .add-to-cart:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .success-message {
    margin-top: 1rem;
    padding: 0.8rem;
    background: #4CAF50;
    color: white;
    border-radius: 4px;
    text-align: center;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    display: none;
  }
  
  .success-message.show {
    opacity: 1;
    transform: translateY(0);
    display: block;
  }
  
  .go-to-checkout {
    margin-top: 1rem;
    padding: 1rem;
    background: #2E7D32;
    color: white;
    text-align: center;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
  
  .go-to-checkout:hover {
    background: #1B5E20;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }
  
  .checkout-icon {
    margin-right: 8px;
    display: inline-flex;
  }
  
  @keyframes bump {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  :global(.cart-floating-button.bump) {
    animation: bump 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .product-layout {
      grid-template-columns: 1fr;
    }
    
    .breadcrumb {
      margin-bottom: 1rem;
    }
  }
</style>
