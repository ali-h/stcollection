<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  // Edit modes
  let editingProduct = $state(false);
  let editingVariants = $state(new Set<string>());
  let addingVariant = $state(false);

  // Form data
  let productForm = $state({
    name: data.product.name,
    description: data.product.description,
    price: data.product.price
  });

  // New variant form
  let newVariantForm = $state({
    size: '',
    color: '',
    stock: 0,
    images: ['']
  });

  function startEditingVariant(variantId: string) {
    editingVariants.add(variantId);
    editingVariants = new Set(editingVariants);
  }

  function stopEditingVariant(variantId: string) {
    editingVariants.delete(variantId);
    editingVariants = new Set(editingVariants);
  }

  function addImageToNewVariant() {
    newVariantForm.images.push('');
  }

  function removeImageFromNewVariant(index: number) {
    newVariantForm.images.splice(index, 1);
  }

  function resetNewVariantForm() {
    newVariantForm = {
      size: '',
      color: '',
      stock: 0,
      images: ['']
    };
    addingVariant = false;
  }

  function getImagesJson(images: string[]): string {
    const validImages = images.filter(img => img.trim() !== '');
    return JSON.stringify(validImages);
  }

  async function deleteVariant(variantId: string) {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    // Create a temporary form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?/deleteVariant';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'variantId';
    input.value = variantId;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  // Handle form success
  $effect(() => {
    if (form?.success) {
      if (form.action === 'addVariant') {
        resetNewVariantForm();
      }
      // Reload the page to get fresh data
      setTimeout(() => location.reload(), 100);
    }
  });
</script>

<svelte:head>
  <title>Edit {data.product.name} - ST Collection Admin</title>
</svelte:head>

<div class="edit-product-page">
  <div class="page-header">
    <h1 class="page-title">Edit Product</h1>
    <a href="/admin/products" class="btn-secondary">Back to Products</a>
  </div>

  {#if form?.error}
    <div class="error-message">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="success-message">
      {#if form.action === 'addVariant'}
        Variant added successfully!
      {:else if form.action === 'updateVariant'}
        Variant updated successfully!
      {:else if form.action === 'deleteVariant'}
        Variant deleted successfully!
      {:else}
        Product updated successfully!
      {/if}
    </div>
  {/if}

  <!-- Product Information -->
  <div class="product-section">
    <div class="section-header">
      <h2>Product Information</h2>
      {#if !editingProduct}
        <button class="btn-edit" onclick={() => editingProduct = true}>
          Edit Product
        </button>
      {/if}
    </div>

    {#if editingProduct}
      <form method="POST" action="?/updateProduct" use:enhance={() => {
        return async ({ update }) => {
          await update();
          editingProduct = false;
        };
      }}>
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              bind:value={productForm.name}
              required 
            />
          </div>

          <div class="form-group">
            <label for="price">Price (CAD)</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              bind:value={productForm.price}
              required 
              step="0.01" 
              min="0"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            bind:value={productForm.description}
            required 
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
          <button type="button" class="btn-cancel" onclick={() => editingProduct = false}>
            Cancel
          </button>
        </div>
      </form>
    {:else}
      <div class="product-display">
        <h3>{data.product.name}</h3>
        <p class="product-price">${data.product.price}</p>
        <p class="product-description">{data.product.description}</p>
      </div>
    {/if}
  </div>

  <!-- Variants Section -->
  <div class="variants-section">
    <div class="section-header">
      <h2>Product Variants</h2>
      <button class="btn-primary" onclick={() => addingVariant = true}>
        Add Variant
      </button>
    </div>

    <!-- Add New Variant Form -->
    {#if addingVariant}
      <div class="variant-form">
        <h3>Add New Variant</h3>
        <form method="POST" action="?/addVariant" use:enhance>
          <div class="variant-grid">
            <div class="form-group">
              <label for="new-size">Size</label>
              <input 
                type="text" 
                id="new-size" 
                name="size" 
                bind:value={newVariantForm.size}
                required 
                placeholder="e.g., S, M, L, XL"
              />
            </div>

            <div class="form-group">
              <label for="new-color">Color</label>
              <input 
                type="text" 
                id="new-color" 
                name="color" 
                bind:value={newVariantForm.color}
                required 
                placeholder="e.g., red, blue, black"
              />
            </div>

            <div class="form-group">
              <label for="new-stock">Stock</label>
              <input 
                type="number" 
                id="new-stock" 
                name="stock" 
                bind:value={newVariantForm.stock}
                required 
                min="0"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-header">Images</div>
            <div class="images-section">
              {#each newVariantForm.images as image, index}
                <div class="image-input-group">
                  <input 
                    type="url" 
                    bind:value={newVariantForm.images[index]}
                    placeholder="https://example.com/image.jpg"
                    class="image-url-input"
                  />
                  {#if newVariantForm.images.length > 1}
                    <button 
                      type="button" 
                      class="btn-remove"
                      onclick={() => removeImageFromNewVariant(index)}
                    >
                      Remove
                    </button>
                  {/if}
                </div>
              {/each}
              
              <button type="button" class="btn-add-image" onclick={addImageToNewVariant}>
                Add Image
              </button>
            </div>
            
            <input 
              type="hidden" 
              name="images" 
              value={getImagesJson(newVariantForm.images)}
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Add Variant</button>
            <button type="button" class="btn-cancel" onclick={resetNewVariantForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Existing Variants -->
    <div class="variants-list">
      {#each data.product.variants as variant}
        <div class="variant-card">
          {#if editingVariants.has(variant.id)}
            <!-- Edit Mode -->
            <form method="POST" action="?/updateVariant" use:enhance={() => {
              return async ({ update }) => {
                await update();
                stopEditingVariant(variant.id);
              };
            }}>
              <input type="hidden" name="variantId" value={variant.id} />
              
              <div class="variant-grid">
                <div class="form-group">
                  <label for="size-{variant.id}">Size</label>
                  <input 
                    type="text" 
                    id="size-{variant.id}" 
                    name="size" 
                    value={variant.size}
                    required 
                  />
                </div>

                <div class="form-group">
                  <label for="color-{variant.id}">Color</label>
                  <input 
                    type="text" 
                    id="color-{variant.id}" 
                    name="color" 
                    value={variant.color}
                    required 
                  />
                </div>

                <div class="form-group">
                  <label for="stock-{variant.id}">Stock</label>
                  <input 
                    type="number" 
                    id="stock-{variant.id}" 
                    name="stock" 
                    value={variant.stock}
                    required 
                    min="0"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="images-{variant.id}">Images (JSON Array)</label>
                <textarea 
                  id="images-{variant.id}" 
                  name="images" 
                  value={JSON.stringify(variant.images)}
                  required 
                  rows="3"
                  placeholder='["url1", "url2"]'
                ></textarea>
              </div>

              <div class="variant-actions">
                <button type="submit" class="btn-save">Save</button>
                <button type="button" class="btn-cancel" onclick={() => stopEditingVariant(variant.id)}>
                  Cancel
                </button>
              </div>
            </form>
          {:else}
            <!-- Display Mode -->
            <div class="variant-display">
              <div class="variant-info">
                <div class="variant-detail">
                  <span class="label">Size:</span>
                  <span class="value">{variant.size}</span>
                </div>
                <div class="variant-detail">
                  <span class="label">Color:</span>
                  <span class="value">
                    <span class="color-dot" style="background-color: {variant.color}"></span>
                    {variant.color}
                  </span>
                </div>
                <div class="variant-detail">
                  <span class="label">Stock:</span>
                  <span class="value stock-count" class:low-stock={variant.stock < 5}>
                    {variant.stock}
                  </span>
                </div>
                <div class="variant-detail">
                  <span class="label">Images:</span>
                  <span class="value">{variant.images.length} image(s)</span>
                </div>
              </div>

              <div class="variant-actions">
                <button class="btn-edit" onclick={() => startEditingVariant(variant.id)}>
                  Edit
                </button>
                <button class="btn-delete" onclick={() => deleteVariant(variant.id)}>
                  Delete
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .edit-product-page {
    max-width: 1000px;
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

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5c6cb;
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #c3e6cb;
  }

  .product-section,
  .variants-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .btn-edit,
  .btn-primary {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-edit:hover,
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
  }

  .product-display h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffc107;
    margin-bottom: 1rem;
  }

  .product-description {
    color: #666;
    line-height: 1.6;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .variant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label,
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

  .btn-add-image {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .btn-cancel {
    background: transparent;
    color: #666;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 500;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-cancel:hover {
    color: #333;
    border-color: #ccc;
  }

  .variant-form {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
  }

  .variant-form h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .variants-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .variant-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 1.5rem;
    background: #f8f9fa;
  }

  .variant-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .variant-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    flex: 1;
  }

  .variant-detail {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .variant-detail .label {
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
  }

  .variant-detail .value {
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #ddd;
  }

  .stock-count {
    font-weight: 600;
  }

  .low-stock {
    color: #dc3545;
  }

  .variant-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-save {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-save:hover {
    background: #218838;
  }

  .btn-delete {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-delete:hover {
    background: #c82333;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .variant-grid {
      grid-template-columns: 1fr;
    }

    .variant-display {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .variant-info {
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
