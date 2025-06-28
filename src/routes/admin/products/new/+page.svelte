<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();

  let formData = $state({
    name: '',
    description: '',
    price: '',
    variantSize: '',
    variantColor: '',
    variantStock: '',
    variantImages: '[]'
  });

  let imageUrls = $state(['']);

  function addImageUrl() {
    imageUrls.push('');
  }

  function removeImageUrl(index: number) {
    imageUrls.splice(index, 1);
  }

  function updateImagesJson() {
    const validUrls = imageUrls.filter(url => url.trim() !== '');
    formData.variantImages = JSON.stringify(validUrls);
  }

  // Update JSON when image URLs change
  $effect(() => {
    updateImagesJson();
  });

  let isSubmitting = $state(false);
</script>

<svelte:head>
  <title>Add New Product - ST Collection Admin</title>
</svelte:head>

<div class="product-form-page">
  <div class="page-header">
    <h1 class="page-title">Add New Product</h1>
    <a href="/admin/products" class="btn-secondary">Back to Products</a>
  </div>

  <div class="form-container">
    <form method="POST" action="?/createProduct" use:enhance={() => {
      isSubmitting = true;
      return async ({ update }) => {
        await update();
        isSubmitting = false;
      };
    }}>
      
      {#if form?.error}
        <div class="error-message">
          {form.error}
        </div>
      {/if}

      <div class="form-section">
        <h2>Product Information</h2>
        
        <div class="form-group">
          <label for="name">Product Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            bind:value={formData.name}
            required 
            placeholder="Enter product name"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            bind:value={formData.description}
            required 
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="price">Price (CAD)</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            bind:value={formData.price}
            required 
            step="0.01" 
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>

      <div class="form-section">
        <h2>Initial Variant</h2>
        <p class="section-note">Every product needs at least one variant. You can add more variants later.</p>
        
        <div class="variant-grid">
          <div class="form-group">
            <label for="variantSize">Size</label>
            <input 
              type="text" 
              id="variantSize" 
              name="variantSize" 
              bind:value={formData.variantSize}
              required 
              placeholder="e.g., S, M, L, XL"
            />
          </div>

          <div class="form-group">
            <label for="variantColor">Color</label>
            <input 
              type="text" 
              id="variantColor" 
              name="variantColor" 
              bind:value={formData.variantColor}
              required 
              placeholder="e.g., red, blue, black"
            />
          </div>

          <div class="form-group">
            <label for="variantStock">Stock Quantity</label>
            <input 
              type="number" 
              id="variantStock" 
              name="variantStock" 
              bind:value={formData.variantStock}
              required 
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="label-header">Variant Images</div>
          <div class="images-section">
            {#each imageUrls as url, index}
              <div class="image-input-group">
                <input 
                  type="url" 
                  bind:value={imageUrls[index]}
                  placeholder="https://example.com/image.jpg"
                  class="image-url-input"
                />
                {#if imageUrls.length > 1}
                  <button 
                    type="button" 
                    class="btn-remove"
                    onclick={() => removeImageUrl(index)}
                  >
                    Remove
                  </button>
                {/if}
              </div>
            {/each}
            
            <button type="button" class="btn-add-image" onclick={addImageUrl}>
              Add Another Image
            </button>
            
            <input 
              type="hidden" 
              name="variantImages" 
              value={formData.variantImages}
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </button>
        <a href="/admin/products" class="btn-cancel">Cancel</a>
      </div>
    </form>
  </div>
</div>

<style>
  .product-form-page {
    max-width: 800px;
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

  .btn-secondary {
    background: #6c757d;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }

  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .form-section {
    margin-bottom: 2.5rem;
  }

  .form-section:last-of-type {
    margin-bottom: 0;
  }

  .form-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .section-note {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .variant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  .label-header {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  input, textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
  }

  .images-section {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 1rem;
  }

  .image-input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;
  }

  .image-url-input {
    flex: 1;
    margin-bottom: 0;
  }

  .btn-remove {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .btn-remove:hover {
    background: #c82333;
  }

  .btn-add-image {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn-add-image:hover {
    background: #218838;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5c6cb;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .btn-primary {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-cancel {
    background: transparent;
    color: #666;
    padding: 1rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-cancel:hover {
    color: #333;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .variant-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .image-input-group {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
