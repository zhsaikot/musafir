/**
 * MUSAFIR - Admin Panel Controller (admin.js)
 * Comprehensive Product & Category Management
 * Includes: Multi-image Gallery, Stock Quantity & Status Toggle, Key Highlights, and Category Editor
 */

document.addEventListener('DOMContentLoaded', async () => {
  await populateCategoryDropdown();
  await renderAdminProducts();
  await setupAdminStats();
  setupProductModalEvents();
  setupCategoryModalEvents();
  setupSearchFilterEvents();
});

let currentEditingProductId = null;
let currentEditingCategoryId = null;

/* ==========================================================================
   Admin Overview Statistics
   ========================================================================== */
async function setupAdminStats() {
  const items = await window.musafirDB.getItems('all');
  const categories = await window.musafirDB.getCategories();
  const totalValue = items.reduce((sum, i) => sum + (i.price * (i.stockQuantity || 1)), 0);
  const inStockCount = items.filter(i => i.inStock !== false && (i.stockQuantity === undefined || i.stockQuantity > 0)).length;
  const outOfStockCount = items.length - inStockCount;

  const totalEl = document.getElementById('stat-total-products');
  const catEl = document.getElementById('stat-total-categories');
  const valEl = document.getElementById('stat-total-value');
  const inStockEl = document.getElementById('stat-in-stock');
  const outStockEl = document.getElementById('stat-out-stock');

  if (totalEl) totalEl.textContent = items.length;
  if (catEl) catEl.textContent = categories.length;
  if (valEl) valEl.textContent = `৳ ${totalValue.toLocaleString()}`;
  if (inStockEl) inStockEl.textContent = inStockCount;
  if (outStockEl) outStockEl.textContent = outOfStockCount;
}

/* ==========================================================================
   Products Table Rendering & Filter
   ========================================================================== */
