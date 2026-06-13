/* ================================================================
   LITTLEMAKER CAMBODIA — ui.js
   Theme toggle, language switch, scroll effects, navbar,
   page loader, progress bar, ripple, counter animation,
   image lightbox, gallery slider helpers
   ================================================================ */

'use strict';

/* ─────────────────────────────────────────────
   GLOBAL SLIDER HELPERS
───────────────────────────────────────────── */
window._gallery = []; window._gIdx = 0;

window.moveSlide = function(step) {
  if (!window._gallery.length) return;
  window._gIdx = (window._gIdx + step + window._gallery.length) % window._gallery.length;
  const img = document.getElementById('mainImg');
  if (img) img.src = window._gallery[window._gIdx];
  document.querySelectorAll('.thumb-item').forEach((t,i) =>
    t.classList.toggle('active', i === window._gIdx));
};

window.setImage = function(idx) {
  window._gIdx = idx;
  const img = document.getElementById('mainImg');
  if (img) img.src = window._gallery[idx];
  document.querySelectorAll('.thumb-item').forEach((t,i) =>
    t.classList.toggle('active', i === idx));
};

window.openTab = function(evt, name) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(name).style.display = 'block';
  evt.currentTarget.classList.add('active');
};

/* ─────────────────────────────────────────────
   APPLY LANGUAGE
───────────────────────────────────────────── */
function applyLang(lang) {
  const base = T[lang] || T.en;
  let custom = {};
  try {
    const saved = localStorage.getItem('lm_translations');
    if (saved) {
      const all = JSON.parse(saved);
      custom = all[lang] || {};
      
      // Map h_ variables to standard variables
      if (custom.h_hero_title) custom.hero_title = custom.h_hero_title;
      if (custom.h_hero_desc) custom.hero_desc = custom.h_hero_desc;
      if (custom.h_feat_title) custom.feat_title = custom.h_feat_title;
      if (custom.h_feat_sub) custom.feat_sub = custom.h_feat_sub;
      if (custom.h_feat_off) custom.feat_off = custom.h_feat_off;
      if (custom.h_feat_off_desc) custom.feat_off_desc = custom.h_feat_off_desc;
      if (custom.h_feat_ind) custom.feat_ind = custom.h_feat_ind;
      if (custom.h_feat_ind_desc) custom.feat_ind_desc = custom.h_feat_ind_desc;
      if (custom.h_cta_title) custom.cta_title = custom.h_cta_title;
      if (custom.h_cta_desc) custom.cta_desc = custom.h_cta_desc;
    }
  } catch(e) {}
  
  const tr = Object.assign({}, base);
  for (const k in custom) {
    if (custom[k] && custom[k].toString().trim() !== '') {
      tr[k] = custom[k];
    }
  }
  
  document.querySelectorAll('[data-translate]').forEach(el => {
    const k = el.getAttribute('data-translate');
    if (tr[k] !== undefined) {
      if (/</.test(tr[k])) el.innerHTML = tr[k];
      else el.textContent = tr[k];
    }
  });
  
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const k = el.getAttribute('data-translate-placeholder');
    if (tr[k]) el.placeholder = tr[k];
  });
  
  const cl = document.getElementById('currentLang');
  if (cl) cl.textContent = lang.toUpperCase();

  // Helper: check if a string is a valid image URL (http, images/, data:)
  function _isValidImgUrl(s) {
    return typeof s === 'string' && (s.startsWith('http') || s.startsWith('images/') || s.startsWith('data:image'));
  }

  // Background Images — support slideshow with multiple individual image fields
  function _applySlideshow(el, val) {
    if (!el || !val) return;
    el.style.backgroundImage = "url('" + val + "')";
  }

  function _buildSlideshow(el, imgs, animType) {
    imgs = imgs.filter(v => v && _isValidImgUrl(v));
    if (imgs.length === 0) return;
    if (imgs.length === 1) { el.style.backgroundImage = "url('" + imgs[0] + "')"; return; }
    let slideshow = el.querySelector('.hero-slideshow');
    if (!slideshow) {
      slideshow = document.createElement('div');
      slideshow.className = 'hero-slideshow';
      el.insertBefore(slideshow, el.firstChild);
    }
    // Remove old animation classes but preserve 'visible' for scroll reveal
    const vis = slideshow.classList.contains('visible') ? ' visible' : '';
    slideshow.className = 'hero-slideshow' + (animType ? ' anim-' + animType : '') + vis;
    slideshow.innerHTML = imgs.map((src, i) => `<div class="slide${i===0?' active':''}" style="background-image:url('${src}')"></div>`).join('') +
      '<div class="slide-dots">' + imgs.map((_, i) => `<button class="slide-dot${i===0?' active':''}" onclick="this.parentElement.parentElement._goSlide(${i})"></button>`).join('') + '</div>';
    slideshow._idx = 0;
    slideshow._imgs = imgs;
    slideshow._goSlide = function(n) {
      const prev = this._idx;
      this._idx = n;
      this.querySelectorAll('.slide').forEach((s, i) => {
        s.classList.remove('active', 'prev');
        if (i === prev && prev !== n) s.classList.add('prev');
        if (i === n) s.classList.add('active');
      });
      this.querySelectorAll('.slide-dot').forEach((d, i) => d.classList.toggle('active', i === n));
    };
    if (slideshow._timer) clearInterval(slideshow._timer);
    slideshow._timer = setInterval(() => {
      slideshow._goSlide((slideshow._idx + 1) % slideshow._imgs.length);
    }, 5000);
  }

  // Hero — collect up to 3 images + animation type
  const heroImgs = [tr.h_hero_bg, tr.h_hero_bg2, tr.h_hero_bg3];
  const hero = document.querySelector('.hero');
  if (hero) _buildSlideshow(hero, heroImgs, tr.h_hero_anim);

  // Feature boxes — collect up to 3 images each + animation type
  const featBoxes = document.querySelectorAll('.feature-box');
  if (featBoxes.length > 0) _buildSlideshow(featBoxes[0], [tr.h_feat_off_bg, tr.h_feat_off_bg2, tr.h_feat_off_bg3], tr.h_feat_off_anim);
  if (featBoxes.length > 1) _buildSlideshow(featBoxes[1], [tr.h_feat_ind_bg, tr.h_feat_ind_bg2, tr.h_feat_ind_bg3], tr.h_feat_ind_anim);
  if (featBoxes.length > 2) _buildSlideshow(featBoxes[2], [tr.h_serv_rental_bg, tr.h_serv_rental_bg2, tr.h_serv_rental_bg3], tr.h_serv_rental_anim);
  
  // About Page - Our Story Galleries
  const herEl = document.querySelector('[data-img-gallery="story_heritage"]');
  if (herEl) _buildSlideshow(herEl, [tr.story_heritage_img || DEFAULT_IMAGES['story_heritage_img'], tr.story_heritage_img2, tr.story_heritage_img3], tr.story_heritage_anim);

  const engEl = document.querySelector('[data-img-gallery="story_eng"]');
  if (engEl) _buildSlideshow(engEl, [tr.story_eng_img || DEFAULT_IMAGES['story_eng_img'], tr.story_eng_img2, tr.story_eng_img3], tr.story_eng_anim);

  const comEl = document.querySelector('[data-img-gallery="story_commit"]');
  if (comEl) _buildSlideshow(comEl, [tr.story_commit_img || DEFAULT_IMAGES['story_commit_img'], tr.story_commit_img2, tr.story_commit_img3], tr.story_commit_anim);
  if(tr.a_img && _isValidImgUrl(tr.a_img)) {
      const aboutImg = document.querySelector('.about-img');
      if(aboutImg) aboutImg.src = tr.a_img;
  }

  // Apply Rental Background Image dynamically
  if(tr.rental_bg) {
      const isRentalPage = document.querySelector('h1[data-translate="rental_header"]');
      if(isRentalPage) {
          const header = document.querySelector('.page-header');
          if(header) {
              header.style.backgroundImage = "linear-gradient(rgba(0,34,68,0.75), rgba(0,34,68,0.85)), url('" + tr.rental_bg + "')";
              header.style.backgroundSize = 'cover';
              header.style.backgroundPosition = 'center';
          }
      }
  }

  // Re-render cart and invoice if open to update texts immediately
  if (document.getElementById('cartItems')) {
      renderCart();
  }
  
  // Re-render live chat labels if changed
  const fcName = document.getElementById('fcName');
  if(fcName) fcName.placeholder = tr.co_pl_name || 'Name';
  const fcPhone = document.getElementById('fcPhone');
  if(fcPhone) fcPhone.placeholder = tr.co_pl_phone || 'Phone';
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function animCounter(el, raw, dur) {
  dur = dur || 1800;
  const hasPlus  = raw.includes('+');
  const hasYears = raw.toLowerCase().includes('year');
  const num = parseInt(raw.replace(/\D/g,''), 10);
  if (isNaN(num)) return;
  const suffix = hasPlus ? '+' : (hasYears ? ' Years' : '');
  let s = 0; const step = num / (dur / 16);
  const tick = () => {
    s = Math.min(s + step, num);
    el.textContent = Math.floor(s) + suffix;
    if (s < num) requestAnimationFrame(tick);
  };
  tick();
}

