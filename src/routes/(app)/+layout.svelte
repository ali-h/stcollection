<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { cartSummary } from '$lib/stores/cart';
</script>

<svelte:head>
  <title>ST Collection - Vibrant. Classy. Modern.</title>
  <meta name="description" content="ST Collection - A modern clothing brand with vibrant designs and classy aesthetics.">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <Navbar />
  <main>
    <slot />
  </main>
  <Footer />
  
  <a href="/cart" class="cart-floating-button" aria-label="View Cart">
    <span class="cart-count">{$cartSummary.totalItems}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  </a>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding-top: 80px; /* Provide space for fixed navbar */
  }
  
  :global(body) {
    margin: 0;
    background-color: #fff;
  }
  
  :global(html) {
    scroll-behavior: smooth;
  }
  
  @media (max-width: 768px) {
    main {
      padding-top: 110px; /* Increased padding for mobile navbar */
    }
  }
  
  @media (max-width: 768px) {
    main {
      padding-top: 110px; /* Increased padding for mobile navbar */
    }
  }
  
  .cart-floating-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    background: #ffc107;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    color: white;
    z-index: 100;
    transition: all 0.3s ease;
  }
  
  .cart-floating-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    background: #ffb300;
  }
  
  .cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff5252;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
</style>
