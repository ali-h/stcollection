<script>
  import { fade } from 'svelte/transition';
  import Animate from '$lib/components/Animate.svelte';
</script>

<svelte:head>
  <title>Contact Us | ST Collection</title>
  <meta name="description" content="Get in touch with ST Collection - your homegrown clothing brand from Rahim Yar Khan, Pakistan." />
</svelte:head>

<section class="contact-page" transition:fade={{ duration: 300 }}>
  <div class="container">
    <Animate animation="slide-up">
      <h1 class="page-title">Contact Us</h1>
    </Animate>

    <div class="contact-layout">
      <div class="about-section">
        <Animate animation="fade">
          <div class="about-card">
            <h2>About Us</h2>
            <p>ST Collection is a homegrown clothing brand born in the heart of Rahim Yar Khan, with a vision to blend classic style and vibrant energy into everyday wear. What started as a small idea has grown into a statement — one that reflects individuality, culture, and modern simplicity.</p>
            
            <p>We design clothing that feels good and looks even better — rooted in comfort, expression, and detail. From clean-cut minimal tees to bold statement prints, every piece is crafted to make you stand out without saying a word.</p>
            
            <p>Whether you're dressing for the street, the studio, or a laid-back evening, ST Collection has your fit — classic, bold, and uniquely yours.</p>
            
            <h3>Our Story</h3>
            <p>Founded in 2024, ST Collection began as a passion project by a group of friends who shared a love for fashion and a dream to create something unique. We noticed a gap in the local market for clothing that was both affordable and stylish, comfortable yet distinctive.</p>
            
            <p>Starting with just a handful of designs and a small workshop, we've steadily grown our collection and our community. Every design is crafted with care, keeping in mind the diverse tastes and needs of our customers.</p>
            
            <p>Today, we're proud to be a recognized name in Rahim Yar Khan and beyond, bringing quality fashion to people who appreciate the blend of comfort, style, and individuality.</p>
          </div>
        </Animate>
      </div>
      
      <div class="contact-section">
        <Animate animation="fade">
          <div class="contact-card">
            <h2>Connect With Us</h2>
            
            <div class="contact-info">
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/923221170408" target="_blank">+92 322 1170408</a></p>
                </div>
              </div>
              
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:stcollection75@gmail.com">stcollection75@gmail.com</a></p>
                </div>
              </div>
              
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <h4>Location</h4>
                  <p>Rahim Yar Khan, Punjab, Pakistan</p>
                </div>
              </div>
              
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <div>
                  <h4>Business Hours</h4>
                  <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-page {
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
  
  .contact-layout {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 2rem;
  }
  
  .about-card, .contact-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    padding: 2rem;
    height: 100%;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #333;
    position: relative;
    display: inline-block;
    padding-bottom: 0.5rem;
  }
  
  h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: #ffc107;
  }
  
  h3 {
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;
    color: #444;
  }

  h4 {
    font-size: 1.1rem;
    margin: 0 0 0.25rem;
    color: #555;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #555;
  }
  
  .contact-info {
    margin-bottom: 2rem;
  }
  
  .contact-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }
  
  .contact-item svg {
    margin-right: 1rem;
    color: #ffc107;
    flex-shrink: 0;
  }
  
  .contact-item p {
    margin-bottom: 0.25rem;
  }
  
  .contact-item a {
    color: #555;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .contact-item a:hover {
    color: #ffc107;
    text-decoration: underline;
  }
  
  .social-links h3 {
    margin-bottom: 1rem;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  
  .social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f5f5f5;
    border-radius: 50%;
    color: #555;
    transition: all 0.3s ease;
  }
  
  .social-icons a:hover {
    background: #ffc107;
    color: white;
    transform: translateY(-3px);
  }

  @media (max-width: 992px) {
    .contact-layout {
      grid-template-columns: 1fr;
    }
    
    .about-card, .contact-card {
      margin-bottom: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .contact-page {
      padding: 4rem 1rem;
    }
    
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .about-card, .contact-card {
      padding: 1.5rem;
    }
  }
</style>
