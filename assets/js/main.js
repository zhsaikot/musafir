/**
 * MUSAFIR - Islamic Lifestyle E-commerce
 * Core Application Controller (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initSearchModal();
  initAuthModal();
  initLanguageSwitcher();
  updateCartBadge();
  renderHomeFeatured();

  // Listen to storage or cart events
  window.addEventListener('musafir:cart-updated', () => {
    updateCartBadge();
    renderCartDrawerItems();
  });

  window.addEventListener('musafir:products-updated', () => {
    renderHomeFeatured();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'musafir_products') {
      renderHomeFeatured();
    }
    if (e.key === 'musafir_cart') {
      updateCartBadge();
      renderCartDrawerItems();
    }
  });

  window.addEventListener('musafir:lang-changed', () => {
    renderCartDrawerItems();
    renderHomeFeatured();
  });
});

/* ==========================================================================
   Header & Mobile Navigation
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  let mobileMenuDrawer = document.getElementById('mobile-menu-drawer');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('header-sticky', 'shadow-lg', 'border-b', 'border-[#D6A63A]/20');
    } else {
      header?.classList.remove('header-sticky', 'shadow-lg', 'border-b', 'border-[#D6A63A]/20');
    }
  });

  // Defensive fallback: If mobileMenuDrawer is missing in DOM, create it dynamically
  if (!mobileMenuDrawer && mobileMenuBtn) {
    const currentPath = window.location.pathname.toLowerCase();
    const isAbout = currentPath.includes('about');
    const isContact = currentPath.includes('contact');
    const isShop = currentPath.includes('shop');
    const isHome = currentPath.includes('index') || currentPath.endsWith('/') || currentPath === '';

    mobileMenuDrawer = document.createElement('div');
    mobileMenuDrawer.id = 'mobile-menu-drawer';
    mobileMenuDrawer.className = 'fixed inset-0 z-50 hidden';
    mobileMenuDrawer.innerHTML = `
      <div class="drawer-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div class="drawer-content fixed top-0 left-0 w-72 h-full bg-[#081018] text-white p-6 shadow-2xl -translate-x-full transition-transform duration-300 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-6 border-b border-[#D6A63A]/20">
            <img src="assets/images/MUSAFIR-Brand-Logo-White.png" alt="MUSAFIR" class="h-10 w-auto">
            <button id="close-mobile-menu-btn" class="text-gray-400 hover:text-white p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav class="flex flex-col space-y-4 mt-6 text-base">
            <a href="index.html" class="${isHome ? 'text-[#D6A63A] font-semibold' : 'text-gray-300 hover:text-[#D6A63A]'} py-2" data-i18n="nav_home">Home</a>
            <a href="shop.html" class="${isShop ? 'text-[#D6A63A] font-semibold' : 'text-gray-300 hover:text-[#D6A63A]'} py-2" data-i18n="nav_shop">Shop</a>
            <a href="about.html" class="${isAbout ? 'text-[#D6A63A] font-semibold' : 'text-gray-300 hover:text-[#D6A63A]'} py-2" data-i18n="nav_about">About</a>
            <a href="contact.html" class="${isContact ? 'text-[#D6A63A] font-semibold' : 'text-gray-300 hover:text-[#D6A63A]'} py-2" data-i18n="nav_contact">Contact</a>
            <a href="admin.html" class="text-gray-400 hover:text-[#D6A63A] py-2 border-t border-gray-800 text-sm" data-i18n="nav_admin">Admin Panel</a>
          </nav>
        </div>
        <div class="pt-6 border-t border-[#D6A63A]/20 text-xs text-gray-400">
          <p class="text-[#D6A63A] font-medium">MUSAFIR ISLAMIC LIFESTYLE</p>
          <p class="mt-1">Faith • Remembrance • Purpose</p>
        </div>
      </div>
    `;
    document.body.appendChild(mobileMenuDrawer);
    if (window.i18n) window.i18n.translateDOM();
  }

  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');

  // Mobile menu open / close handlers
  const openMobile = () => {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      mobileMenuDrawer.querySelector('.drawer-content')?.classList.remove('-translate-x-full');
    }, 10);
  };

  const closeMobile = () => {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.querySelector('.drawer-content')?.classList.add('-translate-x-full');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      mobileMenuDrawer.classList.add('hidden');
    }, 300);
  };

  mobileMenuBtn?.addEventListener('click', openMobile);
  closeMobileMenuBtn?.addEventListener('click', closeMobile);
  mobileMenuDrawer?.querySelector('.drawer-backdrop')?.addEventListener('click', closeMobile);

  // Close when tapping any navigation link inside mobile drawer
  mobileMenuDrawer?.querySelectorAll('nav a')?.forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuDrawer && !mobileMenuDrawer.classList.contains('hidden')) {
      closeMobile();
    }
  });
}

/* ==========================================================================
   Language Switcher
   ========================================================================== */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-toggle-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.i18n.toggle();
    });
  });
}

