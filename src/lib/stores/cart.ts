import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// Define types for cart functionality
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

// Initialize the cart from localStorage if available
const storedCart = browser ? localStorage.getItem('cart') : null;
const initialCart = storedCart ? JSON.parse(storedCart) : [];

// Create the writable store
const cartStore = writable<CartItem[]>(initialCart);

// Derived store for cart summary data
export const cartSummary = derived(cartStore, ($cart) => {
  const totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = $cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    totalItems,
    subtotal
  };
});

// Subscribe to the store and update localStorage when it changes
if (browser) {
  cartStore.subscribe(($cart) => {
    localStorage.setItem('cart', JSON.stringify($cart));
  });
}

// Cart actions
export const cartActions = {
  addToCart: (item: Omit<CartItem, 'id'>) => {
    cartStore.update((items) => {
      // Check if this exact product variant is already in the cart
      const existingItemIndex = items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId && i.size === item.size
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        items[existingItemIndex].quantity += item.quantity;
        return [...items];
      } else {
        // Add new item with a unique id
        const newItem = {
          ...item,
          id: crypto.randomUUID()
        };
        return [...items, newItem];
      }
    });
  },
  
  removeFromCart: (id: string) => {
    cartStore.update((items) => items.filter((i) => i.id !== id));
  },
  
  updateQuantity: (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    cartStore.update((items) => 
      items.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  },
  
  clearCart: () => {
    cartStore.set([]);
  },
  
  getCart: () => get(cartStore)
};

export default cartStore;
