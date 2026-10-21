/**
 * MUSAFIR - Shop Page Controller (shop.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  initShop();
});

let currentCategory = 'all';
let currentSort = 'featured';
let currentSearch = '';

async function initShop() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    currentCategory = categoryParam;
  }

  setupCategoryFilters();
  setupSortFilter();
  setupSearchInput();
  renderProducts();

  window.addEventListener('musafir:lang-changed', () => {
    setupCategoryFilters();
    renderProducts();
  });

  window.addEventListener('musafir:products-updated', () => {
    renderProducts();
  });

  window.addEventListener('musafir:categories-updated', () => {
    setupCategoryFilters();
    renderProducts();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'musafir_products' || e.key === 'musafir_categories') {
      setupCategoryFilters();
      renderProducts();
    }
  });
}

async function setupCategoryFilters() {
  const container = document.getElementById('shop-category-filters');
  if (!container) return;

  const categories = await window.musafirDB.getCategories();
  const lang = window.i18n.getLang();

  let html = `
    <button onclick="setCategory('all')" class="category-pill px-4 py-2 rounded-full text-xs font-semibold border transition ${currentCategory === 'all' ? 'bg-[#081018] text-[#F3D58A] border-[#D6A63A]' : 'bg-white text-gray-700 border-[#DED7C8] hover:border-[#D6A63A]'}">
      ${lang === 'bn' ? 'সকল পণ্য' : 'All Products'}
    </button>
  `;

  categories.forEach(cat => {
    const name = lang === 'bn' ? cat.name_bn : cat.name_en;
    const isActive = currentCategory === cat.id;
    html += `
      <button onclick="setCategory('${cat.id}')" class="category-pill px-4 py-2 rounded-full text-xs font-semibold border transition ${isActive ? 'bg-[#081018] text-[#F3D58A] border-[#D6A63A]' : 'bg-white text-gray-700 border-[#DED7C8] hover:border-[#D6A63A]'}">
        ${name}
      </button>
    `;
  });

  container.innerHTML = html;
}

window.setCategory = (catId) => {
  currentCategory = catId;
  setupCategoryFilters();
  renderProducts();
};

function setupSortFilter() {
  const sortSelect = document.getElementById('shop-sort-select');
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });
}

function setupSearchInput() {
  const input = document.getElementById('shop-search-input');
  input?.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });
}

async function renderProducts() {
  const grid = document.getElementById('shop-products-grid');
  const countDisplay = document.getElementById('shop-items-count');
  if (!grid) return;

  grid.innerHTML = `
    <div class="col-span-full py-16 text-center text-gray-400">
      <div class="w-8 h-8 border-2 border-[#D6A63A] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p class="text-xs">পণ্য লোড হচ্ছে / Loading products...</p>
    </div>
  `;

  let items = await window.musafirDB.getItems(currentCategory);

  // Search filter
  if (currentSearch) {
    items = items.filter(item => {
      const en = (item.title_en || '').toLowerCase();
      const bn = (item.title_bn || '').toLowerCase();
      return en.includes(currentSearch) || bn.includes(currentSearch);
    });
  }

  // Sorting
  if (currentSort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'name') {
    items.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
  } else {
    // featured: isPopular first
    items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }

  if (countDisplay) {
    const lang = window.i18n.getLang();
    countDisplay.textContent = lang === 'bn' 
      ? `মোট ${items.length} টি পণ্য পাওয়া গেছে` 
      : `Showing ${items.length} products`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-gray-400">
        <p class="text-base font-semibold text-gray-600">কোনো পণ্য খুঁজে পাওয়া যায়নি</p>
        <p class="text-xs text-gray-400 mt-1">অন্য কোনো ক্যাটাগরি অথবা সার্চ কি-ওয়ার্ড চেষ্টা করুন।</p>
      </div>
    `;
    return;
  }

  const lang = window.i18n.getLang();
  grid.innerHTML = items.map(item => {
    const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
    const categoryName = lang === 'bn' ? (item.category_bn || '') : (item.category_en || '');
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
        
        <div class="p-3 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            <span class="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium">${categoryName}</span>
            <a href="item-details.html?id=${item.id}" class="block mt-0.5 sm:mt-1">
              <h3 class="text-sm sm:text-base font-semibold text-[#171717] group-hover:text-[#D6A63A] transition line-clamp-1">${title}</h3>
            </a>
            <div class="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
              <span class="text-base sm:text-lg font-bold text-[#171717]">৳ ${item.price.toLocaleString()}</span>
              ${item.originalPrice ? `<span class="text-[11px] sm:text-xs text-gray-400 line-through">৳ ${item.originalPrice.toLocaleString()}</span>` : ''}
            </div>
          </div>

          <div class="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100">
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