/* ==========================================================================
   Cart Drawer & WhatsApp Order Flow
   ========================================================================== */
function initCartDrawer() {
  const cartTriggerBtns = document.querySelectorAll('.open-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const waCheckoutBtn = document.getElementById('cart-wa-checkout-btn');

  const openCart = () => {
    renderCartDrawerItems();
    cartDrawer?.classList.remove('hidden');
    setTimeout(() => {
      cartDrawer?.querySelector('.drawer-content')?.classList.remove('translate-x-full');
    }, 10);
  };

  const closeCart = () => {
    cartDrawer?.querySelector('.drawer-content')?.classList.add('translate-x-full');
    setTimeout(() => {
      cartDrawer?.classList.add('hidden');
    }, 300);
  };

  cartTriggerBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeCartBtn?.addEventListener('click', closeCart);
  cartDrawer?.querySelector('.drawer-backdrop')?.addEventListener('click', closeCart);

  // WhatsApp Checkout button
  waCheckoutBtn?.addEventListener('click', () => {
    const cart = window.musafirDB.getCart();
    if (cart.length === 0) {
      showToast(window.i18n.t('cart_empty'), 'warning');
      return;
    }
    openQuickOrderModal();
  });
}

function updateCartBadge() {
  const { count } = window.musafirDB.getCartTotal();
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

function renderCartDrawerItems() {
  const cart = window.musafirDB.getCart();
  const container = document.getElementById('cart-items-container');
  const emptyMessage = document.getElementById('cart-empty-message');
  const footerArea = document.getElementById('cart-drawer-footer');
  const subtotalEl = document.getElementById('cart-drawer-subtotal');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyMessage?.classList.remove('hidden');
    footerArea?.classList.add('hidden');
    return;
  }

  emptyMessage?.classList.add('hidden');
  footerArea?.classList.remove('hidden');

  const lang = window.i18n.getLang();
  let html = '';

  cart.forEach(item => {
    const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
    html += `
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#DED7C8] shadow-sm">
        <img src="${item.image}" alt="${title}" class="w-16 h-16 object-cover rounded-md border border-[#DED7C8]/60 flex-shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-[#171717] truncate">${title}</h4>
          <p class="text-xs text-[#D6A63A] font-medium mt-0.5">৳ ${item.price.toLocaleString()}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="changeCartQty('${item.id}', ${item.quantity - 1})" class="w-6 h-6 rounded bg-[#F7F1E4] text-[#171717] flex items-center justify-center text-xs hover:bg-[#D6A63A] transition">-</button>
            <span class="text-xs font-semibold px-2">${item.quantity}</span>
            <button onclick="changeCartQty('${item.id}', ${item.quantity + 1})" class="w-6 h-6 rounded bg-[#F7F1E4] text-[#171717] flex items-center justify-center text-xs hover:bg-[#D6A63A] transition">+</button>
          </div>
        </div>
        <button onclick="removeCartItem('${item.id}')" class="text-gray-400 hover:text-red-500 p-1" title="Remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  const { subtotal } = window.musafirDB.getCartTotal();
  if (subtotalEl) {
    subtotalEl.textContent = `৳ ${subtotal.toLocaleString()}`;
  }
}

window.changeCartQty = (id, newQty) => {
  window.musafirDB.updateCartQuantity(id, newQty);
};

window.removeCartItem = (id) => {
  window.musafirDB.removeFromCart(id);
  showToast(window.i18n.getLang() === 'bn' ? 'পণ্যটি কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
};

/* ==========================================================================
   Quick WhatsApp Order Modal
   ========================================================================== */
function openQuickOrderModal() {
  const modal = document.getElementById('quick-order-modal');
  if (!modal) {
    // If on a page without modal, direct to cart.html
    window.location.href = 'cart.html';
    return;
  }
  modal.classList.remove('hidden');
}

window.closeQuickOrderModal = () => {
  document.getElementById('quick-order-modal')?.classList.add('hidden');
};

window.submitWhatsAppOrder = (event) => {
  event?.preventDefault();
  const name = document.getElementById('order-name')?.value.trim();
  const phone = document.getElementById('order-phone')?.value.trim();
  const address = document.getElementById('order-address')?.value.trim();
  const areaSelect = document.getElementById('order-area');
  const area = areaSelect?.value || 'dhaka';
  const notes = document.getElementById('order-notes')?.value.trim() || '';

  if (!name || !phone || !address) {
    showToast(window.i18n.getLang() === 'bn' ? 'অনুগ্রহ করে নাম, ফোন ও ঠিকানা পূরণ করুন' : 'Please fill your name, phone and address', 'warning');
    return;
  }

  const cart = window.musafirDB.getCart();
  const { subtotal } = window.musafirDB.getCartTotal();
  const deliveryFee = area === 'dhaka' ? window.STORE_CONFIG.deliveryInsideDhaka : window.STORE_CONFIG.deliveryOutsideDhaka;
  const total = subtotal + deliveryFee;
  const lang = window.i18n.getLang();

  let message = "";
  if (lang === 'bn') {
    message += `*আসসালামু আলাইকুম, আমি MUSAFIR থেকে অর্ডার করতে চাই:*\n`;
    message += `--------------------------------------\n`;
    cart.forEach((item, index) => {
      const title = item.title_bn || item.title_en;
      message += `${index + 1}. *${title}*\n   পরিমাণ: ${item.quantity} | মূল্য: ৳${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `--------------------------------------\n`;
    message += `• সাবটোটাল: ৳${subtotal.toLocaleString()}\n`;
    message += `• ডেলিভারি চার্জ (${area === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}): ৳${deliveryFee}\n`;
    message += `• *সর্বমোট প্রদেয়: ৳${total.toLocaleString()}*\n\n`;
    message += `*গ্রাহকের তথ্য:*\n`;
    message += `• নাম: ${name}\n`;
    message += `• ফোন: ${phone}\n`;
    message += `• ঠিকানা: ${address}\n`;
    if (notes) message += `• বিশেষ নোট: ${notes}\n`;
    message += `\nঅনুগ্রহ করে অর্ডারটি দ্রুত কনফার্ম করুন। জাযাকাল্লাহু খাইরান!`;
  } else {
    message += `*Assalamualaikum, I want to place an order from MUSAFIR:*\n`;
    message += `--------------------------------------\n`;
    cart.forEach((item, index) => {
      const title = item.title_en || item.title_bn;
      message += `${index + 1}. *${title}*\n   Qty: ${item.quantity} | Price: ৳${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `--------------------------------------\n`;
    message += `• Subtotal: ৳${subtotal.toLocaleString()}\n`;
    message += `• Delivery (${area === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳${deliveryFee}\n`;
    message += `• *Grand Total: ৳${total.toLocaleString()}*\n\n`;
    message += `*Customer Details:*\n`;
    message += `• Name: ${name}\n`;
    message += `• Phone: ${phone}\n`;
    message += `• Address: ${address}\n`;
    if (notes) message += `• Notes: ${notes}\n`;
    message += `\nPlease confirm my order. Jazakallahu Khair!`;
  }

  const phoneNum = window.STORE_CONFIG.whatsappNumber || "8801577696391";
  const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;

  window.closeQuickOrderModal();
  showToast(window.i18n.t('order_success'), 'success');
  window.musafirDB.clearCart();

  setTimeout(() => {
    window.open(url, '_blank');
  }, 500);
};

/* ==========================================================================
   Search Modal
   ========================================================================== */
function initSearchModal() {
  const searchTriggers = document.querySelectorAll('.open-search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('site-search-input');
  const searchResultsContainer = document.getElementById('search-results-list');

  const openSearch = () => {
    searchModal?.classList.remove('hidden');
    searchInput?.focus();
  };

  const closeSearch = () => {
    searchModal?.classList.add('hidden');
  };

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  closeSearchBtn?.addEventListener('click', closeSearch);
  searchModal?.querySelector('.modal-backdrop')?.addEventListener('click', closeSearch);

  // Live filter
  searchInput?.addEventListener('input', async (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      if (searchResultsContainer) searchResultsContainer.innerHTML = '';
      return;
    }

    const items = await window.musafirDB.getItems('all');
    const filtered = items.filter(item => {
      const en = (item.title_en || '').toLowerCase();
      const bn = (item.title_bn || '').toLowerCase();
      const descEn = (item.shortDesc_en || '').toLowerCase();
      const descBn = (item.shortDesc_bn || '').toLowerCase();
      return en.includes(query) || bn.includes(query) || descEn.includes(query) || descBn.includes(query);
    });

    if (!searchResultsContainer) return;

    if (filtered.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="p-6 text-center text-gray-500">
          <p class="text-sm">কোনো পণ্য খুঁজে পাওয়া যায়নি / No products found</p>
        </div>
      `;
      return;
    }

    const lang = window.i18n.getLang();
    searchResultsContainer.innerHTML = filtered.map(item => {
      const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
      return `
        <a href="item-details.html?id=${item.id}" class="flex items-center gap-4 p-3 hover:bg-[#F7F1E4] rounded-lg transition border-b border-gray-100 last:border-0">
          <img src="${item.image}" alt="${title}" class="w-14 h-14 object-cover rounded border border-[#DED7C8]">
          <div class="flex-1">
            <h5 class="text-sm font-semibold text-[#171717]">${title}</h5>
            <p class="text-xs text-[#D6A63A] font-bold mt-0.5">৳ ${item.price.toLocaleString()}</p>
          </div>
          <span class="text-xs text-gray-400 font-medium">View →</span>
        </a>
      `;
    }).join('');
  });
}

/* ==========================================================================
   Account & Firebase Authentication (Google, Email/Password, Profile)
   ========================================================================== */
function initAuthModal() {
  const authTriggers = document.querySelectorAll('.open-auth-btn');
  const authModal = document.getElementById('auth-modal');
  const closeAuthBtn = document.getElementById('close-auth-btn');
  const googleBtn = document.getElementById('google-signin-btn');

  window.openAuthModal = () => {
    authModal?.classList.remove('hidden');
  };

  window.closeAuthModal = () => {
    authModal?.classList.add('hidden');
  };

  authTriggers.forEach(btn => btn.addEventListener('click', window.openAuthModal));
  closeAuthBtn?.addEventListener('click', window.closeAuthModal);
  authModal?.querySelector('.modal-backdrop')?.addEventListener('click', window.closeAuthModal);

  // Tab switcher
  window.switchAuthTab = function(tab) {
    const loginTabBtn = document.getElementById('tab-auth-login');
    const registerTabBtn = document.getElementById('tab-auth-register');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const forgotForm = document.getElementById('auth-forgot-form');

    if (tab === 'login') {
      loginTabBtn?.classList.add('border-[#D6A63A]', 'text-[#171717]');
      loginTabBtn?.classList.remove('border-transparent', 'text-gray-400');
      registerTabBtn?.classList.remove('border-[#D6A63A]', 'text-[#171717]');
      registerTabBtn?.classList.add('border-transparent', 'text-gray-400');

      loginForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
      forgotForm?.classList.add('hidden');
    } else if (tab === 'register') {
      registerTabBtn?.classList.add('border-[#D6A63A]', 'text-[#171717]');
      registerTabBtn?.classList.remove('border-transparent', 'text-gray-400');
      loginTabBtn?.classList.remove('border-[#D6A63A]', 'text-[#171717]');
      loginTabBtn?.classList.add('border-transparent', 'text-gray-400');

      registerForm?.classList.remove('hidden');
      loginForm?.classList.add('hidden');
      forgotForm?.classList.add('hidden');
    } else if (tab === 'forgot') {
      loginForm?.classList.add('hidden');
      registerForm?.classList.add('hidden');
      forgotForm?.classList.remove('hidden');
    }
  };

  // Google Sign-In
  googleBtn?.addEventListener('click', async () => {
    if (window.IS_FIREBASE_ENABLED && window.firebaseAuth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        showToast(`Welcome to Musafir, ${user.displayName || 'Guest'}!`, 'success');
        window.closeAuthModal();
      } catch (error) {
        console.warn("Firebase Google Auth error:", error);
        if (error.code === 'auth/popup-closed-by-user') {
          showToast('Sign-in cancelled', 'info');
        } else if (error.code === 'auth/unauthorized-domain') {
          showToast('Domain not authorized. Please add "localhost" in Firebase Console > Authentication > Settings > Authorized domains.', 'warning');
        } else {
          showToast(`Google Sign-In: ${error.message}`, 'error');
        }
      }
    } else {
      showToast('Google Sign-In Successful (Demo Mode)! Welcome to Musafir.', 'success');
      setTimeout(window.closeAuthModal, 600);
    }
  });

  // Email / Password Login
  window.handleEmailPasswordLogin = async function(e) {
    e?.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) return;

    if (window.IS_FIREBASE_ENABLED && window.firebaseAuth) {
      try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
        showToast(`Welcome back, ${cred.user.displayName || email}!`, 'success');
        window.closeAuthModal();
      } catch (error) {
        console.warn("Firebase Email Login error:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          showToast('ভুল ইমেইল অথবা পাসওয়ার্ড! (Invalid email or password)', 'error');
        } else {
          showToast(error.message, 'error');
        }
      }
    } else {
      showToast(`Signed in successfully as ${email} (Demo Mode)!`, 'success');
      setTimeout(window.closeAuthModal, 600);
    }
  };

  // Email / Password Register
  window.handleEmailPasswordRegister = async function(e) {
    e?.preventDefault();
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;

    if (!email || !password) return;

    if (window.IS_FIREBASE_ENABLED && window.firebaseAuth) {
      try {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (name && cred.user) {
          await cred.user.updateProfile({ displayName: name });
        }
        showToast(`Account created successfully! Welcome, ${name || email}.`, 'success');
        window.closeAuthModal();
      } catch (error) {
        console.warn("Firebase Register error:", error);
        if (error.code === 'auth/email-already-in-use') {
          showToast('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে (Email already in use).', 'warning');
        } else if (error.code === 'auth/weak-password') {
          showToast('পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে (Password should be at least 6 characters).', 'warning');
        } else {
          showToast(error.message, 'error');
        }
      }
    } else {
      showToast(`Account created for ${name || email} (Demo Mode)!`, 'success');
      setTimeout(window.closeAuthModal, 600);
    }
  };

  // Forgot Password
  window.handleForgotPassword = async function(e) {
    e?.preventDefault();
    const email = document.getElementById('forgot-email')?.value.trim();
    if (!email) return;

    if (window.IS_FIREBASE_ENABLED && window.firebaseAuth) {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        showToast(`পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে (${email})!`, 'success');
        window.switchAuthTab('login');
      } catch (error) {
        console.warn("Forgot password error:", error);
        showToast(error.message, 'error');
      }
    } else {
      showToast(`Password reset link sent to ${email} (Demo Mode)!`, 'info');
      window.switchAuthTab('login');
    }
  };

  // Sign Out
  window.handleFirebaseSignOut = async function() {
    if (window.firebaseAuth) {
      try {
        await firebase.auth().signOut();
        showToast('লগআউট সফল হয়েছে (Signed out successfully).', 'info');
        window.closeAuthModal();
      } catch (error) {
        showToast(error.message, 'error');
      }
    } else {
      showToast('Signed out (Demo Mode)', 'info');
      window.closeAuthModal();
    }
  };

  // Auth State Observer
  function updateAuthStateUI(user) {
    const loggedInView = document.getElementById('auth-logged-in-view');
    const loggedOutView = document.getElementById('auth-logged-out-view');
    const userPhoto = document.getElementById('auth-user-photo');
    const userInitial = document.getElementById('auth-user-initial');
    const userName = document.getElementById('auth-user-name');
    const userEmail = document.getElementById('auth-user-email');
    const userProvider = document.getElementById('auth-user-provider');
    const authHeading = document.getElementById('auth-modal-heading');
    const authSubheading = document.getElementById('auth-modal-subheading');

    if (user) {
      loggedInView?.classList.remove('hidden');
      loggedOutView?.classList.add('hidden');

      const name = user.displayName || user.email.split('@')[0];
      if (userName) userName.textContent = name;
      if (userEmail) userEmail.textContent = user.email;
      if (authHeading) authHeading.textContent = `Assalamualaikum, ${name}!`;
      if (authSubheading) authSubheading.textContent = 'You are currently signed in to your Musafir account';

      const isGoogle = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
      if (userProvider) {
        userProvider.textContent = isGoogle ? '✓ Signed In via Google' : '✓ Signed In via Email';
      }

      if (user.photoURL && userPhoto) {
        userPhoto.src = user.photoURL;
        userPhoto.classList.remove('hidden');
        userInitial?.classList.add('hidden');
      } else if (userInitial) {
        userInitial.textContent = (name[0] || 'M').toUpperCase();
        userInitial.classList.remove('hidden');
        userPhoto?.classList.add('hidden');
      }

      // Update header buttons with user name & indicator
      document.querySelectorAll('.open-auth-btn').forEach(btn => {
        btn.setAttribute('title', `Logged in as ${name}`);
        btn.classList.add('text-[#D6A63A]');
        if (!btn.querySelector('.auth-online-dot')) {
          const dot = document.createElement('span');
          dot.className = 'auth-online-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#081018]';
          btn.style.position = 'relative';
          btn.appendChild(dot);
        }
      });
    } else {
      loggedInView?.classList.add('hidden');
      loggedOutView?.classList.remove('hidden');
      if (authHeading) authHeading.textContent = 'Welcome to Musafir';
      if (authSubheading) authSubheading.textContent = 'Access your orders, wishlist, and exclusive Islamic offerings';

      document.querySelectorAll('.open-auth-btn').forEach(btn => {
        btn.setAttribute('title', 'User Account');
        btn.classList.remove('text-[#D6A63A]');
        btn.querySelector('.auth-online-dot')?.remove();
      });
    }
  }

  // Hook Firebase Auth listener
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().onAuthStateChanged(user => {
        updateAuthStateUI(user);
      });
    } catch (e) {
      console.warn("Auth state observer warning:", e);
    }
  }
}

