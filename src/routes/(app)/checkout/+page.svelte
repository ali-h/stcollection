<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Animate from '$lib/components/Animate.svelte';
  import cartStore, { cartActions, cartSummary, type CartItem } from '$lib/stores/cart';

  let cart: CartItem[] = [];
  
  // Subscribe to the cart store
  onMount(() => {
    const unsubscribe = cartStore.subscribe((items) => {
      cart = items;
    });
    
    return unsubscribe;
  });
  
  // Form data
  let formData = {
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'Pakistan', // Default
    notes: ''
  };

  $: isFormValid = formData.fullName && 
                   formData.email && 
                   formData.phone && 
                   formData.addressLine1 && 
                   formData.city && 
                   formData.postalCode && 
                   formData.province && 
                   formData.country;

  // Calculate totals with shipping
  $: shippingCost = 100; // Rs 100 shipping
  $: totalCost = $cartSummary.subtotal + shippingCost;

  // Clear the cart when order is successful
  $: if ($page.form?.success) {
    cartActions.clearCart();
  }
</script>

<svelte:head>
  <title>{$page.form?.success ? 'Order Confirmed' : 'Checkout'} | ST Collection</title>
  <meta name="description" content={$page.form?.success ? 'Your order has been confirmed' : 'Complete your order'} />
</svelte:head>

