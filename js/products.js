/* ================================================================
   LITTLEMAKER CAMBODIA — products.js
   Product card HTML, shop page rendering, product detail rendering
   ================================================================ */

'use strict';

/* ── Default product data (fallback) ── */
const DB_DEFAULT = [
  { id:1, category:'tables', title:"Modern Executive Desk", price:185, image:"images/Husky1.png", gallery:["images/Husky1.png","images/cabinet.jpg"], desc:"Minimalist steel frame desk with wooden top.", specs:{"Dimensions":"140×70 cm","Material":"Steel & Plywood"}, badge:'new' },
  { id:2, category:'cabinets', title:"Steel File Cabinet (3-Drawer)", price:95, image:"images/cabinet.jpg", gallery:["images/cabinet.jpg","images/Husky1.png"], desc:"Secure locking storage with heavy-duty drawer rails.", specs:{"Dimensions":"40×50×65 cm"} }
];

let DB = [];

/* ── Product Card HTML ── */
function productCardHTML(p) {
  const badge = p.badge === 'new'
    ? '<span class="badge-new">New</span>'
    : p.badge === 'sale' ? '<span class="badge-sale">Hot</span>' : '';
  const price = parseFloat(p.price)||0;
  return `
    <div class="product-card fade-in" data-category="${p.category}">
      <button class="wishlist-btn" data-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist('${p.id}')" title="Add to Wishlist">
        <i class="fa-regular fa-heart"></i>
      </button>
      <a href="product-detail.html?id=${p.id}">
        <div class="product-img">
          <img src="${p.image}" alt="${p.title}" loading="lazy"
               onerror="this.src='images/cabinet.jpg'">
          ${badge}
        </div>
      </a>
      <div class="product-details">
        <span class="product-cat">${p.category}</span>
        <a href="product-detail.html?id=${p.id}"><h4>${p.title}</h4></a>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="price">$${price.toFixed(2)}</span>
          <button class="btn-cart add-to-cart-btn" data-id="${p.id}"
            data-translate="btn_add">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>`;
}

