<script lang="ts">
  import { onMount } from 'svelte';
  
  let visible = false;
  
  export let animation = 'fade'; // fade, slide-up, slide-left, slide-right
  export let delay = 0; // milliseconds
  export let duration = 800; // milliseconds
  export let threshold = 0.1; // 0-1, percentage of element visible to trigger animation
  
  onMount(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            visible = true;
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold
    });
    
    const element = document.getElementById('animated-element');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  });
</script>

<div id="animated-element" 
  class={`animated ${animation} ${visible ? 'visible' : ''}`}
  style={`--duration: ${duration}ms;`}>
  <slot />
</div>

<style>
  .animated {
    opacity: 0;
    will-change: transform, opacity;
  }
  
  .animated.visible {
    opacity: 1;
  }
  
  .fade {
    transition: opacity var(--duration) ease;
  }
  
  .slide-up {
    transform: translateY(30px);
    transition: transform var(--duration) ease, opacity var(--duration) ease;
  }
  
  .slide-up.visible {
    transform: translateY(0);
  }
  
  .slide-left {
    transform: translateX(-30px);
    transition: transform var(--duration) ease, opacity var(--duration) ease;
  }
  
  .slide-left.visible {
    transform: translateX(0);
  }
  
  .slide-right {
    transform: translateX(30px);
    transition: transform var(--duration) ease, opacity var(--duration) ease;
  }
  
  .slide-right.visible {
    transform: translateX(0);
  }
</style>
