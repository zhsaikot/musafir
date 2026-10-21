/**
 * MUSAFIR - Data Layer (db.js)
 * Seamless hybrid storage: LocalStorage + Seed Data fallback with ready Firebase Firestore hooks.
 * Works out-of-the-box offline/static, and upgrades to Firebase automatically when credentials are added.
 */

const STORAGE_KEYS = {
  CATEGORIES: 'musafir_categories',
  ITEMS: 'musafir_products',
  CART: 'musafir_cart',
  WISHLIST: 'musafir_wishlist',
  ORDERS: 'musafir_orders'
};

// Helper for non-blocking Firestore network calls with timeout
function safeFirestoreFetch(promise, timeoutMs = 1500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore request timed out or database unprovisioned')), timeoutMs))
  ]);
}

class MusafirDB {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    // If local storage is empty, initialize with default seed data
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.DEFAULT_CATEGORIES || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(window.DEFAULT_SEED_ITEMS || []));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
  }

  // --- Categories ---
  async getCategories() {
    // 1. Read Local Storage / Seed Data immediately (0ms instant response)
    const localRaw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const localCategories = localRaw ? JSON.parse(localRaw) : (window.DEFAULT_CATEGORIES || []);

    // 2. If Firestore is active and provisioned, attempt background sync with timeout
    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        const snapshot = await safeFirestoreFetch(window.firebaseFirestore.collection('categories').get(), 1500);
        if (snapshot && !snapshot.empty) {
          const cloudCats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudCats));
          return cloudCats;
        }
      } catch (err) {
        console.warn("Firestore categories notice (using local storage fallback):", err.message);
      }
    }

    return localCategories;
  }

  async saveCategory(category) {
    let categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = { ...categories[index], ...category };
    } else {
      categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('musafir:categories-updated', { detail: categories }));

    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        await safeFirestoreFetch(window.firebaseFirestore.collection('categories').doc(category.id).set(category, { merge: true }), 2500);
      } catch (e) {
        console.warn("Firebase save category note:", e.message);
      }
    }
    return category;
  }

  async deleteCategory(categoryId) {
    let categories = await this.getCategories();
    categories = categories.filter(c => c.id !== categoryId);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('musafir:categories-updated', { detail: categories }));

    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        await safeFirestoreFetch(window.firebaseFirestore.collection('categories').doc(categoryId).delete(), 2500);
      } catch (e) {
        console.warn("Firebase delete category note:", e.message);
      }
    }
    return true;
  }

  // --- Products / Items ---
  async getItems(categoryId = 'all') {
    // 1. Read Local Storage / Seed Data immediately (0ms instant response)
    const localRaw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    let items = localRaw ? JSON.parse(localRaw) : (window.DEFAULT_SEED_ITEMS || []);

    // 2. If Firestore is active and provisioned, attempt background sync with timeout
    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        let query = window.firebaseFirestore.collection('products');
        const snapshot = await safeFirestoreFetch(query.get(), 1500);
        if (snapshot && !snapshot.empty) {
          const cloudItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(cloudItems));
          items = cloudItems;
        }
      } catch (err) {
        console.warn("Firestore products notice (using local storage fallback):", err.message);
      }
    }

    if (categoryId && categoryId !== 'all') {
      return items.filter(item => item.category === categoryId);
    }
    return items;
  }

  async getFeaturedItems() {
    const items = await this.getItems('all');
    return items.filter(item => item.isPopular === true || item.isPopular === 'true');
  }

  async getItemById(id) {
    const items = await this.getItems('all');
    return items.find(item => item.id === id || item.slug === id) || null;
  }

  async saveItem(item) {
    let items = await this.getItems('all');
    if (!item.id) {
      item.id = 'p_' + Date.now();
    }
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
    } else {
      items.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('musafir:products-updated', { detail: items }));

    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        await safeFirestoreFetch(window.firebaseFirestore.collection('products').doc(item.id).set(item, { merge: true }), 2500);
      } catch (e) {
        console.warn("Firebase save product note:", e.message);
      }
    }
    return item;
  }

  async deleteItem(id) {
    let items = await this.getItems('all');
    items = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('musafir:products-updated', { detail: items }));

    if (window.IS_FIREBASE_ENABLED && window.IS_FIRESTORE_PROVISIONED && window.firebaseFirestore) {
      try {
        await safeFirestoreFetch(window.firebaseFirestore.collection('products').doc(id).delete(), 2500);
      } catch (e) {
        console.warn("Firebase delete product note:", e.message);
      }
    }
    return true;
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.DEFAULT_CATEGORIES || []));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(window.DEFAULT_SEED_ITEMS || []));
    window.dispatchEvent(new CustomEvent('musafir:products-updated', { detail: window.DEFAULT_SEED_ITEMS }));
    window.dispatchEvent(new CustomEvent('musafir:categories-updated', { detail: window.DEFAULT_CATEGORIES }));
    return true;
  }

  // --- Cart Management ---
  getCart() {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  }

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('musafir:cart-updated', { detail: cart }));
  }

  addToCart(item, quantity = 1) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(c => c.id === item.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: item.id,
        title_en: item.title_en,
        title_bn: item.title_bn,
        price: item.price,
        image: item.image,
        quantity: quantity,
        category: item.category
      });
    }
    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(id, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(c => c.id !== id);
    } else {
      const item = cart.find(c => c.id === id);
      if (item) item.quantity = quantity;
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(id) {
    let cart = this.getCart();
    cart = cart.filter(c => c.id !== id);
    this.saveCart(cart);
    return cart;
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartTotal() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, count };
  }
}

window.musafirDB = new MusafirDB();