async function renderAdminProducts(filterQuery = '', filterStock = 'all') {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  let items = await window.musafirDB.getItems('all');

  // Search filter
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    items = items.filter(i => 
      (i.title_en || '').toLowerCase().includes(q) || 
      (i.title_bn || '').toLowerCase().includes(q) ||
      (i.category_en || '').toLowerCase().includes(q)
    );
  }

  // Stock filter
  if (filterStock === 'in-stock') {
    items = items.filter(i => i.inStock !== false && (i.stockQuantity === undefined || i.stockQuantity > 0));
  } else if (filterStock === 'out-stock') {
    items = items.filter(i => i.inStock === false || i.stockQuantity === 0);
  }

  if (items.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-gray-400">
          <p class="text-sm font-semibold">কোনো পণ্য খুঁজে পাওয়া যায়নি / No products found</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = items.map((item, index) => {
    const isAvailable = item.inStock !== false && (item.stockQuantity === undefined || item.stockQuantity > 0);
    const stockQty = item.stockQuantity !== undefined ? item.stockQuantity : 10;
    const galleryCount = (item.gallery && item.gallery.length > 0) ? item.gallery.length : 1;

    return `
      <tr class="border-b border-gray-100 hover:bg-gray-50/80 transition">
        <td class="py-3 px-4 text-xs text-gray-400 font-mono">${index + 1}</td>
        
        <!-- Product Details with Thumbnail & Gallery Badge -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <div class="relative w-14 h-14 rounded-lg overflow-hidden border border-[#DED7C8] flex-shrink-0 bg-gray-100">
              <img src="${item.image}" alt="${item.title_en}" class="w-full h-full object-cover">
              ${galleryCount > 1 ? `
                <span class="absolute bottom-0 right-0 bg-[#081018]/85 text-[#F3D58A] text-[9px] font-bold px-1 rounded-tl" title="${galleryCount} images in gallery">
                  📸 ${galleryCount}
                </span>
              ` : ''}
            </div>
            <div>
              <div class="font-semibold text-sm text-[#171717] line-clamp-1">${item.title_en}</div>
              <div class="text-xs text-gray-500 font-bn line-clamp-1">${item.title_bn || ''}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">${item.slug || item.id}</div>
            </div>
          </div>
        </td>

        <!-- Category -->
        <td class="py-3 px-4 text-xs font-semibold text-gray-600">
          <span class="inline-block px-2 py-1 rounded bg-[#F7F1E4] text-[#171717] border border-[#DED7C8]">
            ${item.category_en || item.category}
          </span>
        </td>

        <!-- Price -->
        <td class="py-3 px-4 text-sm font-bold text-[#171717]">
          ৳ ${item.price.toLocaleString()}
          ${item.originalPrice ? `<span class="block text-xs font-normal text-gray-400 line-through">৳ ${item.originalPrice.toLocaleString()}</span>` : ''}
        </td>

        <!-- Popular Toggle -->
        <td class="py-3 px-4 text-center">
          <button onclick="togglePopularStatus('${item.id}')" class="px-2.5 py-1 rounded-full text-[11px] font-bold transition ${item.isPopular ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 hover:text-gray-700'}">
            ${item.isPopular ? '★ Popular' : '☆ Standard'}
          </button>
        </td>

        <!-- Stock Status Toggle & Quantity -->
        <td class="py-3 px-4 text-center">
          <button onclick="toggleStockStatus('${item.id}')" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
            isAvailable 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
              : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
          }">
            <span class="w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}"></span>
            <span>${isAvailable ? `In Stock (${stockQty})` : 'Out of Stock'}</span>
          </button>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right space-x-3">
          <button onclick="openProductModal('${item.id}')" class="text-xs font-semibold text-[#081018] hover:text-[#D6A63A] transition">Edit</button>
          <button onclick="deleteProduct('${item.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 transition">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   Quick Actions: Stock Toggle & Popular Toggle
   ========================================================================== */
window.toggleStockStatus = async (id) => {
  const item = await window.musafirDB.getItemById(id);
  if (!item) return;

  const currentStatus = item.inStock !== false && (item.stockQuantity === undefined || item.stockQuantity > 0);
  item.inStock = !currentStatus;
  if (!item.inStock) {
    item.stockQuantity = 0;
  } else if (!item.stockQuantity || item.stockQuantity <= 0) {
    item.stockQuantity = 20; // Default restore count
  }

  await window.musafirDB.saveItem(item);
  await renderAdminProducts();
  await setupAdminStats();
  showToast(item.inStock ? `"${item.title_en}" is now In Stock` : `"${item.title_en}" marked as Out of Stock`, 'info');
};

window.togglePopularStatus = async (id) => {
  const item = await window.musafirDB.getItemById(id);
  if (!item) return;
  item.isPopular = !item.isPopular;
  await window.musafirDB.saveItem(item);
  await renderAdminProducts();
  await setupAdminStats();
  const lang = window.i18n ? window.i18n.getLang() : 'bn';
  const statusMsg = item.isPopular 
    ? (lang === 'bn' ? `"${item.title_bn || item.title_en}" জনপ্রিয় (Popular) করা হয়েছে — হোমপেজে দেখাবে` : `"${item.title_en}" marked as Popular (Shown on homepage)`)
    : (lang === 'bn' ? `"${item.title_bn || item.title_en}" সাধারণ (Standard) করা হয়েছে — হোমপেজ থেকে সরানো হয়েছে` : `"${item.title_en}" marked as Standard (Removed from Popular Picks)`);
  showToast(statusMsg, 'success');
};

window.deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await window.musafirDB.deleteItem(id);
    await renderAdminProducts();
    await setupAdminStats();
    showToast('Product deleted successfully', 'info');
  }
};

window.resetSeedData = () => {
  if (confirm('Reset catalog back to initial default Islamic lifestyle items? All custom changes will be restored to seed state.')) {
    window.musafirDB.resetToDefaults();
    renderAdminProducts();
    setupAdminStats();
    populateCategoryDropdown();
    showToast('Catalog restored to default seed data!', 'success');
  }
};

window.syncCatalogToFirebase = async () => {
  if (!window.firebaseFirestore) {
    showToast("Firebase SDK লোড হচ্ছে... অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।", "warning");
    return;
  }
  try {
    showToast("ফায়ারবেস ক্লাউডে প্রোডাক্ট ও ক্যাটাগরি সিঙ্ক হচ্ছে...", "info");
    const items = await window.musafirDB.getItems('all');
    const categories = await window.musafirDB.getCategories();

    // Batch upload categories
    for (const cat of categories) {
      await window.firebaseFirestore.collection('categories').doc(cat.id).set(cat, { merge: true });
    }
    // Batch upload products
    for (const item of items) {
      await window.firebaseFirestore.collection('products').doc(item.id).set(item, { merge: true });
    }

    localStorage.setItem('musafir_firestore_active', 'true');
    window.IS_FIRESTORE_PROVISIONED = true;

    const banner = document.getElementById('admin-storage-banner');
    if (banner) {
      banner.className = 'mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 shadow-sm';
      banner.innerHTML = `
        <span class="text-emerald-600 text-lg">✓</span>
        <div class="text-xs text-emerald-900 leading-relaxed">
          <strong>ফায়ারবেস ক্লাউড সক্রিয় ও সংযুক্ত!</strong> আপনার সবকটি প্রোডাক্ট এবং ক্যাটাগরি ক্লাউড ফায়ারস্টোরে সফলভাবে সংরক্ষিত হয়েছে।
        </div>
      `;
    }

    showToast("আলহামদুলিল্লাহ! সমস্ত প্রোডাক্ট ও ক্যাটাগরি ফায়ারবেস ক্লাউডে সফলভাবে সেভ হয়েছে!", "success");
  } catch (err) {
    console.error("Firebase Sync Error:", err);
    if (err.message && err.message.includes('does not exist')) {
      alert("ফায়ারবেস ডেটাবেজ পাওয়া যায়নি!\n\nঅনুগ্রহ করে Firebase Console-এ যান:\n1. Build > Firestore Database-এ যান।\n2. 'Create database' বাটনে চাপুন।\n3. 'Start in test mode' নির্বাচন করে Enable করুন।\n\nএরপর আবার এই 'Sync to Cloud' বাটনে চাপলে অটোমেটিক সব ডাটা সেভ হয়ে যাবে।");
    } else if (err.code === 'permission-denied') {
      alert("Firestore Permission Denied!\n\nFirebase Console > Firestore Database > Rules ট্যাবে গিয়ে:\nallow read, write: if true;\nলিখে Publish করুন।");
    } else {
      showToast(`ফায়ারবেস সিঙ্ক নোট: ${err.message}`, "warning");
    }
  }
};

/* ==========================================================================
   Add / Edit Product Modal & Gallery Manager
   ========================================================================== */
function setupProductModalEvents() {
  const modal = document.getElementById('product-form-modal');
  const openBtn = document.getElementById('open-add-product-modal-btn');
  const closeBtn = document.getElementById('close-product-modal-btn');
  const form = document.getElementById('admin-product-form');
  const addGalleryBtn = document.getElementById('add-gallery-image-btn');
  const mainImageInput = document.getElementById('form-main-image');
  const mainImageFile = document.getElementById('form-main-image-file');

  openBtn?.addEventListener('click', () => openProductModal());
  closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

  // Live Main Thumbnail Preview
  mainImageInput?.addEventListener('input', () => {
    updateMainThumbnailPreview(mainImageInput.value);
  });

  mainImageFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        mainImageInput.value = event.target.result;
        updateMainThumbnailPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // "+ Add Gallery Image" button click
  addGalleryBtn?.addEventListener('click', () => {
    addGalleryRow('');
  });

  // Form Submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProductFromForm();
  });
}

function updateMainThumbnailPreview(src) {
  const preview = document.getElementById('main-thumbnail-preview');
  if (!preview) return;
  if (src) {
    preview.src = src;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
}

// Add a gallery row dynamically
function addGalleryRow(imgUrl = '') {
  const container = document.getElementById('gallery-images-container');
  if (!container) return;

  const rowId = 'gallery-row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const row = document.createElement('div');
  row.id = rowId;
  row.className = 'gallery-row flex items-center gap-3 p-2 bg-[#FCFBF7] rounded-lg border border-[#DED7C8]';

  row.innerHTML = `
    <!-- Thumbnail Preview -->
    <div class="w-12 h-12 rounded border border-[#DED7C8] bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
      <img src="${imgUrl || 'assets/images/product-quran.jpg'}" class="gallery-row-img w-full h-full object-cover ${imgUrl ? '' : 'hidden'}">
      <span class="gallery-row-placeholder text-[10px] text-gray-400 ${imgUrl ? 'hidden' : ''}">No img</span>
    </div>

    <!-- Image URL Input -->
    <div class="flex-1 min-w-0">
      <input type="text" value="${imgUrl}" placeholder="Image URL (e.g. assets/images/product-1.jpg)" class="gallery-input w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:border-[#D6A63A] focus:outline-none bg-white">
    </div>

    <!-- File Upload Button -->
    <label class="px-2.5 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-[11px] font-semibold text-gray-700 cursor-pointer flex items-center gap-1">
      <span>Upload</span>
      <input type="file" accept="image/*" class="hidden gallery-file-input">
    </label>

    <!-- Remove Row Button -->
    <button type="button" onclick="document.getElementById('${rowId}').remove()" class="p-1.5 text-gray-400 hover:text-red-500 rounded transition" title="Remove image">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
    </button>
  `;

  const inputEl = row.querySelector('.gallery-input');
  const imgEl = row.querySelector('.gallery-row-img');
  const placeholderEl = row.querySelector('.gallery-row-placeholder');
  const fileInputEl = row.querySelector('.gallery-file-input');

  inputEl.addEventListener('input', () => {
    const val = inputEl.value.trim();
    if (val) {
      imgEl.src = val;
      imgEl.classList.remove('hidden');
      placeholderEl.classList.add('hidden');
    } else {
      imgEl.classList.add('hidden');
      placeholderEl.classList.remove('hidden');
    }
  });

  fileInputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        inputEl.value = event.target.result;
        imgEl.src = event.target.result;
        imgEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  container.appendChild(row);
}

window.openProductModal = async (id = null) => {
  currentEditingProductId = id;
  const modal = document.getElementById('product-form-modal');
  const titleEl = document.getElementById('modal-form-title');
  const form = document.getElementById('admin-product-form');
  const galleryContainer = document.getElementById('gallery-images-container');

  form.reset();
  galleryContainer.innerHTML = '';
  await populateCategoryDropdown();

  if (id) {
    titleEl.textContent = 'Edit Islamic Product';
    const item = await window.musafirDB.getItemById(id);
    if (!item) return;

    document.getElementById('form-item-id').value = item.id;
    document.getElementById('form-title-en').value = item.title_en || '';
    document.getElementById('form-title-bn').value = item.title_bn || '';
    document.getElementById('form-category').value = item.category || 'quran-tafsir';
    document.getElementById('form-price').value = item.price || '';
    document.getElementById('form-original-price').value = item.originalPrice || '';
    
    // Stock fields
    document.getElementById('form-stock-quantity').value = item.stockQuantity !== undefined ? item.stockQuantity : 20;
    document.getElementById('form-instock-toggle').checked = item.inStock !== false && (item.stockQuantity === undefined || item.stockQuantity > 0);
    document.getElementById('form-popular').checked = !!item.isPopular;

    // Main Image
    document.getElementById('form-main-image').value = item.image || '';
    updateMainThumbnailPreview(item.image);

    // Gallery Images
    const gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
    // Exclude the first if it equals main image, or include all extras
    gallery.forEach(url => {
      if (url) addGalleryRow(url);
    });

    // Highlights / Points
    const highlightsEn = item.highlights_en ? item.highlights_en.join('\n') : '';
    const highlightsBn = item.highlights_bn ? item.highlights_bn.join('\n') : '';
    document.getElementById('form-highlights-en').value = highlightsEn;
    document.getElementById('form-highlights-bn').value = highlightsBn;

    // Descriptions & Specs
    document.getElementById('form-short-en').value = item.shortDesc_en || '';
    document.getElementById('form-short-bn').value = item.shortDesc_bn || '';
    document.getElementById('form-desc-en').value = item.desc_en || '';
    document.getElementById('form-desc-bn').value = item.desc_bn || '';

    // Specs
    if (item.specs) {
      const specsStr = Object.entries(item.specs).map(([k, v]) => `${k}: ${v}`).join('\n');
      document.getElementById('form-specs').value = specsStr;
    }
  } else {
    titleEl.textContent = 'Add New Islamic Product';
    document.getElementById('form-item-id').value = '';
    document.getElementById('form-stock-quantity').value = '25';
    document.getElementById('form-instock-toggle').checked = true;
    updateMainThumbnailPreview('');
    // Add 2 initial blank gallery rows for convenience
    addGalleryRow('');
    addGalleryRow('');
  }

  modal?.classList.remove('hidden');
};

async function saveProductFromForm() {
  const id = document.getElementById('form-item-id').value;
  const title_en = document.getElementById('form-title-en').value.trim();
  const title_bn = document.getElementById('form-title-bn').value.trim();
  const category = document.getElementById('form-category').value;
  const price = parseInt(document.getElementById('form-price').value, 10);
  const originalPrice = parseInt(document.getElementById('form-original-price').value, 10) || 0;
  const stockQuantity = parseInt(document.getElementById('form-stock-quantity').value, 10) || 0;
  const inStock = document.getElementById('form-instock-toggle').checked && stockQuantity > 0;
  const isPopular = document.getElementById('form-popular').checked;

  // Main Image
  const mainImage = document.getElementById('form-main-image').value.trim() || 'assets/images/product-quran.jpg';

  // Collect Extra Gallery Images
  const galleryInputs = document.querySelectorAll('.gallery-input');
  const gallery = [mainImage];
  galleryInputs.forEach(input => {
    const val = input.value.trim();
    if (val && !gallery.includes(val)) {
      gallery.push(val);
    }
  });

  // Highlights
  const highlights_en = document.getElementById('form-highlights-en').value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const highlights_bn = document.getElementById('form-highlights-bn').value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Descriptions
  const shortDesc_en = document.getElementById('form-short-en').value.trim();
  const shortDesc_bn = document.getElementById('form-short-bn').value.trim();
  const desc_en = document.getElementById('form-desc-en').value.trim() || shortDesc_en;
  const desc_bn = document.getElementById('form-desc-bn').value.trim() || shortDesc_bn;

  // Specifications
  const specsRaw = document.getElementById('form-specs').value.trim();
  const specs = {};
  if (specsRaw) {
    specsRaw.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        specs[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });
  }

  // Category Metadata lookup
  const categories = await window.musafirDB.getCategories();
  const matchedCat = categories.find(c => c.id === category);

  const product = {
    id: id || 'p_' + Date.now(),
    title_en,
    title_bn: title_bn || title_en,
    category,
    category_en: matchedCat ? matchedCat.name_en : category,
    category_bn: matchedCat ? matchedCat.name_bn : category,
    price,
    originalPrice,
    stockQuantity,
    inStock,
    isPopular,
    image: mainImage,
    gallery,
    highlights_en,
    highlights_bn,
    shortDesc_en,
    shortDesc_bn: shortDesc_bn || shortDesc_en,
    desc_en,
    desc_bn: desc_bn || desc_en,
    specs: Object.keys(specs).length > 0 ? specs : undefined
  };

  await window.musafirDB.saveItem(product);
  document.getElementById('product-form-modal')?.classList.add('hidden');
  await renderAdminProducts();
  await setupAdminStats();
  showToast(`"${product.title_en}" saved successfully!`, 'success');
}

/* ==========================================================================
   Category Management Module (ক্যাটাগরি ম্যানেজমেন্ট ও এডিট)
   ========================================================================== */
function setupCategoryModalEvents() {
  const modal = document.getElementById('category-manager-modal');
  const openBtn = document.getElementById('open-categories-modal-btn');
  const closeBtn = document.getElementById('close-category-modal-btn');
  const form = document.getElementById('admin-category-form');
  const catImageInput = document.getElementById('form-cat-image');
  const catImageFile = document.getElementById('form-cat-image-file');

  openBtn?.addEventListener('click', async () => {
    await renderCategoriesList();
    resetCategoryForm();
    modal?.classList.remove('hidden');
  });

  closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

  catImageFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        catImageInput.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveCategoryFromForm();
  });
}

async function renderCategoriesList() {
  const container = document.getElementById('category-items-list');
  if (!container) return;

  const categories = await window.musafirDB.getCategories();
  const items = await window.musafirDB.getItems('all');

  container.innerHTML = categories.map(cat => {
    const productCount = items.filter(i => i.category === cat.id).length;
    return `
      <div class="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#DED7C8] hover:border-[#D6A63A] transition shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#F7F1E4] border border-[#DED7C8] flex items-center justify-center overflow-hidden flex-shrink-0">
            ${cat.image ? `<img src="${cat.image}" class="w-full h-full object-cover">` : (cat.icon || '📁')}
          </div>
          <div>
            <h4 class="text-sm font-bold text-[#171717]">${cat.name_en}</h4>
            <p class="text-xs text-gray-500 font-bn">${cat.name_bn || ''}</p>
            <span class="text-[10px] text-gray-400 font-mono">${cat.id} • ${productCount} products</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="editCategory('${cat.id}')" class="px-3 py-1 rounded border border-gray-300 text-xs font-semibold text-gray-700 hover:border-[#D6A63A] hover:text-[#D6A63A] transition">Edit</button>
          <button onclick="deleteCategory('${cat.id}')" class="px-3 py-1 rounded border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

window.editCategory = async (id) => {
  const categories = await window.musafirDB.getCategories();
  const cat = categories.find(c => c.id === id);
  if (!cat) return;

  currentEditingCategoryId = cat.id;
  document.getElementById('form-cat-id').value = cat.id;
  document.getElementById('form-cat-name-en').value = cat.name_en || '';
  document.getElementById('form-cat-name-bn').value = cat.name_bn || '';
  document.getElementById('form-cat-image').value = cat.image || '';
  document.getElementById('cat-form-title').textContent = 'Edit Category';
  document.getElementById('cat-cancel-edit-btn').classList.remove('hidden');
};

window.cancelCategoryEdit = () => {
  resetCategoryForm();
};

function resetCategoryForm() {
  currentEditingCategoryId = null;
  document.getElementById('admin-category-form')?.reset();
  document.getElementById('form-cat-id').value = '';
  document.getElementById('cat-form-title').textContent = 'Add New Category';
  document.getElementById('cat-cancel-edit-btn').classList.add('hidden');
}

async function saveCategoryFromForm() {
  const idInput = document.getElementById('form-cat-id').value.trim();
  const name_en = document.getElementById('form-cat-name-en').value.trim();
  const name_bn = document.getElementById('form-cat-name-bn').value.trim();
  const image = document.getElementById('form-cat-image').value.trim() || 'assets/images/product-quran.jpg';

  const slug = idInput || name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = {
    id: slug,
    name_en,
    name_bn: name_bn || name_en,
    image,
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
  };

  await window.musafirDB.saveCategory(category);
  resetCategoryForm();
  await renderCategoriesList();
  await populateCategoryDropdown();
  await setupAdminStats();
  showToast(`Category "${category.name_en}" saved!`, 'success');
}

window.deleteCategory = async (id) => {
  if (confirm(`Are you sure you want to delete category "${id}"?`)) {
    await window.musafirDB.deleteCategory(id);
    await renderCategoriesList();
    await populateCategoryDropdown();
    await setupAdminStats();
    showToast('Category deleted', 'info');
  }
};

async function populateCategoryDropdown() {
  const select = document.getElementById('form-category');
  if (!select) return;

  const categories = await window.musafirDB.getCategories();
  select.innerHTML = categories.map(cat => `
    <option value="${cat.id}">${cat.name_en} (${cat.name_bn || cat.name_en})</option>
  `).join('');
}

/* ==========================================================================
   Search & Filter Event Listeners
   ========================================================================== */
function setupSearchFilterEvents() {
  const searchInput = document.getElementById('admin-search-input');
  const stockFilter = document.getElementById('admin-stock-filter');

  const triggerFilter = () => {
    const q = searchInput?.value.trim() || '';
    const s = stockFilter?.value || 'all';
    renderAdminProducts(q, s);
  };

  searchInput?.addEventListener('input', triggerFilter);
  stockFilter?.addEventListener('change', triggerFilter);
}
