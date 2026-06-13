/* ================================================================
   LITTLEMAKER CAMBODIA — main.js v10.0 (Modular Orchestrator)
   Entry point that loads and coordinates all modules:
     translations.js → T object
     cart.js         → cart state, addToCart, renderCart
     invoice.js      → showInvoice, PDF/JPG export
     checkout.js     → processOrder
     chat-widget.js  → setupChatWidget
     products.js     → productCardHTML, renderShopAndDetails, DB
     ui.js           → applyLang, theme, scroll, navbar, lightbox, events
   ================================================================ */

'use strict';

/* ─────────────────────────────────────────────
   GLOBAL FIREBASE DB REFERENCES
───────────────────────────────────────────── */
window.fsDB = null;
window.fsAddDoc = null;
window.fsCollection = null;
window.fsGetDocs = null;
window.fsGetCountFromServer = null;

/* ─────────────────────────────────────────────
   INJECT MODAL HTML (Cart, Checkout, Invoice, Chat, Lightbox)
───────────────────────────────────────────── */
function injectCartHTML() {
  const html = `
  <!-- ── Cart Modal ── -->
  <div class="cart-modal-overlay" id="cartModal">
    <div class="cart-modal">
      <div class="cart-header">
        <h3 data-translate="cart_title">🛒 Shopping Cart</h3>
        <span class="close-cart" id="closeCart"><i class="fa-solid fa-xmark"></i></span>
      </div>
      <div class="cart-body" id="cartItems"></div>
      <div class="cart-footer">
        <div class="cart-total">
          <span data-translate="cart_total">Total</span>
          <span id="cartTotal">$0.00</span>
        </div>
        <div class="cart-actions-vertical" style="display:flex; flex-direction:column; gap:8px;">
            <button id="viewInvBtn" class="btn btn-outline" style="width:100%;justify-content:center;color:var(--text);border-color:var(--border);">
              <i class="fa-solid fa-file-invoice"></i> <span data-translate="btn_view_inv">View Invoice</span>
            </button>
            <button class="social-checkout-btn btn-telegram" id="checkoutTg">
              <i class="fa-brands fa-telegram"></i> <span data-translate="btn_order_tg">Order via Telegram</span>
            </button>
        </div>
        <div class="dual-btns" style="margin-top:8px;">
          <button class="social-checkout-btn btn-facebook" id="checkoutFb">
            <i class="fa-brands fa-facebook"></i> Facebook
          </button>
          <button class="social-checkout-btn btn-phone" id="checkoutPhone">
            <i class="fa-solid fa-phone"></i> <span data-translate="btn_call">Call</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Checkout Order Modal ── -->
  <div class="checkout-modal-overlay" id="checkoutModal">
    <div class="checkout-modal">
      <div class="checkout-header">
        <h3>📝 <span data-translate="co_title">Order Confirmation</span></h3>
        <span class="close-checkout" id="closeCheckout"><i class="fa-solid fa-xmark"></i></span>
      </div>
      <div class="checkout-body">
        <div class="form-group-co">
          <label><span data-translate="co_name">Name</span> <span style="color:var(--red)">*</span></label>
          <input type="text" id="coName" data-translate-placeholder="co_pl_name" placeholder="Enter your name" required>
        </div>
        <div class="form-group-co">
          <label><span data-translate="co_phone">Phone</span> <span style="color:var(--red)">*</span></label>
          <input type="text" id="coPhone" data-translate-placeholder="co_pl_phone" placeholder="Enter your phone number" required>
        </div>
        <div class="form-group-co">
          <label><span data-translate="co_loc">Location (Optional)</span></label>
          <textarea id="coLocation" rows="2" data-translate-placeholder="co_pl_loc" placeholder="Enter your address"></textarea>
        </div>
        <button class="btn btn-primary" id="coSubmitBtn" style="width:100%;justify-content:center;margin-top:10px;font-size:1.1rem;padding:12px;">
          <i class="fa-solid fa-paper-plane"></i> <span data-translate="btn_submit_order">Submit Order</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ── Invoice Modal ── -->
  <div class="invoice-backdrop" id="invBackdrop"></div>
  <div class="invoice-modal" id="invoiceModal">
    <div class="invoice-header-bar" id="invActionsBar">
      <h3 style="margin:0; font-size:1.2rem; color:var(--blue); font-family:'Barlow Condensed', sans-serif;"><i class="fa-solid fa-file-invoice"></i> <span data-translate="inv_main_title">INVOICE</span></h3>
      <div class="invoice-actions" id="invActions" style="display: flex; gap: 8px;">
        <button class="btn btn-outline" id="dlJpgBtn" style="color:#4a5568;border:1.5px solid #cbd5e0;padding:6px 14px;border-radius:6px;cursor:pointer;background:#fff;font-weight:700;font-size:0.9rem;"><i class="fa-solid fa-image"></i> JPG</button>
        <button class="btn btn-outline" id="dlPdfBtn" style="color:#4a5568;border:1.5px solid #cbd5e0;padding:6px 14px;border-radius:6px;cursor:pointer;background:#fff;font-weight:700;font-size:0.9rem;"><i class="fa-solid fa-file-pdf"></i> PDF</button>
        <button class="btn btn-primary" onclick="window.print()" style="background:#4f46e5;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.9rem;"><i class="fa-solid fa-print"></i> <span data-translate="btn_print">Print</span></button>
        <button class="btn btn-outline" id="closeInv" style="color:#ef4444;border:1.5px solid #fca5a5;padding:6px 14px;border-radius:6px;cursor:pointer;background:#fef2f2;font-weight:700;font-size:0.9rem;"><i class="fa-solid fa-xmark"></i> <span data-translate="btn_close">Close</span></button>
      </div>
    </div>
    <div class="invoice-scroll-area">
      <div class="invoice-paper" id="invoicePaper"></div>
    </div>
  </div>

  <!-- ── Floating Live Chat Widget ── -->
  <div id="floatingChatBtn" class="floating-chat-btn">
     <i class="fa-solid fa-comments"></i> <span style="font-family:'Battambang', sans-serif; font-weight:600; font-size:1rem;" data-translate="chat_title">Live Chat</span>
  </div>
  <div id="floatingChatBox" class="floating-chat-box">
     <div class="chat-header">
        <h4 style="margin:0; font-size:1.05rem; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-headset"></i> <span data-translate="chat_title">Live Chat</span></h4>
        <button id="closeFloatingChat"><i class="fa-solid fa-xmark"></i></button>
     </div>
     <div class="chat-body">
        <input type="text" id="fcName" data-translate-placeholder="co_pl_name" placeholder="Name" required>
        <input type="text" id="fcPhone" data-translate-placeholder="co_pl_phone" placeholder="Phone" required>
        <textarea id="fcMsg" rows="3" placeholder="..." required></textarea>
        <button id="fcSendBtn" class="btn btn-primary" style="width:100%; justify-content:center; padding:10px;"><i class="fa-solid fa-paper-plane"></i> <span data-translate="chat_send">Send</span></button>
     </div>
  </div>

  <!-- ── Image Lightbox ── -->
  <div class="lightbox-overlay" id="lightboxOverlay">
    <span class="lightbox-close" id="lightboxClose"><i class="fa-solid fa-xmark"></i></span>
    <span class="lightbox-prev" id="lightboxPrev"><i class="fa-solid fa-chevron-left"></i></span>
    <span class="lightbox-next" id="lightboxNext"><i class="fa-solid fa-chevron-right"></i></span>
    <img class="lightbox-img" id="lightboxImg" src="">
  </div>

  <style>
    /* Checkout Modal Styles */
    .checkout-modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(5px);
      z-index:100005; display:none; align-items:center; justify-content:center;
    }
    .checkout-modal-overlay.open { display:flex; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from {opacity:0} to {opacity:1} }
    .checkout-modal {
      background:var(--card); width:90%; max-width:440px; border-radius:var(--r);
      box-shadow:var(--sh3); overflow:hidden; transform:scale(0.95); transition:transform 0.3s var(--spring);
    }
    .checkout-modal-overlay.open .checkout-modal { transform:scale(1); }
    .checkout-header {
      background:linear-gradient(135deg,var(--blue),var(--blue-l)); color:#fff;
      padding:18px 24px; display:flex; justify-content:space-between; align-items:center;
    }
    .checkout-header h3 { margin:0; font-size:1.15rem; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.5px; }
    .close-checkout { cursor:pointer; font-size:1.3rem; transition:transform 0.2s; }
    .close-checkout:hover { transform:scale(1.2); }
    .checkout-body { padding:24px; }
    .form-group-co { margin-bottom:18px; }
    .form-group-co label { display:block; font-weight:600; font-size:0.9rem; margin-bottom:6px; color:var(--text); }
    .form-group-co input, .form-group-co textarea {
      width:100%; padding:12px 14px; border:1.5px solid var(--border); border-radius:8px;
      font-family:'Barlow',sans-serif; font-size:0.95rem; background:var(--light); color:var(--text); 
      outline:none; transition:border-color 0.2s, box-shadow 0.2s;
    }
    .form-group-co input:focus, .form-group-co textarea:focus { 
      border-color:var(--orange); box-shadow:0 0 0 4px rgba(255,153,0,0.1); background:var(--card); 
    }

    /* Invoice Modal Structural Styles */
    .invoice-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.66); backdrop-filter:blur(5px); z-index:100001; display:none; }
    .invoice-backdrop.open { display:block; }
    .invoice-modal {
      position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
      background:#f8fafc; width:95%; max-width:850px;
      border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,.2);
      z-index:100002; display:none; height:90vh; overflow:hidden;
      flex-direction:column;
    }
    .invoice-modal.open { display:flex; animation:popIn .3s ease; }
    @keyframes popIn { from{opacity:0;transform:translate(-50%,-50%) scale(.9)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
    .invoice-header-bar {
      background:#fff; padding:15px 24px; border-bottom:1px solid #e2e8f0;
      display:flex; justify-content:space-between; align-items:center; flex-shrink:0;
    }
    .invoice-scroll-area {
      flex:1; overflow-y:auto; padding:25px; background:#f1f5f9;
      display:flex; justify-content:center; align-items:flex-start;
    }
    .invoice-paper {
      background:#fff; width:100%; max-width:750px; min-height:100%;
      padding:40px; box-shadow:0 4px 15px rgba(0,0,0,.05);
    }

    /* Floating Chat Widget CSS */
    .floating-chat-btn { position:fixed; bottom:30px; right:30px; background:var(--red, #e53935); color:#fff; border-radius:50px; padding:12px 22px; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-shadow:0 6px 20px rgba(229,57,53,0.4); z-index:9999; transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);}
    .floating-chat-btn:hover { transform:scale(1.05); }
    .floating-chat-btn i { font-size: 1.2rem; }
    .floating-chat-box { position:fixed; bottom:95px; right:30px; width:340px; background:#fff; border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,0.18); z-index:9999; display:none; flex-direction:column; overflow:hidden; font-family:'Battambang', sans-serif;}
    .floating-chat-box.show { display:flex; animation:popIn 0.3s ease;}
    .chat-header { background:var(--blue, #004d99); color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
    .chat-header button { background:none; border:none; color:#fff; font-size:1.3rem; cursor:pointer; opacity:0.8; transition:opacity 0.2s;}
    .chat-header button:hover { opacity:1; }
    .chat-body { padding:20px; display:flex; flex-direction:column; gap:12px; background:#f8fafc;}
    .chat-body input, .chat-body textarea { width:100%; padding:12px 14px; border:1px solid #cbd5e0; border-radius:8px; outline:none; font-family:inherit; font-size:0.95rem;}
    .chat-body input:focus, .chat-body textarea:focus { border-color:var(--blue, #004d99); box-shadow:0 0 0 3px rgba(0,77,153,0.1);}
    
    /* Lightbox Styles */
    .lightbox-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:100010; display:none; align-items:center; justify-content:center; backdrop-filter:blur(8px); }
    .lightbox-overlay.open { display:flex; animation: fadeIn .3s ease; }
    .lightbox-img { max-width:90vw; max-height:85vh; border-radius:12px; box-shadow:0 15px 50px rgba(0,0,0,.5); transform:scale(0.95); transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); object-fit:contain; }
    .lightbox-overlay.open .lightbox-img { transform:scale(1); }
    .lightbox-close { position:absolute; top:25px; right:35px; color:#fff; font-size:2.5rem; cursor:pointer; transition:color .2s; background:rgba(255,255,255,0.1); width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
    .lightbox-close:hover { color:var(--orange); background:rgba(255,255,255,0.2); }
    
    @media (max-width: 600px) {
      .invoice-header-bar { flex-direction:column; gap:12px; }
      .invoice-actions { justify-content:center; width:100%; flex-wrap:wrap; }
      .invoice-paper { padding: 20px; }
      .invoice-scroll-area { padding: 10px; }
      .floating-chat-btn { bottom: 85px; right: 20px; width: 55px; height: 55px; padding: 0; border-radius: 50%; z-index: 100000; }
      .floating-chat-btn span { display: none; }
      .floating-chat-box { right: 15px; left: 15px; width: auto; bottom: 150px; z-index: 100000; }
      .lightbox-close { top:15px; right:15px; font-size:2rem; width:40px; height:40px; }
    }

    @media print {
      body * { visibility: hidden !important; }
      #invoiceModal, #invoiceModal * { visibility: visible !important; }
      #invoiceModal {
        position: absolute !important; left: 0 !important; top: 0 !important;
        transform: none !important; width: 100% !important; max-width: 100% !important;
        height: auto !important; overflow: visible !important;
        box-shadow: none !important; background: #fff !important;
      }
      .invoice-header-bar { display: none !important; }
      .invoice-scroll-area { height: auto !important; overflow: visible !important; padding: 0 !important; background: #fff !important; display: block !important; }
      .invoice-paper { box-shadow: none !important; width: 100% !important; max-width: none !important; padding: 0 !important; }
      @page { margin: 10mm; size: auto; }
    }
  </style>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

/* ─────────────────────────────────────────────
   CENTRALIZED FIREBASE INITIALIZATION
───────────────────────────────────────────── */
async function initApp() {
    // 1. Instant local render (Prevents blank pages)
    try {
       const saved = localStorage.getItem("lm_products");
       if (saved) { DB = JSON.parse(saved); } else { DB = DB_DEFAULT; }
       renderShopAndDetails();
    } catch(e) {}

    // 2. Initialize Firebase and fetch live data
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
      const { getFirestore, collection, getDocs, doc, getDoc, addDoc, getCountFromServer } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
      
      const firebaseConfig = {
        apiKey: "AIzaSyBGfVxJTpMJHjlWgUbbnAsot-c1gKrOgjM",
        authDomain: "littlemaker-cambodia.firebaseapp.com",
        projectId: "littlemaker-cambodia",
        storageBucket: "littlemaker-cambodia.firebasestorage.app",
        messagingSenderId: "81557668020",
        appId: "1:81557668020:web:2cb08751db05d6005c97e1"
      };
      
      const app = initializeApp(firebaseConfig);
      window.fsDB = getFirestore(app);
      window.fsCollection = collection;
      window.fsAddDoc = addDoc;
      window.fsGetDocs = getDocs;
      window.fsGetCountFromServer = getCountFromServer;

      // Fetch Translations
      try {
        const trSnap = await getDoc(doc(window.fsDB, "settings", "translations"));
        if (trSnap.exists()) {
          localStorage.setItem('lm_translations', JSON.stringify(trSnap.data()));
          applyLang(localStorage.getItem('lm_lang') || 'en');
        }
      } catch (e) {}

      // Fetch Products
      const snap = await getDocs(collection(window.fsDB, "products"));
      let fetched = [];
      snap.forEach(document => { fetched.push({ id: document.id, ...document.data() }); });
      fetched.sort((a,b) => (a.orderId||0) - (b.orderId||0));
      DB = fetched;
      localStorage.setItem('lm_products', JSON.stringify(DB));
      
      // Re-render UI with fresh data
      renderShopAndDetails();
    } catch(error) {
      console.warn("Using local products backup due to Firebase error:", error);
    }
}

/* ─────────────────────────────────────────────
   DOM READY — Initialize Everything
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Inject Khmer font for PDF export
  if (!document.getElementById('battambang-font')) {
    const link = document.createElement('link');
    link.id = 'battambang-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap';
    document.head.appendChild(link);
  }

  // 2. Page Loader
  const loader = document.createElement('div');
  loader.id = '_loader';
  loader.innerHTML = `
    <style>
      #_loader{position:fixed;inset:0;background:var(--bg, #ffffff);z-index:99999;
        display:flex;align-items:center;justify-content:center;flex-direction:column;gap:35px;
        transition:opacity .6s cubic-bezier(0.8, 0, 0.2, 1)}
      ._logo_wrap{position:relative; width: 160px; display:flex; justify-content:center;}
      ._logo_wrap img{width: 100%; height: auto; animation: floatLogo 2.5s ease-in-out infinite;}
      ._spinner_container { position: relative; width: 220px; height: 4px; background: rgba(204,0,0,0.1); border-radius: 8px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); }
      ._spinner_bar { position: absolute; top: 0; left: -100%; height: 100%; width: 50%; background: linear-gradient(90deg, transparent, var(--red, #cc0000), transparent); animation: sweepBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; border-radius: 8px; box-shadow: 0 0 10px rgba(204,0,0,0.4); }
      @keyframes floatLogo {
          0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 8px 16px rgba(204,0,0,0.15)); }
          50% { transform: translateY(-10px) scale(1.05); filter: drop-shadow(0 15px 25px rgba(204,0,0,0.25)); }
      }
      @keyframes sweepBar {
          0% { left: -100%; width: 30%; }
          50% { width: 60%; }
          100% { left: 150%; width: 30%; }
      }
      body.dark-mode #_loader { background: #050a15; }
      body.dark-mode ._spinner_container { background: rgba(255,255,255,0.1); }
      body.dark-mode ._spinner_bar { background: linear-gradient(90deg, transparent, #ff4d4d, transparent); box-shadow: 0 0 12px rgba(255,77,77,0.6); }
    </style>
    <div class="_logo_wrap"><img src="images/Logo.png" alt="Loading..."></div>
    <div class="_spinner_container"><div class="_spinner_bar"></div></div>`;
  document.body.prepend(loader);
  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 520);
  });

  // 3. Inject all modal HTML
  injectCartHTML();
  refreshBadge();

  // 4. Setup all UI events (theme, lang, scroll, cart, invoice, checkout, etc.)
  setupUI();

  // 5. Setup chat widget
  setupChatWidget();

  // 6. Load AI Chat Widget script
  const aiChatScript = document.createElement('script');
  aiChatScript.src = 'js/ai-chat.js';
  aiChatScript.defer = true;
  document.body.appendChild(aiChatScript);

  // 7. Initialize Firebase and load products
  initApp();
});