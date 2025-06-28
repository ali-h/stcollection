<script lang="ts">
  let { data } = $props();
  
  function formatCurrency(amount: number): string {
    return `Rs. ${amount.toFixed(0)}`;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'shipped': return '#9c27b0';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  }

  function calculateOrderTotal(items: any[]): number {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
</script>

<svelte:head>
  <title>Admin Dashboard - ST Collection</title>
</svelte:head>

<div class="dashboard">
  <h1 class="page-title">Dashboard</h1>
  
  <!-- Statistics Cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">📦</div>
      <div class="stat-content">
        <h3>Total Products</h3>
        <div class="stat-value">{data.stats.totalProducts}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">🛍️</div>
      <div class="stat-content">
        <h3>Total Orders</h3>
        <div class="stat-value">{data.stats.totalOrders}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">⏰</div>
      <div class="stat-content">
        <h3>Pending Orders</h3>
        <div class="stat-value">{data.stats.pendingOrders}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-content">
        <h3>Total Revenue</h3>
        <div class="stat-value">{formatCurrency(data.stats.totalRevenue)}</div>
      </div>
    </div>
  </div>

  <!-- Recent Orders -->
  <div class="recent-orders">
    <h2>Recent Orders</h2>
    {#if data.recentOrders.length > 0}
      <div class="orders-table">
        <div class="table-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Total</div>
          <div>Status</div>
          <div>Date</div>
        </div>
        {#each data.recentOrders as order}
          <div class="table-row">
            <div class="order-id">{order.id.substring(0, 8)}...</div>
            <div>{order.full_name}</div>
            <div>{formatCurrency(calculateOrderTotal(order.items) + (order.shipping_cost || 0))}</div>
            <div>
              <span class="status-badge" style="background-color: {getStatusColor(order.status)}">
                {order.status}
              </span>
            </div>
            <div>{formatDate(order.created_at)}</div>
          </div>
        {/each}
      </div>
      <div class="view-all">
        <a href="/admin/orders" class="btn-secondary">View All Orders</a>
      </div>
    {:else}
      <div class="empty-state">
        <p>No orders yet</p>
      </div>
    {/if}
  </div>

  <!-- Quick Actions -->
  <div class="quick-actions">
    <h2>Quick Actions</h2>
    <div class="actions-grid">
      <a href="/admin/products/new" class="action-card">
        <div class="action-icon">➕</div>
        <h3>Add Product</h3>
        <p>Add a new product to your store</p>
      </a>
      
      <a href="/admin/products" class="action-card">
        <div class="action-icon">📝</div>
        <h3>Manage Products</h3>
        <p>Edit or remove existing products</p>
      </a>
      
      <a href="/admin/orders" class="action-card">
        <div class="action-icon">📋</div>
        <h3>Manage Orders</h3>
        <p>View and update order status</p>
      </a>
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    background: #f8f9fa;
    min-height: 100vh;
    padding: 2rem;
    border-radius: 20px;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 2rem;
    background: #fefefe;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 1px solid #f5f5f5;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: #fefefe;
    padding: 1.5rem;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border: 1px solid #f5f5f5;
  }

  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
  }

  .stat-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #ffc107, #ff9800);
    border-radius: 18px;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  .stat-content h3 {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  .recent-orders {
    background: #fefefe;
    padding: 2rem;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    margin-bottom: 3rem;
    border: 1px solid #f5f5f5;
  }

  .recent-orders h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .orders-table {
    display: grid;
    gap: 0.5rem;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 12px;
    font-weight: 600;
    color: #333;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    background: #fdfdfd;
    margin-bottom: 0.5rem;
    border: 1px solid #f0f0f0;
  }

  .table-row:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .order-id {
    font-family: monospace;
    font-size: 0.9rem;
  }

  .status-badge {
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .view-all {
    text-align: center;
    margin-top: 1.5rem;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  }

  .btn-secondary:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
  }

  .quick-actions h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .action-card {
    background: #fefefe;
    padding: 2rem;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    text-align: center;
    border: 1px solid #f5f5f5;
  }

  .action-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
  }

  .action-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .action-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .action-card p {
    color: #666;
    margin: 0;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .table-header {
      display: none;
    }

    .table-row {
      background: #f8f9fa;
      margin-bottom: 0.5rem;
    }
  }
</style>
