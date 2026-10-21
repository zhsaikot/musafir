/**
 * MUSAFIR - Single Product Details Controller (item-details.js)
 * Enhanced with Multiple Image Gallery Switcher, Live Stock Status & Highlights Points
 */

document.addEventListener('DOMContentLoaded', async () => {
  initItemDetails();
});

let currentItem = null;
let selectedQuantity = 1;

async function initItemDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'p1';

  currentItem = await window.musafirDB.getItemById(id);
  if (!currentItem) {
    const items = await window.musafirDB.getItems('all');
    currentItem = items[0];
  }

  renderProductDetails();
  renderRelatedProducts();

  window.addEventListener('musafir:lang-changed', () => {
    renderProductDetails();
    renderRelatedProducts();
  });
}

function renderProductDetails() {
  if (!currentItem) return;
  const lang = window.i18n.getLang();

  const title = lang === 'bn' ? (currentItem.title_bn || currentItem.title_en) : (currentItem.title_en || currentItem.title_bn);
  const categoryName = lang === 'bn' ? (currentItem.category_bn || '') : (currentItem.category_en || '');
  const shortDesc = lang === 'bn' ? (currentItem.shortDesc_bn || currentItem.shortDesc_en) : (currentItem.shortDesc_en || currentItem.shortDesc_bn);
  const desc = lang === 'bn' ? (currentItem.desc_bn || currentItem.desc_en) : (currentItem.desc_en || currentItem.desc_bn);

  // Update Page Title
  document.title = `${title} — MUSAFIR Islamic Lifestyle`;

  // Gallery Setup
  const mainImageEl = document.getElementById('product-main-image');
  const thumbsContainer = document.getElementById('product-thumbnails-container');
  if (mainImageEl) mainImageEl.src = currentItem.image;

  if (thumbsContainer) {
    const gallery = (currentItem.gallery && currentItem.gallery.length > 0) ? currentItem.gallery : [currentItem.image];
    thumbsContainer.innerHTML = gallery.map((imgUrl, i) => `
      <button onclick="switchMainImage('${imgUrl}', this)" class="thumb-btn border-2 ${i === 0 ? 'border-[#D6A63A] ring-2 ring-[#D6A63A]/20 scale-105' : 'border-gray-200 opacity-80 hover:opacity-100'} rounded-xl overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 transition-all duration-200 bg-white shadow-sm">
        <img src="${imgUrl}" alt="Thumbnail ${i + 1}" class="w-full h-full object-cover">
      </button>
    `).join('');
  }

  // Titles, breadcrumbs & category
  const titleEl = document.getElementById('product-title');
  const breadcrumbEl = document.getElementById('breadcrumb-product-title');
  const catEl = document.getElementById('product-category-name');
  if (titleEl) titleEl.textContent = title;
  if (breadcrumbEl) breadcrumbEl.textContent = title;
  if (catEl) catEl.textContent = categoryName;

  // Prices
  const priceEl = document.getElementById('product-price');
  const originalPriceEl = document.getElementById('product-original-price');
  if (priceEl) priceEl.textContent = `৳ ${currentItem.price.toLocaleString()}`;
  if (originalPriceEl) {
    if (currentItem.originalPrice) {
      originalPriceEl.textContent = `৳ ${currentItem.originalPrice.toLocaleString()}`;
      originalPriceEl.classList.remove('hidden');
    } else {
      originalPriceEl.classList.add('hidden');
    }
  }

  // Stock Status & Stock Quantity Handling
  const isAvailable = currentItem.inStock !== false && (currentItem.stockQuantity === undefined || currentItem.stockQuantity > 0);
  const stockQty = currentItem.stockQuantity !== undefined ? currentItem.stockQuantity : 25;

  const stockBadge = document.getElementById('product-stock-badge');
  const stockDot = document.getElementById('stock-badge-dot');
  const stockText = document.getElementById('stock-badge-text');
  const outOfStockOverlay = document.getElementById('product-out-of-stock-overlay');
  const addToCartBtn = document.getElementById('detail-add-to-cart-btn');
  const addToCartText = document.getElementById('add-to-cart-text');
  const waBtnText = document.getElementById('wa-btn-text');
  const qtyControlRow = document.getElementById('quantity-control-row');

  if (isAvailable) {
    stockBadge?.classList.remove('bg-red-50', 'text-red-700', 'border-red-200');
    stockBadge?.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
    stockDot?.classList.remove('bg-red-500');
    stockDot?.classList.add('bg-emerald-500');
    if (stockText) {
      stockText.textContent = lang === 'bn' 
        ? `স্টকে আছে (${stockQty} টি অবশিষ্ট)` 
        : `In Stock (${stockQty} available)`;
    }
    outOfStockOverlay?.classList.add('hidden');

    if (addToCartBtn) {
      addToCartBtn.disabled = false;
      addToCartBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (addToCartText) {
      addToCartText.textContent = lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart';
    }
    if (waBtnText) {
      waBtnText.textContent = lang === 'bn' ? 'অর্ডার করুন (WhatsApp)' : 'Order via WhatsApp';
    }
    if (qtyControlRow) {
      qtyControlRow.classList.remove('opacity-40', 'pointer-events-none');
    }
  } else {
    // Out of Stock state
    stockBadge?.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
    stockBadge?.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
    stockDot?.classList.remove('bg-emerald-500');
    stockDot?.classList.add('bg-red-500');
    if (stockText) {
      stockText.textContent = lang === 'bn' ? 'স্টক শেষ (Out of Stock)' : 'Out of Stock';
    }
    outOfStockOverlay?.classList.remove('hidden');

    if (addToCartBtn) {
      addToCartBtn.disabled = true;
      addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    if (addToCartText) {
      addToCartText.textContent = lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock';
    }
    if (waBtnText) {
      waBtnText.textContent = lang === 'bn' ? 'প্রি-অর্ডার অনুসন্ধান (WhatsApp)' : 'Pre-order via WhatsApp';
    }
    if (qtyControlRow) {
      qtyControlRow.classList.add('opacity-40', 'pointer-events-none');
    }
  }

  // Short & Full Description
  const shortDescEl = document.getElementById('product-short-desc');
  const descEl = document.getElementById('product-full-desc');
  if (shortDescEl) shortDescEl.textContent = shortDesc;
  if (descEl) descEl.textContent = desc;

  // Key Highlights (Bullet Points)
  const highlightsList = document.getElementById('product-highlights-list');
  const highlightsHeading = document.getElementById('highlights-heading');
  if (highlightsHeading) {
    highlightsHeading.textContent = lang === 'bn' ? 'বিশেষ সুবিধাসমূহ / কেন এই পণ্যটি সেরা?' : 'Key Highlights & Features';
  }

  if (highlightsList) {
    const points = (lang === 'bn' ? currentItem.highlights_bn : currentItem.highlights_en) || 
      (currentItem.highlights_en || currentItem.highlights_bn) || [
        lang === 'bn' ? '১০০% অরিজিনাল ও হালাল সার্টিফায়েড কোয়ালিটি' : '100% Authentic Halal-Certified Quality',
        lang === 'bn' ? 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে' : 'Cash on Delivery Available Nationwide',
        lang === 'bn' ? '৭ দিনের সহজ পরিবর্তন বা রিটার্ন সুবিধা' : '7 Days Easy Return & Replacement Guarantee',
        lang === 'bn' ? 'প্রিয়জনের জন্য উপহার উপযোগী বিশেষ বাঁধাই' : 'Artisanal Packaging Perfect for Gifting'
      ];

    highlightsList.innerHTML = points.map(pt => `
      <li class="flex items-start gap-2.5">
        <span class="w-4 h-4 rounded-full bg-[#D6A63A]/20 text-[#D6A63A] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</span>
        <span class="text-xs sm:text-sm text-gray-700 leading-snug">${pt}</span>
      </li>
    `).join('');
  }

  // Specifications Table
  const specsContainer = document.getElementById('product-specs-list');
  if (specsContainer && currentItem.specs) {
    specsContainer.innerHTML = Object.entries(currentItem.specs).map(([k, v]) => `
      <div class="flex py-2.5 border-b border-gray-100 text-sm">
        <span class="w-1/3 text-gray-500 font-medium">${k}</span>
        <span class="w-2/3 text-[#171717] font-semibold">${v}</span>
      </div>
    `).join('');
  }

  updateQuantityDisplay();
}

window.switchMainImage = (url, btnEl) => {
  const mainImageEl = document.getElementById('product-main-image');
  if (mainImageEl) {
    mainImageEl.style.opacity = '0.3';
    setTimeout(() => {
      mainImageEl.src = url;
      mainImageEl.style.opacity = '1';
    }, 150);
  }

  document.querySelectorAll('.thumb-btn').forEach(b => {
    b.classList.remove('border-[#D6A63A]', 'ring-2', 'ring-[#D6A63A]/20', 'scale-105');
    b.classList.add('border-gray-200', 'opacity-80');
  });
  btnEl?.classList.remove('border-gray-200', 'opacity-80');
  btnEl?.classList.add('border-[#D6A63A]', 'ring-2', 'ring-[#D6A63A]/20', 'scale-105');
};

window.adjustDetailQty = (delta) => {
  const isAvailable = currentItem.inStock !== false && (currentItem.stockQuantity === undefined || currentItem.stockQuantity > 0);
  if (!isAvailable) return;
  const maxStock = currentItem.stockQuantity || 99;
  selectedQuantity = Math.max(1, Math.min(maxStock, selectedQuantity + delta));
  updateQuantityDisplay();
};

function updateQuantityDisplay() {
  const qtyEl = document.getElementById('detail-qty-display');
  const totalSubEl = document.getElementById('detail-total-subtotal');
  if (qtyEl) qtyEl.textContent = selectedQuantity;
  if (totalSubEl && currentItem) {
    totalSubEl.textContent = `৳ ${(currentItem.price * selectedQuantity).toLocaleString()}`;
  }
}

window.addDetailToCart = () => {
  if (!currentItem) return;
  const isAvailable = currentItem.inStock !== false && (currentItem.stockQuantity === undefined || currentItem.stockQuantity > 0);
  if (!isAvailable) {
    showToast(window.i18n.getLang() === 'bn' ? 'পণ্যটি বর্তমানে স্টকে নেই' : 'This product is currently out of stock', 'warning');
    return;
  }
  window.handleAddToCart(currentItem.id, selectedQuantity);
};

window.orderDetailViaWhatsApp = () => {
  if (!currentItem) return;
  const lang = window.i18n.getLang();
  const title = lang === 'bn' ? (currentItem.title_bn || currentItem.title_en) : (currentItem.title_en || currentItem.title_bn);
  const total = currentItem.price * selectedQuantity;
  const isAvailable = currentItem.inStock !== false && (currentItem.stockQuantity === undefined || currentItem.stockQuantity > 0);

  let msg = "";
  if (isAvailable) {
    if (lang === 'bn') {
      msg = `*সালামু আলাইকুম MUSAFIR, আমি এই পণ্যটি অর্ডার করতে চাই:*\n\n` +
            `• পণ্য: *${title}*\n` +
            `• পরিমাণ: *${selectedQuantity} টি*\n` +
            `• একক মূল্য: ৳${currentItem.price.toLocaleString()}\n` +
            `• সর্বমোট মূল্য: *৳${total.toLocaleString()}*\n\n` +
            `দয়া করে আমার ডেলিভারি ও পেমেন্ট কনফার্মেশনের জন্য যোগাযোগ করুন।`;
    } else {
      msg = `*Salam MUSAFIR, I would like to order:*\n\n` +
            `• Product: *${title}*\n` +
            `• Quantity: *${selectedQuantity}*\n` +
            `• Unit Price: ৳${currentItem.price.toLocaleString()}\n` +
            `• Total Price: *৳${total.toLocaleString()}*\n\n` +
            `Please proceed with my order details.`;
    }
  } else {
    // Pre-order message
    if (lang === 'bn') {
      msg = `*সালামু আলাইকুম MUSAFIR, আমি এই পণ্যটির প্রি-অর্ডার করতে চাই (স্টক রিস্টক হলে জানাবেন):*\n\n` +
            `• পণ্য: *${title}*\n` +
            `• আনুমানিক মূল্য: ৳${currentItem.price.toLocaleString()}\n\n` +
            `পণ্যটি কবে স্টকে আসবে অনুগ্রহ করে জানাবেন? জাযাকাল্লাহু খাইরান!`;
    } else {
      msg = `*Salam MUSAFIR, I would like to pre-order this out-of-stock item:*\n\n` +
            `• Product: *${title}*\n` +
            `• Price: ৳${currentItem.price.toLocaleString()}\n\n` +
            `Please let me know when it will be restocked. Jazakallahu Khair!`;
    }
  }

  const phone = window.STORE_CONFIG.whatsappNumber || "8801700000000";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
};

async function renderRelatedProducts() {
  const container = document.getElementById('related-products-grid');
  if (!container || !currentItem) return;

  const allItems = await window.musafirDB.getItems('all');
  const related = allItems
    .filter(i => i.id !== currentItem.id)
    .slice(0, 4);

  const lang = window.i18n.getLang();
  container.innerHTML = related.map(item => {
    const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
    const isAvail = item.inStock !== false && (item.stockQuantity === undefined || item.stockQuantity > 0);
    return `
      <div class="product-card rounded-xl overflow-hidden flex flex-col justify-between group">
        <a href="item-details.html?id=${item.id}" class="block overflow-hidden aspect-[4/3] bg-gray-100 relative">
          <img src="${item.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          ${!isAvail ? `
            <span class="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Out of Stock
            </span>
          ` : ''}
        </a>
        <div class="p-4 flex flex-col flex-1 justify-between">
          <div>
            <a href="item-details.html?id=${item.id}">
              <h4 class="text-sm font-semibold text-[#171717] group-hover:text-[#D6A63A] transition line-clamp-1">${title}</h4>
            </a>
            <p class="text-base font-bold text-[#171717] mt-1">৳ ${item.price.toLocaleString()}</p>
          </div>
          <div class="mt-3">
            ${!isAvail ? `
              <div class="grid grid-cols-2 gap-1.5">
                <button disabled class="py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
                  <span>${lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                </button>
                <button onclick="handleDirectBuyNow('${item.id}')" class="py-2 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 bg-[#25D366]/20 text-[#171717] hover:bg-[#25D366] hover:text-white border border-[#25D366]/40 transition" title="Pre-order via WhatsApp">
                  <span>${lang === 'bn' ? 'প্রি-অর্ডার' : 'Pre-order'}</span>
                </button>
              </div>
            ` : `
              <div class="grid grid-cols-2 gap-1.5">
                <button onclick="handleAddToCart('${item.id}')" class="btn-navy py-2 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#030609] transition" title="Add to Cart">
                  <svg class="w-3.5 h-3.5 text-[#D6A63A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  <span class="truncate">${lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
                </button>
                <button onclick="handleDirectBuyNow('${item.id}')" class="py-2 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm transition" title="Buy Now via WhatsApp">
                  <svg class="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.302c-.087.087-.179.182-.077.357.101.174.449.741.964 1.2.662.59 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.073.043.419-.101.824z"/></svg>
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