/* ==========================================================================
   Global Toast Notification
   ========================================================================== */
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border ${
    type === 'success' ? 'bg-[#081018] text-[#F3D58A] border-[#D6A63A]' :
    type === 'warning' ? 'bg-[#843d15] text-white border-amber-500' :
    type === 'error' ? 'bg-red-950 text-red-200 border-red-700' :
    'bg-[#081018] text-white border-gray-700'
  }`;

  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span class="font-bold text-base text-[#D6A63A]">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

/* ==========================================================================
   Global Add To Cart Helper
   ========================================================================== */
window.handleAddToCart = async function(productId, qty = 1) {
  const item = await window.musafirDB.getItemById(productId);
  if (!item) return;

  const isOutOfStock = item.inStock === false || (typeof item.stockQuantity === 'number' && item.stockQuantity <= 0);
  const lang = window.i18n.getLang();

  if (isOutOfStock) {
    showToast(lang === 'bn' ? 'দুঃখিত, এই পণ্যটির স্টক শেষ!' : 'Sorry, this product is currently out of stock!', 'warning');
    return;
  }

  window.musafirDB.addToCart(item, qty);
  const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
  const msg = lang === 'bn' 
    ? `"${title}" কার্টে যোগ করা হয়েছে` 
    : `"${title}" added to cart`;
  showToast(msg, 'success');
};

/* ==========================================================================
   Global Direct WhatsApp "Buy Now" Helper
   ========================================================================== */
window.handleDirectBuyNow = async function(productId) {
  let item = null;
  if (window.musafirDB && window.musafirDB.getItemById) {
    item = await window.musafirDB.getItemById(productId);
  }
  if (!item && window.SEED_PRODUCTS) {
    item = window.SEED_PRODUCTS.find(p => p.id === productId);
  }
  if (!item) {
    console.error("Product not found for Buy Now:", productId);
    return;
  }

  const isOutOfStock = item.inStock === false || (typeof item.stockQuantity === 'number' && item.stockQuantity <= 0);
  const lang = (window.i18n && window.i18n.getLang) ? window.i18n.getLang() : 'en';
  const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
  const price = item.price ? item.price.toLocaleString() : '0';
  const phone = (window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || "8801577696391";
  
  // Clean product URL
  const itemUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/item-details.html?id=${encodeURIComponent(item.id)}`;

  let message = "";
  if (isOutOfStock) {
    if (lang === 'bn') {
      message = `*আসসালামু আলাইকুম MUSAFIR, আমি এই পণ্যটি প্রি-অর্ডার (Pre-order) করতে চাই:*\n\n` +
                `• পণ্য: *${title}*\n` +
                `• মূল্য: *৳${price}*\n` +
                `• প্রোডাক্ট লিঙ্ক: ${itemUrl}\n\n` +
                `পণ্যটি কবে স্টকে আসবে অনুগ্রহ করে জানাবেন? জাযাকাল্লাহু খাইরান!`;
    } else {
      message = `*Assalamualaikum MUSAFIR, I would like to pre-order this out-of-stock product:*\n\n` +
                `• Product: *${title}*\n` +
                `• Price: *৳${price}*\n` +
                `• Product Link: ${itemUrl}\n\n` +
                `Please let me know when it will be restocked. Jazakallahu Khair!`;
    }
  } else {
    if (lang === 'bn') {
      message = `*আসসালামু আলাইকুম MUSAFIR, আমি এই পণ্যটি সরাসরি কিনতে চাই (Buy Now):*\n\n` +
                `• পণ্য: *${title}*\n` +
                `• মূল্য: *৳${price}*\n` +
                `• পরিমাণ: *১ টি*\n` +
                `• প্রোডাক্ট লিঙ্ক: ${itemUrl}\n\n` +
                `দয়া করে আমার ডেলিভারির তথ্য নিয়ে অর্ডারটি কনফার্ম করুন। জাযাকাল্লাহু খাইরান!`;
    } else {
      message = `*Assalamualaikum MUSAFIR, I would like to buy this product directly (Buy Now):*\n\n` +
                `• Product: *${title}*\n` +
                `• Price: *৳${price}*\n` +
                `• Quantity: *1 item*\n` +
                `• Product Link: ${itemUrl}\n\n` +
                `Please proceed with my delivery details to confirm the order. Jazakallahu Khair!`;
    }
  }

  showToast(lang === 'bn' ? 'হোয়াটসঅ্যাপে রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting to WhatsApp...', 'info');
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
};

