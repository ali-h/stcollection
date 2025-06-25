<header>
  <div class="header-container">
    <div class="overlay"></div>
    <div class="header-content">
      <h1 class="title">ST COLLECTION</h1>
      <p class="tagline">Vibrant. Classy. Modern.</p>
      <a href="/products" class="cta-button">Explore Collection</a>
    </div>
  </div>
</header>

<style>
  header {
    height: 100vh;
    position: relative;
    overflow: hidden;
    margin-top: 0;
  }
  
  .header-container {
    width: 100%;
    height: 100%;
    background-image: url('https://irfbphbwzwnkughkadpq.supabase.co/storage/v1/object/public/stock//ChatGPT%20Image%20Jun%2025,%202025,%2009_36_53%20PM.png');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.6), rgba(255, 152, 0, 0.4));
    z-index: 1;
  }
  
  .header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    max-width: 800px;
    padding: 0 2rem;
    animation: fadeIn 1.5s ease-out;
  }
  
  .title {
    font-size: 5rem;
    font-weight: 900;
    margin-bottom: 1rem;
    letter-spacing: 5px;
    text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .tagline {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 2rem;
    letter-spacing: 2px;
  }
  
  .cta-button {
    padding: 1rem 2.5rem;
    border: none;
    background: white;
    color: #ffc107;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    display: inline-block;
    text-decoration: none;
  }
  
  .cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  
  .cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background: #ffc107;
    color: white;
  }
  
  .cta-button:hover::before {
    left: 100%;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 3rem;
    }
    
    .tagline {
      font-size: 1.2rem;
    }
  }
</style>
