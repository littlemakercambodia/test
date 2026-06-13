/* ============================================================
   LITTLE MAKER — Contacts Widget (Replaced AI Chat)
   ============================================================ */

(function () {

  const TELEGRAM_USERNAME = "samnangkhiev";
  const FACEBOOK_URL = "https://web.facebook.com/littlemaker.kh/";
  
  function getLang() { return localStorage.getItem('lm_lang') || 'en'; }
  const L = {
    en: { btn_label: "Contacts", title: "Contact Us", sub: "We're here to help!" },
    kh: { btn_label: "ទំនាក់ទំនង", title: "ទាក់ទងមកយើង", sub: "យើងនៅទីនេះដើម្បីជួយអ្នក!" },
    cn: { btn_label: "联系方式", title: "联系我们", sub: "我们随时为您服务！" }
  };
  function t() { return L[getLang()] || L.en; }

  const css = document.createElement('style');
  css.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
    #floatingChatBtn, #floatingChatBox { display: none !important; }

    #lmAIBtn {
      position:fixed;bottom:28px;right:28px;z-index:10000;
      display:flex;align-items:center;gap:10px;
      background:linear-gradient(135deg, var(--red, #cc0000) 0%, #990000 100%);
      color:#fff;border:none;border-radius:56px;
      padding:14px 24px;cursor:pointer;
      font-family:'Battambang',sans-serif;font-weight:700;font-size:.95rem;
      box-shadow:0 8px 32px rgba(204,0,0,.45),0 2px 8px rgba(0,0,0,.15);
      transition:transform .3s cubic-bezier(.175,.885,.32,1.4),box-shadow .3s,opacity .3s;
    }
    #lmAIBtn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 40px rgba(204,0,0,.55)}
    #lmAIBtn.hidden{transform:scale(0);opacity:0;pointer-events:none}
    #lmAIBtn i{font-size:1.15rem}
    #lmAIBtn .pulse-ring{position:absolute;inset:-4px;border-radius:60px;border:2px solid rgba(204,0,0,.4);animation:pulseRing 2.5s ease-out infinite}
    @keyframes pulseRing{0%{transform:scale(1);opacity:1}100%{transform:scale(1.25);opacity:0}}
    @media(max-width:600px){#lmAIBtn{bottom:88px;right:20px;width:58px;height:58px;padding:0;border-radius:50%;justify-content:center}#lmAIBtn .lbl{display:none}#lmAIBtn .pulse-ring{border-radius:50%}}

    #lmAIBox{position:fixed;bottom:100px;right:28px;width:320px;background:#fff;border-radius:24px;box-shadow:0 32px 80px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08);z-index:10000;display:none;flex-direction:column;overflow:hidden;font-family:'Battambang',sans-serif}
    #lmAIBox.open{display:flex;animation:boxIn .35s cubic-bezier(.175,.885,.32,1.275)}
    @keyframes boxIn{from{opacity:0;transform:scale(.82) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @media(max-width:600px){#lmAIBox{right:10px;left:10px;width:auto;bottom:158px;border-radius:20px}}

    .lm-hdr{background:linear-gradient(135deg, var(--red, #cc0000), #990000);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;position:relative;overflow:hidden}
    .lm-hdr::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.06)}
    .lm-hdr-left{display:flex;align-items:center;gap:12px;z-index:1}
    .lm-avatar{width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:#fff;flex-shrink:0}
    .lm-hdr-info{flex:1}
    .lm-hdr-title{color:#fff;font-size:1.1rem;font-weight:700;margin:0}
    .lm-hdr-sub{color:rgba(255,255,255,.75);font-size:.8rem;display:flex;align-items:center;gap:5px;margin-top:2px}
    .lm-online-dot{width:7px;height:7px;background:#4cff91;border-radius:50%;display:inline-block;box-shadow:0 0 6px rgba(76,255,145,.8);animation:blink 2s ease-in-out infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
    .lm-hdr-actions{display:flex;gap:8px;z-index:1}
    .lm-icon-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);color:#fff;width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:background .2s}
    .lm-icon-btn:hover{background:rgba(255,255,255,.3)}

    .lm-social-list{display:flex;flex-direction:column;gap:12px;padding:24px 20px;background:#f8fafd; border-radius: 0 0 24px 24px;}
    .lm-social-btn{display:flex;align-items:center;gap:14px;text-decoration:none;font-size:1rem;font-weight:700;padding:12px 18px;border-radius:14px;color:#fff;transition:transform .2s;font-family:'Battambang',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.1)}
    .lm-social-btn.tg{background:linear-gradient(135deg,#3498db,#2980b9)}
    .lm-social-btn.fb{background:linear-gradient(135deg,#3b5998,#2d4373)}
    .lm-social-btn.loc{background:linear-gradient(135deg,#e74c3c,#c0392b)}
    .lm-social-btn.ph{background:linear-gradient(135deg,#2ecc71,#27ae60)}
    .lm-social-btn.em{background:linear-gradient(135deg,#f39c12,#d68910)}
    .lm-social-btn i { font-size: 1.1rem; background: #fff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .lm-social-btn.tg i { color: #3498db; }
    .lm-social-btn.fb i { color: #3b5998; }
    .lm-social-btn.loc i { color: #e74c3c; }
    .lm-social-btn.ph i { color: #2ecc71; }
    .lm-social-btn.em i { color: #f39c12; }
    .lm-social-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.15)}
    
    body.dark-mode #lmAIBox { background: #1c2230; }
    body.dark-mode .lm-social-list { background: #1c2230; }
  `;
  document.head.appendChild(css);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="lmAIBtn" aria-label="Contacts">
      <span class="pulse-ring"></span>
      <i class="fa-solid fa-address-book"></i>
      <span class="lbl" id="lmBtnLabel">${t().btn_label}</span>
    </button>

    <div id="lmAIBox" role="dialog">
      <div class="lm-hdr" style="border-radius: 24px 24px 0 0;">
        <div class="lm-hdr-left">
            <div class="lm-avatar"><i class="fa-solid fa-headset"></i></div>
            <div class="lm-hdr-info">
              <p class="lm-hdr-title" id="lmHdrTitle">${t().title}</p>
              <span class="lm-hdr-sub"><span class="lm-online-dot"></span> <span id="lmHdrSub">${t().sub}</span></span>
            </div>
        </div>
        <div class="lm-hdr-actions">
            <button class="lm-icon-btn" id="lmX"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>

      <div class="lm-social-list">
         <a href="https://t.me/${TELEGRAM_USERNAME}" target="_blank" class="lm-social-btn tg">
           <i class="fa-solid fa-paper-plane"></i> Telegram
         </a>
         <a href="${FACEBOOK_URL}" target="_blank" class="lm-social-btn fb">
           <i class="fa-brands fa-facebook-f"></i> Facebook
         </a>
         <a href="https://maps.app.goo.gl/zxstXqajatrwf3xZ9" target="_blank" class="lm-social-btn loc">
           <i class="fa-solid fa-location-dot"></i> Location
         </a>
         <a href="tel:+855719716888" class="lm-social-btn ph">
           <i class="fa-solid fa-phone"></i> +855 71 971 6888
         </a>
         <a href="mailto:sales_v2@littlemaker.com.kh" class="lm-social-btn em">
           <i class="fa-solid fa-envelope"></i> Email Us
         </a>
      </div>
    </div>
  `);

  function updateUI() {
    const lt = t();
    const el = id => document.getElementById(id);
    if(el('lmBtnLabel')) el('lmBtnLabel').textContent = lt.btn_label;
    if(el('lmHdrTitle')) el('lmHdrTitle').textContent = lt.title;
    if(el('lmHdrSub')) el('lmHdrSub').textContent = lt.sub;
  }

  document.querySelectorAll('.lang-menu a').forEach(a => {
    a.addEventListener('click', () => { setTimeout(updateUI, 100); });
  });
  let _lastLang = getLang();
  setInterval(() => { const c=getLang(); if(c!==_lastLang){_lastLang=c;updateUI();} }, 500);

  const fabBtn = document.getElementById('lmAIBtn');
  const chatBox = document.getElementById('lmAIBox');
  const xBtn = document.getElementById('lmX');
  let isOpen = false;

  const toggleBox = () => {
    isOpen = !isOpen;
    if(isOpen) {
      chatBox.classList.add('open');
      fabBtn.classList.add('hidden');
    } else {
      chatBox.classList.remove('open');
      fabBtn.classList.remove('hidden');
    }
  };

  fabBtn.addEventListener('click', toggleBox);
  xBtn.addEventListener('click', toggleBox);

})();