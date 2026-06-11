/* ================================================================
   LITTLEMAKER CAMBODIA — checkout.js
   Checkout modal, order submission, Telegram integration
   ================================================================ */

'use strict';

/* ── Process Order Submission ── */
async function processOrder() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const loc = document.getElementById('coLocation').value.trim();

  if (!name || !phone) {
    showToast('សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ!');
    return;
  }

  const btn = document.getElementById('coSubmitBtn');
  const orig = btn.innerHTML;
  
  const lang = localStorage.getItem('lm_lang') || 'en';
  const t = T[lang] || T.en;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (t.processing || 'Processing...');
  btn.disabled = true;

  // Prepare order data
  let sum = 0;
  const orderItems = cart.map(i => {
     const p = parseFloat(i.price)||0;
     sum += (p * i.qty);
     return { id: i.id, name: i.name, price: p, qty: i.qty };
  });

  const locText = loc ? loc : 'មិនមានបញ្ជាក់';
  const custInfo = name + ' | ' + phone + ' | ទីតាំង: ' + locText;

  // Get invoice number from database
  const invNo = await getNextInvoiceNumber();

  // Save to Firebase Firestore
  if (window.fsDB && window.fsAddDoc && window.fsCollection) {
    try {
      await window.fsAddDoc(window.fsCollection(window.fsDB, "orders"), {
        invNo: invNo,
        customerInfo: custInfo,
        customerName: name,
        customerPhone: phone,
        customerLocation: locText,
        items: orderItems,
        totalAmount: sum,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    } catch(err) { 
      console.error("Order save failed", err); 
    }
  }

  // Build Telegram message
  let orderLines = '';
  cart.forEach((i,n) => {
    const p = parseFloat(i.price)||0;
    const s = p * i.qty;
    orderLines += (n+1) + '. ' + i.name + ' ×' + i.qty + ' = $' + s.toFixed(2) + '\n';
  });

  let rawMsg = '📩 ' + (t.tg_new_order || 'New Order') + '\n';
  rawMsg += '👤 ' + (t.co_name || 'Name') + ': ' + name + '\n';
  rawMsg += '📞 ' + (t.co_phone || 'Phone') + ': ' + phone + '\n';
  if (loc) {
    let locLabel = (t.co_loc || 'Location').replace(' (Optional)', '').replace(' (ជម្រើស)', '').replace(' (可选)', '');
    rawMsg += '📍 ' + locLabel + ': ' + loc + '\n';
  }
  rawMsg += '\n[' + (t.inv_no || 'Invoice No.') + ' ' + invNo + ']\n';
  rawMsg += '\n🛒 ' + (t.tg_items || 'Items') + ':\n';
  rawMsg += orderLines;
  rawMsg += '────────\n';
  rawMsg += (t.cart_total || 'Total') + ': $' + sum.toFixed(2);

  const msg = encodeURIComponent(rawMsg);

  // Open Telegram
  window.open('https://t.me/samnangkhiev?text=' + msg, '_blank');
  
  // Clear cart data after submission
  cart = []; 
  window._currentCartInv = null;
  saveCart(); refreshBadge(); renderCart();
  document.getElementById('checkoutModal')?.classList.remove('open');
  document.getElementById('cartModal')?.classList.remove('open');

  btn.innerHTML = orig; btn.disabled = false;
  document.getElementById('coName').value = '';
  document.getElementById('coPhone').value = '';
  document.getElementById('coLocation').value = '';
}