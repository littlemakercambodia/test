/* ================================================================
   LITTLEMAKER CAMBODIA — cart.js
   Cart state management, badge refresh, add/remove items
   ================================================================ */

'use strict';

/* ── Cart State ── */
let cart = JSON.parse(localStorage.getItem('lm_cart') || '[]');

function saveCart()  { localStorage.setItem('lm_cart', JSON.stringify(cart)); }
function cartCount() { return cart.reduce((s,i) => s + i.qty, 0); }

function refreshBadge() {
  const n = cartCount();
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = n);
}

function addToCart(id, qty = 1) {
  const p = DB.find(p => String(p.id) === String(id));
  if (!p) return;
  
  const ex = cart.find(i => String(i.id) === String(p.id));
  if (ex) ex.qty += qty; else cart.push({ id:String(p.id), name:p.title, price:parseFloat(p.price)||0, qty });
  
  saveCart(); refreshBadge();
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.classList.add('bump');
    setTimeout(() => b.classList.remove('bump'), 260);
  });
  showToast('✓  ' + p.title);
}

/* ── Toast ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast show';
  clearTimeout(t._tid);
  t._tid = setTimeout(() => { t.className = 'toast'; }, 3000);
}

/* ── Render Cart Items ── */
function renderCart() {
  const body  = document.getElementById('cartItems');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  
  const lang = localStorage.getItem('lm_lang') || 'en';
  const t = T[lang] || T.en;

  let sum = 0; body.innerHTML = '';
  if (!cart.length) {
    body.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted)">
      <i class="fa-solid fa-cart-shopping" style="font-size:2.5rem;opacity:.2;margin-bottom:14px;display:block"></i>
      ${t.cart_empty}</div>`;
  } else {
    cart.forEach((item, i) => {
      const sub = (parseFloat(item.price)||0) * item.qty; sum += sub;
      body.insertAdjacentHTML('beforeend', `
        <div class="cart-item">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span class="cart-item-price">$${(parseFloat(item.price)||0).toFixed(2)}</span>
          </div>
          <div style="display:flex;align-items:center">
            <div class="qty-controls">
              <button class="qty-btn" data-action="minus" data-i="${i}">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-action="plus"  data-i="${i}">+</button>
            </div>
            <button class="remove-item" data-i="${i}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`);
    });
  }
  if (total) total.textContent = '$' + sum.toFixed(2);

  /* qty + remove events */
  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      if (btn.dataset.action === 'plus') { cart[i].qty++; }
      else { if (cart[i].qty > 1) cart[i].qty--; else cart.splice(i,1); }
      saveCart(); refreshBadge(); renderCart();
    });
  });
  body.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(+btn.dataset.i, 1);
      saveCart(); refreshBadge(); renderCart();
    });
  });
}