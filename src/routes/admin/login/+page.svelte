<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  let { form } = $props();
  
  const hasError = $page.url.searchParams.get('error');
  const errorMessage = hasError === 'invalid' ? 'Invalid credentials' : form?.error;
</script>

<svelte:head>
  <title>Admin Login - ST Collection</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>ST Collection</h1>
      <p>Admin Dashboard</p>
    </div>

    <form method="POST" action="?/login" use:enhance>
      <div class="form-group">
        <label for="password">Admin Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          class:error={errorMessage}
          placeholder="Enter admin password"
        />
        {#if errorMessage}
          <span class="error-message">{errorMessage}</span>
        {/if}
      </div>

      <button type="submit" class="login-btn">
        Login to Dashboard
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .login-card {
    background: linear-gradient(135deg, #ffc107, #ff9800);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .login-header p {
    color: #666;
    font-size: 1.1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
  }

  input.error {
    border-color: #e74c3c;
  }

  .error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: block;
  }

  .login-btn {
    width: 100%;
    padding: 1rem;
    background: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3);
  }

  .login-btn:active {
    transform: translateY(0);
  }
</style>