/* ─────────────────────────────────────────────
   RIPPLE EFFECT
───────────────────────────────────────────── */
function addRipple(el) {
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.addEventListener('click', function(e) {
    const r = document.createElement('span');
    const rect = this.getBoundingClientRect();
    r.style.cssText =
      'position:absolute;border-radius:50%;' +
      'width:0;height:0;background:rgba(255,255,255,.3);' +
      'transform:translate(-50%,-50%);pointer-events:none;' +
      'left:' + (e.clientX-rect.left) + 'px;' +
      'top:' + (e.clientY-rect.top) + 'px;' +
      'animation:_ripple .6s ease-out forwards';
    if (!document.getElementById('_rippleCSS')) {
      const s = document.createElement('style');
      s.id = '_rippleCSS';
      s.textContent = '@keyframes _ripple{to{width:220px;height:220px;opacity:0}}';
      document.head.appendChild(s);
    }
    this.appendChild(r);
    setTimeout(() => r.remove(), 650);
  });
}

/* ─────────────────────────────────────────────
   SETUP UI (called from main.js DOMContentLoaded)
───────────────────────────────────────────── */
function setupUI() {
  /* ── Scroll Progress Bar ── */
  const prog = document.createElement('div');
  prog.style.cssText =
    'position:fixed;top:0;left:0;height:3px;width:0;z-index:9998;pointer-events:none;' +
    'background:linear-gradient(90deg,#004d99,#ff9900);transition:width .1s linear';
  document.body.prepend(prog);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    prog.style.width = Math.min(pct,100) + '%';
  }, { passive:true });

  /* ── Navbar Shrink ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive:true });

  /* ── Theme ── */
  const themeBtn = document.getElementById('themeBtn');
  const applyTheme = t => {
    document.body.classList.toggle('dark-mode', t === 'dark');
    if (themeBtn) themeBtn.innerHTML = t === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  };
  applyTheme(localStorage.getItem('lm_theme') || 'light');
  themeBtn?.addEventListener('click', () => {
    const n = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('lm_theme', n); applyTheme(n);
  });

  /* ── Language ── */
  const langBtn  = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const curLang  = localStorage.getItem('lm_lang') || 'en';
  applyLang(curLang);

  langBtn?.addEventListener('click', e => { e.stopPropagation(); langMenu?.classList.toggle('show'); });
  document.addEventListener('click', e => {
    if (!langBtn?.contains(e.target) && !langMenu?.contains(e.target))
      langMenu?.classList.remove('show');
  });
  document.querySelectorAll('.lang-menu a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const l = a.dataset.lang;
      localStorage.setItem('lm_lang', l);
      applyLang(l);
      langMenu?.classList.remove('show');
    });
  });

  /* ── Active nav link ── */
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(lnk => {
    const h = lnk.getAttribute('href') || '';
    lnk.classList.toggle('active',
      h === pg || (pg === 'product-detail.html' && h === 'products.html'));
  });

  /* ── Scroll Reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold:.1 });
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .anim-fade, .anim-slide-left, .anim-slide-right, .anim-zoom-in, .anim-zoom-out, .anim-blur').forEach(el => io.observe(el));

  /* ── Counter Animation ── */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const h3 = e.target.querySelector('h3');
        if (h3 && !h3.dataset.done) {
          h3.dataset.done = '1';
          animCounter(h3, h3.textContent.trim());
        }
        cio.unobserve(e.target);
      }
    });
  }, { threshold:.5 });
  document.querySelectorAll('.stats-card').forEach(c => cio.observe(c));

  /* ── Ripple on all primary buttons ── */
  document.querySelectorAll('.btn-primary').forEach(addRipple);

  /* ── Wishlist Toggle ── */
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('lm_wishlist') || '[]'); } catch(e) { return []; }
  }
  function saveWishlist(arr) { localStorage.setItem('lm_wishlist', JSON.stringify(arr)); }
  function updateWishlistBtns() {
    const wl = getWishlist().map(String);
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = String(btn.dataset.id);
      btn.classList.toggle('active', wl.includes(id));
      btn.innerHTML = wl.includes(id)
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
    });
  }
  window.toggleWishlist = function(id) {
    const sid = String(id);
    let wl = getWishlist().map(String);
    if (wl.includes(sid)) { wl = wl.filter(x => x !== sid); }
    else { wl.push(sid); }
    saveWishlist(wl);
    updateWishlistBtns();
  };
  // Re-run after products render
  const _origRender = window.renderShopAndDetails;
  if (_origRender) {
    window.renderShopAndDetails = function() {
      _origRender.apply(this, arguments);
      updateWishlistBtns();
    };
  }
  updateWishlistBtns();

  /* ── Live Search Overlay ── */
  const searchOverlay = document.createElement('div');
  searchOverlay.className = 'search-overlay';
  searchOverlay.innerHTML = `
    <div class="search-box">
      <div class="search-input-wrap">
        <i class="fa-solid fa-search"></i>
        <input type="text" id="globalSearchInput" placeholder="Search products..." autocomplete="off">
        <button onclick="closeGlobalSearch()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--muted);padding:8px;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="search-results" id="globalSearchResults"></div>
    </div>`;
  document.body.appendChild(searchOverlay);

  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) closeGlobalSearch();
  });

  window.openGlobalSearch = function() {
    searchOverlay.classList.add('open');
    const input = document.getElementById('globalSearchInput');
    if (input) { input.value = ''; input.focus(); doGlobalSearch(''); }
  };
  window.closeGlobalSearch = function() {
    searchOverlay.classList.remove('open');
  };

  function doGlobalSearch(query) {
    const resultsEl = document.getElementById('globalSearchResults');
    if (!resultsEl) return;
    if (!query || query.length < 2) {
      resultsEl.innerHTML = '<div class="search-no-result">Type at least 2 characters to search</div>';
      return;
    }
    const q = query.toLowerCase();
    const matches = (window.DB || []).filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    ).slice(0, 8);

    if (matches.length === 0) {
      resultsEl.innerHTML = '<div class="search-no-result"><i class="fa-solid fa-search" style="font-size:2rem;margin-bottom:10px;display:block;color:var(--border);"></i>No results found</div>';
      return;
    }
    resultsEl.innerHTML = matches.map(p => `
      <a href="product-detail.html?id=${p.id}" class="search-result-item" style="text-decoration:none;color:inherit;">
        <img src="${p.image || 'images/cabinet.jpg'}" alt="${p.title}">
        <div class="search-result-info">
          <h4>${p.title}</h4>
          <span>$${parseFloat(p.price)||0}</span>
        </div>
      </a>
    `).join('');
  }

  document.addEventListener('keydown', e => {
    if (e.key === '/' && !searchOverlay.classList.contains('open')
        && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openGlobalSearch();
    }
    if (e.key === 'Escape') closeGlobalSearch();
  });

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => doGlobalSearch(e.target.value));
  }

  /* ── Lazy Loading for Images ── */
  if ('IntersectionObserver' in window) {
    const lazyIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          img.classList.add('loaded');
          lazyIO.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src], img.lazy-img').forEach(img => lazyIO.observe(img));
  }

  /* ── LIGHTBOX events ── */
  document.body.addEventListener('click', (e) => {
    // Product detail main image — open lightbox
    const mainImg = e.target.closest('.main-image img');
    if (mainImg) {
      const lbOverlay = document.getElementById('lightboxOverlay');
      const lbImg = document.getElementById('lightboxImg');
      if(lbOverlay && lbImg) {
        lbImg.src = mainImg.src;
        lbOverlay.classList.add('open');
        lbImg._gallery = window._gallery || [];
        lbImg._galleryIdx = window._gIdx || 0;
      }
      return;
    }
    // Rental property image — open lightbox
    const rentalImg = e.target.closest('.property-main-img');
    if (rentalImg) {
      const lbOverlay = document.getElementById('lightboxOverlay');
      const lbImg = document.getElementById('lightboxImg');
      if(lbOverlay && lbImg) {
        lbImg.src = rentalImg.src;
        lbOverlay.classList.add('open');
        lbImg._gallery = [];
        lbImg._galleryIdx = 0;
      }
    }
  });

  document.getElementById('lightboxClose')?.addEventListener('click', () => {
    document.getElementById('lightboxOverlay')?.classList.remove('open');
  });

  document.getElementById('lightboxOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightboxOverlay') {
      e.target.classList.remove('open');
    }
  });

  /* ── Lightbox prev/next click navigation ── */
  document.getElementById('lightboxPrev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const lbImg = document.getElementById('lightboxImg');
    if (lbImg?._gallery?.length) {
      lbImg._galleryIdx = (lbImg._galleryIdx - 1 + lbImg._gallery.length) % lbImg._gallery.length;
      lbImg.src = lbImg._gallery[lbImg._galleryIdx];
    }
  });
  document.getElementById('lightboxNext')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const lbImg = document.getElementById('lightboxImg');
    if (lbImg?._gallery?.length) {
      lbImg._galleryIdx = (lbImg._galleryIdx + 1) % lbImg._gallery.length;
      lbImg.src = lbImg._gallery[lbImg._galleryIdx];
    }
  });

  /* ── Lightbox keyboard navigation ── */
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightboxOverlay');
    if (lb && lb.classList.contains('open')) {
      const lbImg = document.getElementById('lightboxImg');
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowRight' && lbImg?._gallery?.length) {
        lbImg._galleryIdx = (lbImg._galleryIdx + 1) % lbImg._gallery.length;
        lbImg.src = lbImg._gallery[lbImg._galleryIdx];
      }
      if (e.key === 'ArrowLeft' && lbImg?._gallery?.length) {
        lbImg._galleryIdx = (lbImg._galleryIdx - 1 + lbImg._gallery.length) % lbImg._gallery.length;
        lbImg.src = lbImg._gallery[lbImg._galleryIdx];
      }
    }
  });

  /* ── Cart Open/Close ── */
  document.querySelectorAll('.cart-trigger').forEach(t =>
    t.addEventListener('click', e => { e.preventDefault(); renderCart(); document.getElementById('cartModal')?.classList.add('open'); }));
  document.getElementById('closeCart')?.addEventListener('click', () =>
    document.getElementById('cartModal')?.classList.remove('open'));
  document.getElementById('cartModal')?.addEventListener('click', e => {
    if (e.target.id === 'cartModal') e.target.classList.remove('open');
  });

  /* ── Invoice Actions ── */
  document.addEventListener('click', e => {
    if (e.target.closest('#viewInvBtn')) {
      document.getElementById('cartModal')?.classList.remove('open');
      showInvoice();
    }
  });
  document.getElementById('invBackdrop')?.addEventListener('click', () => {
    document.getElementById('invoiceModal')?.classList.remove('open');
    document.getElementById('invBackdrop')?.classList.remove('open');
  });
  document.addEventListener('click', e => {
    if (e.target.closest('#closeInv')) {
      document.getElementById('invoiceModal')?.classList.remove('open');
      document.getElementById('invBackdrop')?.classList.remove('open');
    }
    if (e.target.closest('#dlPdfBtn')) exportInvoicePDF();
    if (e.target.closest('#dlJpgBtn')) exportInvoiceJPG();
  });

  /* ── Add to Cart delegate ── */
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) addToCart(btn.dataset.id);
  });

  /* ── Checkout Process ── */
  document.addEventListener('click', async e => {
    if (e.target.closest('#checkoutTg')) {
      if (!cart.length) { showToast('Cart is empty'); return; }
      document.getElementById('checkoutModal')?.classList.add('open');
    }

    if (e.target.closest('#closeCheckout') || e.target.id === 'checkoutModal') {
      document.getElementById('checkoutModal')?.classList.remove('open');
    }

    if (e.target.closest('#coSubmitBtn')) {
      await processOrder();
    }

    // Checkout via Facebook/Phone/Email
    if (e.target.closest('#checkoutFb')) window.open('https://web.facebook.com/littlemaker.kh/','_blank');
    if (e.target.closest('#checkoutPhone')) location.href = 'tel:+855719716888';
    if (e.target.closest('#checkoutEmail') || e.target.closest('a[href^="mailto:"]') || e.target.closest('a[href*="email-protection"]')) {
      e.preventDefault();
      window.location.href = 'mailto:sales_v2@littlemaker.com.kh';
    }
  });

  // Email Button fix for home and contact pages
  document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && (link.href.includes('mailto:') || link.href.includes('email-protection'))) {
          e.preventDefault();
          window.location.href = 'mailto:sales_v2@littlemaker.com.kh';
      }
      
      const contactCard = e.target.closest('.contact-card, .email-btn');
      if (contactCard && contactCard.innerHTML.toLowerCase().includes('email')) {
          e.preventDefault();
          window.location.href = 'mailto:sales_v2@littlemaker.com.kh';
      }
  });

  /* ── Contact Form ── */
  document.getElementById('contactForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type=submit]');
    const orig = btn.innerHTML;

    const name    = form.querySelector('input[type=text]')?.value || '';
    const email   = form.querySelector('input[type=email]')?.value || '';
    const subject = form.querySelectorAll('input[type=text]')[1]?.value || '';
    const message = form.querySelector('textarea')?.value || '';

    const lang = localStorage.getItem('lm_lang') || 'en';
    const t = T[lang] || T.en;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (t.processing || 'Processing...');
    btn.disabled = true;

    // Save to Firebase
    if (window.fsDB && window.fsAddDoc && window.fsCollection) {
      try {
        await window.fsAddDoc(window.fsCollection(window.fsDB, "messages"), {
          name: name,
          email: email,
          subject: subject,
          message: message,
          status: 'unread',
          createdAt: new Date().toISOString()
        });
        showToast('✓ សារបានបញ្ជូន! (Message sent!)');
      } catch(err) { 
        console.error("Save message error:", err); 
        showToast('មានបញ្ហាភ្ជាប់ទៅកាន់ Database។ សូមឆែក Firebase Rules!');
      }
    } else {
        showToast('ប្រព័ន្ធកំពុងដំណើរការ សូមរង់ចាំបន្តិចរួចសាកល្បងម្តងទៀត');
    }

    const title = lang === 'kh' ? 'សារថ្មីពីវ៉ិបសាយ' : (lang === 'cn' ? '来自网站的新消息' : 'New Contact from Website');
    const msgBody = lang === 'kh' ? 'សារ' : (lang === 'cn' ? '信息' : 'Message');

    let rawMsg = '📩 ' + title + '\n\n';
    rawMsg += '👤 ' + (t.co_name || 'Name') + ': ' + name + '\n';
    rawMsg += '📧 ' + (t.cont_email || 'Email') + ': ' + email + '\n';
    rawMsg += '📌 ' + (t.ph_subj || 'Subject') + ': ' + subject + '\n\n';
    rawMsg += '💬 ' + msgBody + ':\n' + message;

    const tgMsg = encodeURIComponent(rawMsg);
    window.open('https://t.me/samnangkhiev?text=' + tgMsg, '_blank');

    btn.innerHTML = orig; btn.disabled = false;
    form.reset();
  });
}
