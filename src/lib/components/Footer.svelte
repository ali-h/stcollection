<footer>
  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-logo">
        <h2>ST COLLECTION</h2>
        <p>Vibrant. Classy. Modern.</p>
      </div>
      
      <div class="footer-links">
        <div class="footer-column">
          <h3>Shop</h3>
          <ul>
            <li><a href="/products">All Products</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Information</h3>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/tracking">Order Tracking</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Connect</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">WhatsApp:</span>
              <a href="https://wa.me/923089721100" class="contact-value">+92 322 1170408</a>
            </div>
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <a href="mailto:stcollection75@gmail.com" class="contact-value">stcollection75@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} ST Collection. All rights reserved.</p>
      <div class="footer-bottom-links">
        <span>We do not share your personal information.</span>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: #222;
    color: white;
    padding: 4rem 2rem 2rem;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-top {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 250px;
  }
  
  .footer-logo h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #ffc107, #ff9800);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
  
  .footer-logo p {
    color: #aaa;
  }
  
  .footer-links {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-column {
    flex: 1;
    min-width: 150px;
  }
  
  .footer-column h3 {
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
    color: #ffc107;
  }
  
  .footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-column li {
    margin-bottom: 0.7rem;
  }
  
  .footer-column a {
    color: #ddd;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-column a:hover {
    color: #ffc107;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .contact-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  
  .contact-label {
    color: #aaa;
    font-size: 0.9rem;
  }
  
  .contact-value {
    color: #ddd;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .contact-value:hover {
    color: #ffc107;
  }
  
  .footer-bottom {
    padding-top: 2rem;
    border-top: 1px solid #333;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .footer-bottom p {
    color: #aaa;
    font-size: 0.9rem;
  }
  
  .footer-bottom-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .footer-bottom-links span {
    color: #aaa;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .footer-top {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