/* ==========================================================================
   Home Featured Products Dynamic Renderer ("Popular Picks")
   ========================================================================== */
async function renderHomeFeatured() {
  const container = document.getElementById('home-featured-grid');
  if (!container) return;

  const allItems = await window.musafirDB.getItems('all');
  
  // Filter products explicitly marked as Popular
  let featured = allItems.filter(item => item.isPopular === true || item.isPopular === 'true');

  // Fallback: If no products are marked popular, fallback to first 4 items
  if (featured.length === 0) {
    featured = allItems.slice(0, 4);
  }

  const lang = window.i18n.getLang();

  if (featured.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-gray-400">
        <p class="text-sm font-semibold">${lang === 'bn' ? 'কোনো জনপ্রিয় পণ্য পাওয়া যায়নি' : 'No popular products found'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = featured.map(item => {
    const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
    const isOutOfStock = item.inStock === false || (typeof item.stockQuantity === 'number' && item.stockQuantity <= 0);
    return `
      <div class="product-card rounded-xl overflow-hidden flex flex-col justify-between group ${isOutOfStock ? 'opacity-90' : ''}">
        <div class="relative overflow-hidden aspect-[4/3] bg-gray-100">
          <a href="item-details.html?id=${item.id}" class="block w-full h-full">
            <img src="${item.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </a>
          ${isOutOfStock ? `
            <span class="absolute top-2.5 left-2.5 bg-red-700 text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded shadow">
              ${lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
            </span>
          ` : item.isPopular ? `
            <span class="absolute top-2.5 left-2.5 bg-[#D6A63A] text-[#081018] text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded shadow">
              Popular
            </span>
          ` : ''}
          ${item.originalPrice ? `
            <span class="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              -৳${item.originalPrice - item.price}
            </span>
          ` : ''}
          ${!isOutOfStock && typeof item.stockQuantity === 'number' && item.stockQuantity > 0 && item.stockQuantity <= 5 ? `
            <span class="absolute bottom-2.5 left-2.5 bg-amber-600/95 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow backdrop-blur-sm">
              ${lang === 'bn' ? `মাত্র ${item.stockQuantity} টি বাকি!` : `Only ${item.stockQuantity} left!`}
            </span>
          ` : ''}
        </div>
        <div class="p-3.5 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            <a href="item-details.html?id=${item.id}" class="block">
              <h3 class="text-sm sm:text-base font-semibold text-[#171717] group-hover:text-[#D6A63A] transition line-clamp-1">${title}</h3>
            </a>
            <div class="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
              <span class="text-base sm:text-lg font-bold text-[#171717]">৳ ${item.price.toLocaleString()}</span>
              ${item.originalPrice ? `<span class="text-[11px] sm:text-xs text-gray-400 line-through">৳ ${item.originalPrice.toLocaleString()}</span>` : ''}
            </div>
          </div>
          <div class="mt-3 sm:mt-4">
            ${isOutOfStock ? `
              <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                <button disabled class="py-2 sm:py-2.5 px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
                  <span>${lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                </button>
                <button onclick="handleDirectBuyNow('${item.id}')" class="py-2 sm:py-2.5 px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 bg-[#25D366]/20 text-[#171717] hover:bg-[#25D366] hover:text-white border border-[#25D366]/40 transition" title="Pre-order via WhatsApp">
                  <span>${lang === 'bn' ? 'প্রি-অর্ডার' : 'Pre-order'}</span>
                </button>
              </div>
            ` : `
              <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                <button onclick="handleAddToCart('${item.id}')" class="btn-navy py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#030609] transition" title="Add to Cart">
                  <svg class="w-3.5 h-3.5 text-[#D6A63A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  <span class="truncate">${lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
                </button>
                <button onclick="handleDirectBuyNow('${item.id}')" class="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm transition" title="Buy Now via WhatsApp">
                  <svg class="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  <span class="truncate">${lang === 'bn' ? 'Buy Now' : 'Buy Now'}</span>
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
