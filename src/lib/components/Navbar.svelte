<nav>
  <div class="nav-container">
    <div class="nav-left">
      <a href="/" class="nav-link">Home</a>
      <a href="/products" class="nav-link">Products</a>
    </div>
    
    <div class="logo">
      <a href="/" class="logo-link">
        <img src="/favicon.png" alt="ST" class="logo-img" />
        <span class="logo-text">COLLECTION</span>
      </a>
    </div>
    
    <div class="nav-right">
      <a href="/contact" class="nav-link">Contact Us</a>
      <a href="/tracking" class="nav-link">Tracking</a>
    </div>
  </div>
</nav>

<style>
  nav {
    padding: 1.2rem 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }
  
  .nav-left, .nav-right {
    display: flex;
    gap: 2rem;
  }
  
  .logo {
    left: 50%;
    display: flex;
    align-items: center;
    padding-top: 2px;
  }
  
  .logo a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }
  
  .logo-text {
    font-weight: 700;
    letter-spacing: 2px;
    background: linear-gradient(45deg, #ffc107, #ff9800);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: all 0.3s ease;
  }
  
  .nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #ffc107, #ff9800);
    transition: width 0.3s ease;
  }
  
  .nav-link:hover {
    color: #ffc107;
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
  
  .logo-img {
    height: 50px;
    width: auto;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    nav {
      padding: 0.8rem 0;
    }
    
    .nav-container {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      padding: 0 1rem;
    }
    
    .logo {
      position: relative;
      left: 0;
      transform: none;
      margin: 0 auto;
      order: -1;
      width: 100%;
      text-align: center;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: center;
    }
    
    .logo a {
      justify-content: center;
      width: 100%;
      display: flex;
    }
    
    .logo-text {
      font-size: 0.8rem;
      text-align: center;
    }
  
    .nav-left, .nav-right {
      width: 50%;
      justify-content: space-around;
      gap: 0.8rem;
    }
    
    .nav-link {
      font-size: 0.9rem;
    }
  }
</style>
