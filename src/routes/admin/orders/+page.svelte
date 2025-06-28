<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  function formatCurrency(amount: number): string {
    return `Rs. ${amount.toFixed(2)}`;
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

  function calculateOrderTotal(items: any[], shippingCost: number = 0): number {
    if (!Array.isArray(items)) return shippingCost;
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemsTotal + shippingCost;
  }

  function getOrderItems(items: any[]): string {
    if (!Array.isArray(items)) return 'No items';
    return items.map(item => `${item.name} (${item.color}, ${item.size}) x${item.quantity}`).join(', ');
  }

  let expandedOrders = $state(new Set<string>());

  function toggleOrderDetails(orderId: string) {
    if (expandedOrders.has(orderId)) {
      expandedOrders.delete(orderId);
    } else {
      expandedOrders.add(orderId);
    }
    expandedOrders = new Set(expandedOrders);
  }

  function handleOrderKeydown(event: KeyboardEvent, orderId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOrderDetails(orderId);
    }
  }

  // Filter state
  let statusFilter = $state('all');
  let searchQuery = $state('');

  // Filtered orders
  let filteredOrders = $derived(data.orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }));
</script>

<svelte:head>
  <title>Manage Orders - ST Collection Admin</title>
</svelte:head>

<div class="orders-page">
  <div class="page-header">
    <h1 class="page-title">Manage Orders</h1>
    <div class="order-stats">
      <span class="stat">Total: {data.orders.length}</span>
      <span class="stat">Pending: {data.orders.filter(o => o.status === 'pending').length}</span>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters">
    <div class="filter-group">
      <label for="status-filter">Filter by Status:</label>
      <select id="status-filter" bind:value={statusFilter}>
        <option value="all">All Orders</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="search">Search:</label>
      <input 
        type="text" 
        id="search" 
        bind:value={searchQuery}
        placeholder="Search by name, email, or order ID..."
      />
    </div>
  </div>

  {#if form?.error}
    <div class="error-message">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="success-message">
      Order status updated successfully!
    </div>
  {/if}

  {#if filteredOrders.length > 0}
    <div class="orders-list">
      {#each filteredOrders as order}
        <div class="order-card">
          <div 
            class="order-header" 
            onclick={() => toggleOrderDetails(order.id)}
            onkeydown={(e) => handleOrderKeydown(e, order.id)}
            role="button"
            tabindex="0"
            aria-expanded={expandedOrders.has(order.id)}
            aria-label="Toggle order details for order #{order.id.substring(0, 8)}"
          >
            <div class="order-info">
              <div class="order-id">#{order.id.substring(0, 8)}</div>
              <div class="customer-name">{order.full_name}</div>
              <div class="order-date">{formatDate(order.created_at)}</div>
            </div>
            
            <div class="order-summary">
              <div class="order-total">{formatCurrency(calculateOrderTotal(order.items, order.shipping_cost))}</div>
              <div class="status-wrapper">
                <span class="status-badge" style="background-color: {getStatusColor(order.status)}">
                  {order.status}
                </span>
              </div>
            </div>

            <div class="expand-icon">
              {expandedOrders.has(order.id) ? '▼' : '▶'}
            </div>
          </div>

          {#if expandedOrders.has(order.id)}
            <div class="order-details">
              <div class="details-grid">
                <div class="detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.full_name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </div>

                <div class="detail-section">
                  <h4>Shipping Address</h4>
                  <p>{order.address_line1}</p>
                  {#if order.address_line2}
                    <p>{order.address_line2}</p>
                  {/if}
                  <p>{order.city}, {order.province} {order.postal_code}</p>
                  <p>{order.country}</p>
                </div>
              </div>

              <div class="detail-section">
                <h4>Order Items</h4>
                {#if Array.isArray(order.items)}
                  <div class="items-list">
                    {#each order.items as item}
                      <div class="item-row">
                        <span class="item-name">{item.name}</span>
                        <span class="item-details">{item.color}, {item.size}</span>
                        <span class="item-quantity">Qty: {item.quantity}</span>
                        <span class="item-price">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    {/each}
                    <div class="order-totals">
                      <div class="total-row">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateOrderTotal(order.items))}</span>
                      </div>
                      <div class="total-row">
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shipping_cost || 0)}</span>
                      </div>
                      <div class="total-row final-total">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateOrderTotal(order.items, order.shipping_cost))}</span>
                      </div>
                    </div>
                  </div>
                {:else}
                  <p>No items found</p>
                {/if}
              </div>

              {#if order.notes}
                <div class="detail-section">
                  <h4>Notes</h4>
                  <p>{order.notes}</p>
                </div>
              {/if}

              <div class="status-update">
                <form method="POST" action="?/updateStatus" use:enhance>
                  <input type="hidden" name="orderId" value={order.id} />
                  <label for="status-{order.id}">Update Status:</label>
                  <select name="status" id="status-{order.id}" value={order.status}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button type="submit" class="btn-update">Update</button>
                </form>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">📦</div>
      <h2>No orders found</h2>
      <p>
        {#if statusFilter !== 'all' || searchQuery}
          Try adjusting your filters or search terms.
        {:else}
          Orders will appear here when customers make purchases.
        {/if}
      </p>
    </div>
  {/if}
</div>

<style>
  .orders-page {
    max-width: 1200px;
    margin: 0 auto;
    background: #f8f9fa;
    min-height: 100vh;
    padding: 2rem;
    border-radius: 20px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: #fefefe;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #f5f5f5;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .order-stats {
    display: flex;
    gap: 1rem;
  }

  .stat {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  .filters {
    background: #fefefe;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
    border: 1px solid #f5f5f5;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 600;
    color: #333;
  }

  .filters select,
  .filters input {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .filters select:focus,
  .filters input:focus {
    outline: none;
    border-color: #ffc107;
  }

  .error-message {
    background: #fff2f2;
    color: #721c24;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5c6cb;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.1);
  }

  .success-message {
    background: #f0f8f0;
    color: #155724;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #c3e6cb;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.1);
  }

  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .order-card {
    background: #fefefe;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #f5f5f5;
  }

  .order-card:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
    transform: translateY(-4px);
  }

  .order-header {
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 1rem;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    background: #fefefe;
    outline: none;
    transition: all 0.3s ease;
  }

  .order-header:focus {
    outline: 2px solid #ffc107;
    outline-offset: -2px;
  }

  .order-header:focus-visible {
    outline: 2px solid #ffc107;
    outline-offset: -2px;
  }

  .order-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .order-id {
    font-family: monospace;
    font-weight: 600;
    color: #666;
    background: #f8f9fa;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    display: inline-block;
    width: fit-content;
  }

  .customer-name {
    font-weight: 600;
    color: #333;
  }

  .order-date {
    font-size: 0.9rem;
    color: #666;
  }

  .order-summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .order-total {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
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

  .expand-icon {
    font-size: 1.2rem;
    color: #666;
  }

  .order-details {
    padding: 1.5rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .detail-section {
    margin-bottom: 1.5rem;
  }

  .detail-section h4 {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .detail-section p {
    margin: 0.25rem 0;
    color: #666;
  }

  .items-list {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .item-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    background: #fdfdfd;
  }

  .item-row:last-child {
    border-bottom: none;
  }

  .item-row:hover {
    background: #f8f9fa;
  }

  .item-name {
    font-weight: 500;
  }

  .item-details {
    color: #666;
    font-size: 0.9rem;
  }

  .item-quantity {
    font-size: 0.9rem;
  }

  .item-price {
    font-weight: 600;
    text-align: right;
  }

  .order-totals {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 0 0 12px 12px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .final-total {
    font-weight: 700;
    font-size: 1.1rem;
    border-top: 1px solid #e0e0e0;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  .status-update {
    background: #ffffff;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .status-update form {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .status-update label {
    font-weight: 600;
    color: #333;
  }

  .status-update select {
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fdfdfd;
  }

  .btn-update {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  .btn-update:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
    background: #fefefe;
    border-radius: 18px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #f5f5f5;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .order-stats {
      justify-content: center;
    }

    .filters {
      grid-template-columns: 1fr;
    }

    .order-header {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .item-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .status-update form {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