/* ── Render Shop & Detail Pages ── */
function renderShopAndDetails() {
  /* ── SHOP PAGE — Render Products ── */
  const shopGrid = document.getElementById('shop-products-grid');
  if (shopGrid) {
    if (DB.length === 0) {
      shopGrid.innerHTML = '<p style="text-align:center;padding:40px;width:100%;grid-column:1/-1;color:var(--muted)">មិនទាន់មានផលិតផលទេ (No products available).</p>';
    } else {
      shopGrid.innerHTML = DB.map(productCardHTML).join('');
    }
    applyLang(localStorage.getItem('lm_lang') || 'en');
    
    // Handle Scroll reveal correctly using global observer
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold:.1 });
    shopGrid.querySelectorAll('.fade-in').forEach(el => io.observe(el));

    /* Search */
    document.getElementById('productSearch')?.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('#shop-products-grid .product-card').forEach(c => {
        const t = c.querySelector('h4')?.textContent.toLowerCase() || '';
        c.style.display = t.includes(q) ? '' : 'none';
      });
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
    });

    /* Filter */
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        if (document.getElementById('productSearch'))
          document.getElementById('productSearch').value = '';
        document.querySelectorAll('#shop-products-grid .product-card').forEach(c => {
          const show = f === 'all' || c.dataset.category === f;
          c.style.display   = show ? '' : 'none';
          c.style.opacity   = show ? '1' : '0';
          c.style.transition = 'opacity .3s';
        });
      });
    });

    try {
      let cat = new URLSearchParams(location.search).get('category') || '';
      if (!cat && location.hash) cat = String(location.hash).replace('#','');
      cat = String(cat || '').toLowerCase().trim();
      if (cat === 'table') cat = 'tables';
      if (cat === 'cabinet') cat = 'cabinets';
      if (cat === 'grill') cat = 'grills';
      if (cat) {
        const btn = document.querySelector('.filter-btn[data-filter="' + cat + '"]');
        if (btn) btn.click();
      }
    } catch(e) {}
  }

  /* ── PRODUCT DETAIL PAGE ── */
  const detailWrap = document.getElementById('product-detail-container');
  if (detailWrap) {
    const idParam = new URLSearchParams(location.search).get('id');
    const prod = DB.find(p => String(p.id) === String(idParam));

    if (prod) {
      const galleryArray = prod.gallery && prod.gallery.length ? prod.gallery : [prod.image];
      window._gallery = galleryArray; window._gIdx = 0;
      
      document.getElementById('breadcrumb-title').textContent = prod.title;

      /* gallery HTML */
      const thumbs = galleryArray.map((src,i) =>
        '<div class="thumb-item ' + (i===0?'active':'') + '" onclick="setImage(' + i + ')">' +
          '<img src="' + src + '" onerror="this.src=\'images/cabinet.jpg\'">' +
        '</div>'
      ).join('');

      /* specs table */
      const specsObj = prod.specs || {};
      let specsRows = Object.entries(specsObj).map(([k,v]) =>
        '<tr><th>' + k + '</th><td>' + v + '</td></tr>'
      ).join('');
      if(!specsRows) specsRows = '<tr><td>No specifications available</td></tr>';

      const priceNum = parseFloat(prod.price) || 0;

      detailWrap.innerHTML = `
        <div class="product-detail-wrapper">
          <div class="product-gallery">
            <div class="main-image-container">
              <button class="slider-btn prev" onclick="moveSlide(-1)">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <div class="main-image">
                <img id="mainImg" src="${prod.image}" alt="${prod.title}"
                     onerror="this.src='images/cabinet.jpg'">
              </div>
              <button class="slider-btn next" onclick="moveSlide(1)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div class="thumb-list">${thumbs}</div>
          </div>

          <div class="product-info">
            <h1>${prod.title}</h1>
            <div class="price-tag">$${priceNum.toFixed(2)}</div>
            <div class="stock-status">
              <i class="fa-solid fa-check-circle"></i> In Stock – Ready to Ship
            </div>
            <p class="short-desc">${prod.desc || ''}</p>
            <div class="quantity-selector">
              <span data-translate="lbl_quantity">Quantity:</span>
              <div class="qty-controls">
                <button class="qty-btn" id="qMinus">−</button>
                <input type="number" id="detailQty" value="1" min="1" class="qty-input" readonly>
                <button class="qty-btn" id="qPlus">+</button>
              </div>
            </div>
            <div class="action-buttons">
              <button class="btn-action add-cart" id="btnAddCart" data-translate="btn_add_cart">Add to Cart</button>
              <button class="btn-action buy-now"  id="btnBuyNow"  data-translate="btn_buy_now">Buy Now</button>
            </div>
            <a href="https://t.me/samnangkhiev" target="_blank" class="chat-seller-btn">
              <i class="fa-brands fa-telegram"></i>
              <span data-translate="btn_chat">Chat with Seller</span>
            </a>
          </div>
        </div>

        <div class="product-tabs">
          <div class="tab-headers">
            <button class="tab-btn active" onclick="openTab(event,'tabDesc')"
              data-translate="tab_desc">Description</button>
            <button class="tab-btn"        onclick="openTab(event,'tabSpecs')"
              data-translate="tab_specs">Specifications</button>
          </div>
          <div id="tabDesc"  class="tab-content" style="display:block"><p>${prod.desc || ''}</p></div>
          <div id="tabSpecs" class="tab-content">
            <table class="specs-table"><tbody>${specsRows}</tbody></table>
          </div>
        </div>`;

      /* qty controls */
      const qtyInput = document.getElementById('detailQty');
      document.getElementById('qMinus')?.addEventListener('click', () => {
        if (+qtyInput.value > 1) qtyInput.value--;
      });
      document.getElementById('qPlus')?.addEventListener('click', () => qtyInput.value++);

      /* add / buy */
      document.getElementById('btnAddCart')?.addEventListener('click', () =>
        addToCart(prod.id, +qtyInput.value));
      document.getElementById('btnBuyNow')?.addEventListener('click', () => {
        addToCart(prod.id, +qtyInput.value);
        renderCart();
        document.getElementById('cartModal')?.classList.add('open');
      });

      /* mobile sticky bar */
      document.getElementById('mobile-add-cart')?.addEventListener('click', () =>
        document.getElementById('btnAddCart')?.click());
      document.getElementById('mobile-buy-now')?.addEventListener('click', () =>
        document.getElementById('btnBuyNow')?.click());
      document.body.classList.add('has-action-bar');

      /* related products */
      const relGrid = document.getElementById('related-products-grid');
      if (relGrid) {
        DB.filter(p => p.category === prod.category && p.id !== prod.id)
          .slice(0,3).forEach(p => relGrid.insertAdjacentHTML('beforeend', productCardHTML(p)));
        
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
          });
        }, { threshold:.1 });
        relGrid.querySelectorAll('.fade-in').forEach(el => io.observe(el));
      }

      applyLang(localStorage.getItem('lm_lang') || 'en');
      document.querySelectorAll('.btn-action').forEach(addRipple);

    } else {
      detailWrap.innerHTML = '<p style="text-align:center;padding:60px;color:var(--muted)">Product not found.</p>';
    }
  }
}
