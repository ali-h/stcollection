<script lang="ts">
  import { onMount } from 'svelte';
  import Animate from '$lib/components/Animate.svelte';
  import { fade } from 'svelte/transition';
  import cartStore, { cartActions, type CartItem, cartSummary } from '$lib/stores/cart';

  let cart: CartItem[] = [];
  
  // Subscribe to the cart store
  onMount(() => {
    const unsubscribe = cartStore.subscribe((items) => {
      cart = items;
    });
    
    return unsubscribe;
  });

  // Handle removing an item from the cart
  function removeItem(id: string) {
    cartActions.removeFromCart(id);
  }

  // Handle updating item quantity
  function updateQuantity(id: string, newQuantity: number) {
    if (newQuantity < 1) return;
    cartActions.updateQuantity(id, newQuantity);
  }
</script>

<svelte:head>
  <title>Your Cart | ST Collection</title>
  <meta name="description" content="View and manage your shopping cart" />
</svelte:head>

<section class="cart-page">
  <div class="container">
    <Animate animation="slide-up">
      <h1 class="page-title">Your Shopping Cart</h1>
    </Animate>

    {#if $cartSummary.totalItems === 0}
      <Animate animation="fade">
        <div class="empty-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="/products" class="continue-shopping">Continue Shopping</a>
        </div>
      </Animate>
    {:else}
      <div class="cart-layout">
        <Animate animation="slide-up" delay={100}>
          <div class="cart-items">
            {#each cart as item, i}
              <div class="cart-item" transition:fade>
                <div class="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div class="item-details">
                  <h3>{item.name}</h3>
                  <p class="item-variant">
                    <span class="color-dot" style="background-color: {item.color}"></span>
                    <span class="variant-details">Color: {item.color}</span>
                    <span class="size-details">Size: {item.size}</span>
                  </p>
                  <p class="item-price">Rs. {item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                  <button on:click={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                  <span>{item.quantity}</span>
                  <button on:click={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <div class="item-total">
                  Total: Rs. {(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" on:click={() => removeItem(item.id)} aria-label="Remove item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            {/each}
          </div>
        </Animate>

        <Animate animation="slide-up" delay={200}>
          <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>Rs. {$cartSummary.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>Rs. {$cartSummary.subtotal.toFixed(2)}</span>
            </div>
            <div class="button-group">
              <a href="/checkout" class="button primary-button">
                Proceed to Checkout
              </a>
              <a href="/products" class="button secondary-button">
                Continue Shopping
              </a>
            </div>
          </div>
        </Animate>
      </div>
    {/if}
  </div>
</section>

<style>
  .cart-page {
    padding: 6rem 2rem;
    min-height: 80vh;
    background: linear-gradient(135deg, #fff9e6, #fffdf2);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
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
  
  .empty-cart {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-cart svg {
    color: #ffc107;
    margin-bottom: 1rem;
  }
  
  .empty-cart h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .empty-cart p {
    color: #666;
    margin-bottom: 2rem;
  }
  
  .continue-shopping {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: transparent;
    color: #333;
    border: 2px solid #ffc107;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .continue-shopping:hover {
    background: #ffc107;
    color: white;
  }
  
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
  }
  
  .cart-items {
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
  }
  
  .cart-item:last-child {
    border-bottom: none;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .item-details {
    padding: 0 1rem;
  }
  
  .item-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  .item-variant {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }
  
  .variant-details, .size-details {
    display: inline-flex;
    align-items: center;
  }
  
  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .item-price {
    font-weight: 600;
    color: #ffc107;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    margin: 0 1.5rem;
  }
  
  .item-quantity button {
    width: 32px;
    height: 32px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    font-size: 1.1rem;
  }
  
  .item-quantity button:hover {
    background: #eee;
  }
  
  .item-quantity span {
    min-width: 32px;
    text-align: center;
    padding: 0 0.5rem;
    font-weight: 600;
  }
  
  .item-total {
    font-weight: 600;
    margin-right: 2rem;
  }
  
  .remove-item {
    background: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 5px;
  }
  
  .remove-item:hover {
    color: #ff5252;
  }
  
  .cart-summary {
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    height: fit-content;
  }
  
  .cart-summary h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    color: #666;
  }
  
  .summary-row.total {
    font-weight: 600;
    color: #333;
    font-size: 1.2rem;
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #f0f0f0;
  }
  
  .checkout-button {
    width: 100%;
    padding: 1rem;
    background: #ffc107;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .checkout-button:hover {
    background: #ffb300;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .button {
    display: block;
    text-align: center;
    padding: 1rem;
    border-radius: 4px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .primary-button {
    background: #ffc107;
    color: white;
  }
  
  .primary-button:hover {
    background: #ffb300;
  }
  
  .secondary-button {
    background: transparent;
    color: #666;
    border: 1px solid #e0e0e0;
  }
  
  .secondary-button:hover {
    background: #f9f9f9;
  }
  
  .cart-summary .continue-shopping {
    width: 100%;
    text-align: center;
  }
  
  @media (max-width: 992px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .cart-page {
      padding: 4rem 1rem;
    }
    
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .cart-item {
      grid-template-columns: 80px 1fr;
      grid-template-areas:
        "image details"
        "image quantity"
        "total total"
        "remove remove";
      gap: 0.75rem;
      padding: 1.25rem;
    }
    
    .item-image {
      grid-area: image;
      width: 70px;
      height: 70px;
    }
    
    .item-details {
      grid-area: details;
      padding: 0;
    }
    
    .item-details h3 {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    
    .item-variant {
      font-size: 0.8rem;
    }
    
    .item-quantity {
      grid-area: quantity;
      margin: 0;
      justify-content: flex-start;
    }
    
    .item-total {
      grid-area: total;
      margin: 0;
      padding-top: 0.75rem;
      padding-bottom: 0.5rem;
      border-top: 1px dashed #eee;
      font-size: 1.1rem;
      color: #ffc107;
    }
    
    .remove-item {
      grid-area: remove;
      justify-self: flex-end;
      padding: 8px;
      margin-top: -8px;
      background-color: #f8f8f8;
      border-radius: 50%;
    }
    
    .cart-summary {
      margin-top: 1.5rem;
    }
  }
</style>
