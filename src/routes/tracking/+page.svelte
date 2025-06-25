<script>
  import { fade } from 'svelte/transition';
  import Animate from '$lib/components/Animate.svelte';
</script>

<svelte:head>
  <title>Order Tracking | ST Collection</title>
  <meta name="description" content="Track your ST Collection orders easily. Order tracking feature coming soon." />
</svelte:head>

<section class="tracking-page" transition:fade={{ duration: 300 }}>
  <div class="container">
    <Animate animation="slide-up">
      <h1 class="page-title">Order Tracking</h1>
    </Animate>

    <div class="tracking-content">
      <Animate animation="fade">
        <div class="tracking-card">
          <div class="coming-soon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h2>Tracking Feature Coming Soon!</h2>
            <p>We're working hard to implement a convenient order tracking system for you to monitor your orders in real-time.</p>
            <p>This feature will be available in the near future to enhance your shopping experience with ST Collection.</p>
            
            <div class="tracking-info">
              <h3>For Now, You Can:</h3>
              <ul>
                <li>
                  <span class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </span>
                  <div class="contact-text">
                    Contact us directly via WhatsApp at <a href="https://wa.me/923221170408" target="_blank">+92 322 1170408</a> for order status updates
                  </div>
                </li>
                <li>
                  <span class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <div class="contact-text">
                    Email us at <a href="mailto:stcollection75@gmail.com">stcollection75@gmail.com</a> with your order number
                  </div>
                </li>
              </ul>
            </div>
            
            <a href="/products" class="cta-button">Continue Shopping</a>
          </div>
        </div>
      </Animate>
    </div>
  </div>
</section>

<style>
  .tracking-page {
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
  
  .tracking-content {
    display: flex;
    justify-content: center;
  }
  
  .tracking-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    padding: 3rem;
    max-width: 800px;
    width: 100%;
  }
  
  .coming-soon {
    text-align: center;
  }
  
  .coming-soon svg {
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #555;
    font-size: 1.1rem;
  }
  
  .tracking-info {
    margin: 2.5rem 0;
    text-align: left;
    background-color: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
  }
  
  .tracking-info h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #444;
  }
  
  .tracking-info ul {
    list-style: none;
    padding: 0;
  }
  
  .tracking-info li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    font-size: 1.05rem;
    color: #555;
  }
  
  .info-icon {
    display: inline-flex;
    margin-right: 0.75rem;
    color: #ffc107;
    flex-shrink: 0;
    padding-top: 3px;
  }
  
  .contact-text {
    flex: 1;
    line-height: 1.5;
  }
  
  a {
    color: #555;
    text-decoration: underline;
    transition: color 0.3s ease;
    margin: 0 0.2rem;
  }
  
  a:hover {
    color: #ffc107;
  }
  
  .cta-button {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: #ffc107;
    color: white;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .cta-button:hover {
    background: #ffb300;
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .tracking-page {
      padding: 4rem 1rem;
    }
    
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .tracking-card {
      padding: 2rem 1.5rem;
    }
    
    h2 {
      font-size: 1.7rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
</style>
