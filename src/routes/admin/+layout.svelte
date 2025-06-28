<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let { data, children } = $props();

  async function logout() {
    const response = await fetch('/admin/logout', {
      method: 'POST'
    });
    
    if (response.ok) {
      goto('/admin/login');
    }
  }

  function isActiveRoute(route: string): boolean {
    return $page.url.pathname === route || $page.url.pathname.startsWith(route + '/');
  }
</script>

<svelte:head>
  <title>ST Collection Admin</title>
</svelte:head>

{#if $page.url.pathname !== '/admin/login'}
<header class="admin-header">
  <div class="container">
    <h1 class="admin-title">ST Collection Admin</h1>
    <nav>
      <ul class="admin-nav">
        <li><a href="/admin" class:active={$page.url.pathname === '/admin'}>Dashboard</a></li>
        <li><a href="/admin/products" class:active={isActiveRoute('/admin/products')}>Products</a></li>
        <li><a href="/admin/orders" class:active={isActiveRoute('/admin/orders')}>Orders</a></li>
      </ul>
    </nav>
    <button class="logout-btn" onclick={logout}>Logout</button>
  </div>
</header>
{/if}

<main class="admin-content">
  <div class="container">
    {@render children()}
  </div>
</main>

<style>
  /* Admin-specific styles */
  :global(.admin-layout) {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .admin-header {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .admin-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .admin-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .admin-nav {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .admin-nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .admin-nav a:hover,
  .admin-nav a.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .admin-content {
    padding: 2rem 0;
    min-height: calc(100vh - 80px);
  }

  .logout-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .admin-header .container {
      flex-direction: column;
      gap: 1rem;
    }

    .admin-nav {
      gap: 1rem;
    }
  }
</style>
