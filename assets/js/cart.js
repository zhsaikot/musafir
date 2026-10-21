/**
 * MUSAFIR - Dedicated Cart & Checkout Controller (cart.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  window.addEventListener('musafir:cart-updated', () => {
    renderCartPage();
  });

  window.addEventListener('musafir:lang-changed', () => {
    renderCartPage();
  });

  document.querySelectorAll('input[name="delivery-zone"]').forEach(radio => {
    radio.addEventListener('change', updateCartCalculations);
  });
});

let appliedDiscount = 0;

function renderCartPage() {
  const container = document.getElementById('cart-table-body');
  const emptyView = document.getElementById('cart-page-empty');
  const contentView = document.getElementById('cart-page-content');
  if (!container) return;

  const cart = window.musafirDB.getCart();
  if (cart.length === 0) {
    emptyView?.classList.remove('hidden');
    contentView?.classList.add('hidden');
    return;
  }

  emptyView?.classList.add('hidden');
  contentView?.classList.remove('hidden');

  const lang = window.i18n.getLang();
  container.innerHTML = cart.map(item => {
    const title = lang === 'bn' ? (item.title_bn || item.title_en) : (item.title_en || item.title_bn);
    const lineTotal = item.price * item.quantity;
    return `
      <tr class="border-b border-gray-100 hover:bg-[#FCFBF7]/50 transition">
        <td class="py-4 px-3 sm:px-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <img src="${item.image}" alt="${title}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-[#DED7C8] flex-shrink-0">
            <div>
              <a href="item-details.html?id=${item.id}" class="text-sm font-semibold text-[#171717] hover:text-[#D6A63A] transition line-clamp-1">${title}</a>
              <span class="text-xs text-gray-400 block mt-0.5">৳ ${item.price.toLocaleString()}</span>
            </div>
          </div>
        </td>
        <td class="py-4 px-3 text-center">
          <div class="inline-flex items-center border border-[#DED7C8] rounded-lg bg-white">
            <button onclick="changeCartQty('${item.id}', ${item.quantity - 1})" class="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#D6A63A] transition rounded-l-lg font-bold">-</button>
            <span class="w-8 text-center text-xs font-bold">${item.quantity}</span>
            <button onclick="changeCartQty('${item.id}', ${item.quantity + 1})" class="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#D6A63A] transition rounded-r-lg font-bold">+</button>
          </div>
        </td>
        <td class="py-4 px-3 text-right font-bold text-sm text-[#171717]">
          ৳ ${lineTotal.toLocaleString()}
        </td>
        <td class="py-4 px-2 text-center">
          <button onclick="removeCartItem('${item.id}')" class="text-gray-400 hover:text-red-500 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  updateCartCalculations();
}

function updateCartCalculations() {
  const { subtotal } = window.musafirDB.getCartTotal();
  const zoneRadio = document.querySelector('input[name="delivery-zone"]:checked');
  const zone = zoneRadio ? zoneRadio.value : 'dhaka';
  
  let deliveryFee = zone === 'dhaka' ? window.STORE_CONFIG.deliveryInsideDhaka : window.STORE_CONFIG.deliveryOutsideDhaka;
  if (subtotal >= window.STORE_CONFIG.freeDeliveryThreshold) {
    deliveryFee = 0;
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);

  const subtotalEl = document.getElementById('cart-summary-subtotal');
  const deliveryEl = document.getElementById('cart-summary-delivery');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-summary-discount');
  const totalEl = document.getElementById('cart-summary-total');

  if (subtotalEl) subtotalEl.textContent = `৳ ${subtotal.toLocaleString()}`;
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `৳ ${deliveryFee}`;
  
  if (discountRow && discountEl) {
    if (appliedDiscount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-৳ ${appliedDiscount.toLocaleString()}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (totalEl) totalEl.textContent = `৳ ${grandTotal.toLocaleString()}`;
}

window.applyCoupon = () => {
  const input = document.getElementById('coupon-input');
  const code = (input?.value || '').trim().toUpperCase();
  if (code === 'BARAKAH10' || code === 'MUSAFIR10') {
    const { subtotal } = window.musafirDB.getCartTotal();
    appliedDiscount = Math.round(subtotal * 0.10);
    showToast('Promo Code applied: 10% Discount!', 'success');
    updateCartCalculations();
  } else {
    showToast('Invalid promo code. Try "BARAKAH10"', 'warning');
  }
};

window.submitCheckoutOrder = (event) => {
  event?.preventDefault();
  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const notes = document.getElementById('checkout-notes')?.value.trim() || '';
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'cod';
  const zoneRadio = document.querySelector('input[name="delivery-zone"]:checked');
  const zone = zoneRadio ? zoneRadio.value : 'dhaka';

  if (!name || !phone || !address) {
    showToast(window.i18n.getLang() === 'bn' ? 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please complete your shipping details', 'warning');
    return;
  }

  const cart = window.musafirDB.getCart();
  const { subtotal } = window.musafirDB.getCartTotal();
  const deliveryFee = zone === 'dhaka' ? window.STORE_CONFIG.deliveryInsideDhaka : window.STORE_CONFIG.deliveryOutsideDhaka;
  const total = subtotal + deliveryFee - appliedDiscount;
  const lang = window.i18n.getLang();

  let msg = "";
  if (lang === 'bn') {
    msg += `*নতুন অর্ডার (MUSAFIR Islamic Lifestyle)*\n`;
    msg += `------------------------------------\n`;
    cart.forEach((i, idx) => {
      const title = i.title_bn || i.title_en;
      msg += `${idx + 1}. *${title}*\n   পরিমাণ: ${i.quantity} x ৳${i.price} = ৳${i.quantity * i.price}\n`;
    });
    msg += `------------------------------------\n`;
    msg += `• সাবটোটাল: ৳${subtotal.toLocaleString()}\n`;
    msg += `• ডেলিভারি চার্জ: ৳${deliveryFee}\n`;
    if (appliedDiscount > 0) msg += `• ডিসকাউন্ট: -৳${appliedDiscount}\n`;
    msg += `• *সর্বমোট প্রদেয়: ৳${total.toLocaleString()}*\n\n`;
    msg += `*গ্রাহকের তথ্য:*\n`;
    msg += `• নাম: ${name}\n`;
    msg += `• ফোন: ${phone}\n`;
    msg += `• ঠিকানা: ${address}\n`;
    msg += `• পেমেন্ট মেথড: ${paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে পরিশোধ)' : 'বিকাশ / নগদ'}\n`;
    if (notes) msg += `• নোট: ${notes}\n`;
    msg += `\nজাযাকাল্লাহু খাইরান! অর্ডারটি কনফার্ম করুন।`;
  } else {
    msg += `*NEW ORDER (MUSAFIR Islamic Lifestyle)*\n`;
    msg += `------------------------------------\n`;
    cart.forEach((i, idx) => {
      const title = i.title_en || i.title_bn;
      msg += `${idx + 1}. *${title}*\n   Qty: ${i.quantity} x ৳${i.price} = ৳${i.quantity * i.price}\n`;
    });
    msg += `------------------------------------\n`;
    msg += `• Subtotal: ৳${subtotal.toLocaleString()}\n`;
    msg += `• Delivery: ৳${deliveryFee}\n`;
    if (appliedDiscount > 0) msg += `• Discount: -৳${appliedDiscount}\n`;
    msg += `• *Grand Total: ৳${total.toLocaleString()}*\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `• Name: ${name}\n`;
    msg += `• Phone: ${phone}\n`;
    msg += `• Address: ${address}\n`;
    msg += `• Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash / Nagad'}\n`;
    if (notes) msg += `• Notes: ${notes}\n`;
    msg += `\nThank you! Please confirm my order.`;
  }

  const phoneNum = window.STORE_CONFIG.whatsappNumber || "8801700000000";
  const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;

  showToast(window.i18n.t('order_success'), 'success');
  window.musafirDB.clearCart();
  setTimeout(() => {
    window.open(url, '_blank');
  }, 400);
};