{#if $page.form?.success}
  <section class="success-page" transition:fade={{ duration: 300 }}>
    <div class="container">
      <Animate animation="slide-up">
        <div class="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1>Thank You, {$page.form.orderData.fullName}!</h1>
          <p class="order-number">Order #{$page.form.orderData.orderIdShort}</p>
          <p>Your order has been successfully placed. We will contact you shortly through phone or email to confirm your order details.</p>
          
          <div class="order-summary-card">
            <h2>Order Summary</h2>
            <div class="order-items">
              {#each $page.form.orderData.items as item}
                <div class="order-item">
                  <div class="item-details">
                    <span class="item-name">{item.name}</span>
                    <span class="item-variant">{item.color} / {item.size}</span>
                    <span class="item-price">Rs. {item.price.toFixed(2)} × {item.quantity}</span>
                  </div>
                  <div class="item-total">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              {/each}
            </div>
            
            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>Rs. {$page.form.orderData.subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>Rs. {$page.form.orderData.shippingCost.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>Rs. {$page.form.orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="customer-info">
            <div class="info-column">
              <h3>Shipping Address</h3>
              <p>{$page.form.orderData.fullName}</p>
              <p>{$page.form.orderData.addressLine1}</p>
              {#if $page.form.orderData.addressLine2}
                <p>{$page.form.orderData.addressLine2}</p>
              {/if}
              <p>{$page.form.orderData.city}, {$page.form.orderData.province} {$page.form.orderData.postalCode}</p>
              <p>{$page.form.orderData.country}</p>
            </div>
            
            <div class="info-column">
              <h3>Contact Information</h3>
              <p>Email: {$page.form.orderData.email}</p>
              <p>Phone: {$page.form.orderData.phone}</p>
            </div>
          </div>
          
          <a href="/products" class="continue-button">Continue Shopping</a>
        </div>
      </Animate>
    </div>
  </section>
{:else}
  <section class="checkout-page">
    <div class="container">
      <Animate animation="slide-up">
        <h1 class="page-title">Checkout</h1>
      </Animate>

      {#if $cartSummary.totalItems === 0}
        <Animate animation="fade">
          <div class="empty-cart">
            <p>Your cart is empty. Please add some products before checking out.</p>
            <a href="/products" class="continue-shopping">Browse Products</a>
          </div>
        </Animate>
      {:else}
        <div class="checkout-layout">
          <div class="checkout-form">
            <Animate animation="fade">
              <form 
                method="POST" 
                action="/checkout?/placeOrder"
              >
                <h2>Contact Information</h2>
                <div class="form-row">
                  <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName" 
                      required 
                      bind:value={formData.fullName}
                    />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      bind:value={formData.email}
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      bind:value={formData.phone}
                    />
                  </div>
                </div>
                
                <h2>Shipping Address</h2>
                <div class="form-group">
                  <label for="addressLine1">Address Line 1 *</label>
                  <input 
                    type="text" 
                    id="addressLine1" 
                    name="addressLine1" 
                    required 
                    placeholder="Street address, P.O. box" 
                    bind:value={formData.addressLine1}
                  />
                </div>
                
                <div class="form-group">
                  <label for="addressLine2">Address Line 2</label>
                  <input 
                    type="text" 
                    id="addressLine2" 
                    name="addressLine2" 
                    placeholder="Apartment, suite, unit, building, floor, etc." 
                    bind:value={formData.addressLine2}
                  />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      required 
                      bind:value={formData.city}
                    />
                  </div>
                  <div class="form-group">
                    <label for="postalCode">Postal Code *</label>
                    <input 
                      type="text" 
                      id="postalCode" 
                      name="postalCode" 
                      required 
                      bind:value={formData.postalCode}
                    />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="province">Province *</label>
                    <input 
                      type="text" 
                      id="province" 
                      name="province" 
                      required 
                      bind:value={formData.province}
                    />
                  </div>
                  <div class="form-group">
                    <label for="country">Country *</label>
                    <input 
                      type="text" 
                      id="country" 
                      name="country" 
                      required 
                      bind:value={formData.country}
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="notes">Order Notes</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    placeholder="Special instructions for delivery" 
                    bind:value={formData.notes}
                  ></textarea>
                </div>

                <!-- Hidden input for cart items -->
                <input type="hidden" name="cartItems" value={JSON.stringify(cart)} />
                
                <button 
                  type="submit" 
                  class="place-order-button" 
                  disabled={$cartSummary.totalItems === 0 || !isFormValid}
                >
                  Place Order
                </button>
              </form>
            </Animate>
          </div>
          
          <div class="order-summary">
            <Animate animation="fade">
              <div class="order-summary-card">
                <h2>Order Summary</h2>
                <div class="order-items">
                  {#each cart as item}
                    <div class="order-item">
                      <div class="item-details">
                        <span class="item-name">{item.name}</span>
                        <span class="item-variant">{item.color} / {item.size}</span>
                        <span class="item-price">Rs. {item.price.toFixed(2)} × {item.quantity}</span>
                      </div>
                      <div class="item-total">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  {/each}
                </div>
                
                <div class="summary-totals">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>Rs. {$cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span>Rs. {shippingCost.toFixed(2)}</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>Rs. {totalCost.toFixed(2)}</span>
                  </div>
                </div>
                
                <a href="/cart" class="back-to-cart">
                  Back to Cart
                </a>
              </div>
            </Animate>
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}

<style>
  .checkout-page {
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
    height: 2px;
    background-color: #ffc107;
  }
  
  .checkout-layout {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 2rem;
  }
  
  .checkout-form {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    padding: 2rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: #555;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 1.5rem 0;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.75rem;
  }
  
  .place-order-button {
    width: 100%;
    padding: 1rem;
    background: #ffc107;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .place-order-button:hover {
    background: #ffb300;
  }
  
  .place-order-button:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
  
  .order-summary-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    padding: 2rem;
    position: sticky;
    top: 2rem;
  }
  
  .order-items {
    margin-bottom: 1.5rem;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
  }
  
  .item-name {
    font-weight: 500;
  }
  
  .item-variant, .item-price {
    font-size: 0.85rem;
    color: #666;
  }
  
  .summary-totals {
    margin-top: 1.5rem;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
  }
  
  .total {
    font-weight: 700;
    font-size: 1.2rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #f0f0f0;
  }
  
  .back-to-cart {
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
    text-decoration: underline;
  }
  
  .empty-cart {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  }
  
  .continue-shopping {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #ffc107;
    color: white;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
  }
  @media (max-width: 992px) {
    .checkout-layout {
      grid-template-columns: 1fr;
    }
    
    .order-summary-card {
      position: static;
      margin-bottom: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .checkout-page {
      padding: 4rem 1rem;
    }
    
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  
  /* Success page styles */
  .success-page {
    padding: 6rem 2rem;
    min-height: 80vh;
    background: linear-gradient(135deg, #f0f8e6, #f2fff2);
  }
  
  .success-message {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .success-message h1 {
    margin: 1.5rem 0 0.5rem;
    color: #4CAF50;
  }
  
  .order-number {
    font-size: 1.2rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 1.5rem;
  }
  
  .success-message p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: #555;
  }
  
  .continue-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.3s ease;
  }
  
  .continue-button:hover {
    background: #3d9140;
  }
  
  .customer-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    text-align: left;
    margin: 2rem 0;
  }
  
  .info-column p {
    margin: 0.5rem 0;
  }
  
  @media (max-width: 768px) {
    .success-page {
      padding: 4rem 1rem;
    }
    
    .success-message {
      padding: 2rem 1.5rem;
    }
    
    .customer-info {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .info-column {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .info-column:last-child {
      border-bottom: none;
    }
  }
</style>
