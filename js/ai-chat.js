/* ============================================================
   LITTLE MAKER — AI Chat Widget v9.0 (Live Language Switch)
   - Voice Input (Speech-to-Text)
   - Copy Message Button
   - Multiple API Keys / Load Balancing
   - Social Links & Quick FAQ
   - Session Memory
   - Markdown Parser
   - Dynamic Greeting
   - 3 Languages: EN, KH, CN
   - Google Maps Link
   - Fast Response
   - Live Language Switch (no reload)
   ════════════════════════════════════════════════════════════ */

(function () {

  const GEMINI_API_KEYS = [
    "AIzaSyCbU0LgcxJLcnVRDjF5XcCh3JWNbQTEepI",
    "AIzaSyCLXLfIB8kFz93jcgsWpjcg0NgX4rqq3pg"
  ];

  const TELEGRAM_USERNAME = "samnangkhiev";
  const FACEBOOK_URL = "https://web.facebook.com/littlemaker.kh/";
  const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/zxstXqajatrwf3xZ9";

  const MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b'];

  const SYSTEM_PROMPT = `You are a fast, helpful AI assistant for "LITTLEMAKER CAMBODIA".
RULES:
1. ALWAYS reply in the EXACT language the user speaks (Khmer, English, or Chinese).
2. Use **bold** for key terms, bullet points (-) for lists.
3. Be SHORT and direct (Under 80 words).
4. For exact pricing, say prices vary and suggest contacting Admin via Telegram.
5. Reply ONLY "TRANSFER_TO_ADMIN" if you can't help.

=== COMPANY DATA ===
- ISO 9001 manufacturing in Cambodia
- CNC Machining, Laser Cutting, Welding, CAD Design
- Steel office furniture, industrial parts
- Building Rental: factories in Svay Rieng & Phnom Penh
- Location: Svay Rieng Province (Google Maps available)
- Contact: sales_v2@littlemaker.com.kh | +855 71 971 6888`;

  /* ════════════════════════════════════════
     Multilingual Texts
  ════════════════════════════════════════ */
  const L = {
    en: {
      btn_label: "AI Chat", header_title: "Little Maker AI", header_sub: "Online 24/7",
      clear_title: "Clear chat", close_title: "Close",
      input_placeholder: "Ask a question...", listening: "Listening...",
      greeting: "Hello! 👋", greeting_pm: "Good Afternoon! ☀️", greeting_ev: "Good Evening! 🌙",
      welcome_msg: "I'm the Little Maker AI assistant. How can I help you today? You can type or **use voice input**! 🎙️",
      location_chip: "📍 Location", rental_chip: "🏢 Building Rental", price_chip: "💲 Prices",
      services_chip: "💼 Careers", contact_chip: "📞 Contact",
      transfer_msg: "Connecting you to Admin 👇", tg_label: "Chat Admin",
      error_msg: "Sorry, system busy. Please try again.",
      location_answer: `📍 **Little Maker Location:**\n\nOur factory is in **Svay Rieng Province, Cambodia**.\n\n🗺️ **Google Maps:**\n[Click here to open map](${GOOGLE_MAPS_URL})\n\nWe also have factories for rent.`,
      rental_answer: "🏢 **Building Rental:**\n\n- 24/7 security\n- Flexible terms\n- Svay Rieng & Phnom Penh\n\nClick **Telegram** to inquire.",
      price_answer: "💲 **Pricing:**\n\nPrices depend on size & requirements.\nContact Admin via **Telegram** for quotes.",
      services_answer: "💼 **Careers:**\n\n- CNC Machine Operator\n- Sales Executive\n- Mechanical Engineer\n\nContact us via **Telegram** to apply!",
      contact_answer: "📞 **Contact Us:**\n\n📧 sales_v2@littlemaker.com.kh\n📱 +855 71 971 6888\n📍 Svay Rieng Province\n\nClick **Telegram** to chat!",
      lang_placeholder: "en-US", time_locale: "en-US", day_label: "Today"
    },
    kh: {
      btn_label: "AI Chat", header_title: "Little Maker AI", header_sub: "Online ២៤/៧",
      clear_title: "សម្អាតសារ", close_title: "បិទ",
      input_placeholder: "សួរសំណួរ...", listening: "កំពុងស្តាប់...",
      greeting: "សួស្តី! 👋", greeting_pm: "ទិវាសួស្តី! ☀️", greeting_ev: "សាយ័ន្តសួស្តី! 🌙",
      welcome_msg: "ខ្ញុំជាជំនួយការ AI របស់ Little Maker។ តើខ្ញុំអាចជួយអ្វីបាន? អ្នកអាចវាយអក្សរ ឬ **និយាយជាសំឡេង**! 🎙️",
      location_chip: "📍 ទីតាំង", rental_chip: "🏢 ជួលអគារ", price_chip: "💲 តម្លៃ",
      services_chip: "💼 ការងារ", contact_chip: "📞 ទំនាក់ទំនង",
      transfer_msg: "កំពុងភ្ជាប់ទៅ Admin 👇", tg_label: "ជជែកជាមួយ Admin",
      error_msg: "សូមទោស ប្រព័ន្ធកំពុងមមាញឹក។",
      location_answer: `📍 **ទីតាំង Little Maker:**\n\nរោងចក្រយើងមាននៅ **ខេត្តស្វាយរៀង**។\n\n🗺️ **Google Maps:**\n[ចុចទីនេះដើម្បីបើកផែនទី](${GOOGLE_MAPS_URL})\n\nយើងក៏មានអគារសម្រាប់ជួលផងដែរ។`,
      rental_answer: "🏢 **ជួលអគារ៖**\n\n- សន្តិសុខ ២៤/៧\n- លក្ខខណ្ឌបត់បែន\n- ស្វាយរៀង និងភ្នំពេញ\n\nចុច **Telegram** ដើម្បីសួរ។",
      price_answer: "💲 **តម្លៃ៖**\n\nតម្លៃអាស្រ័យលើទំហំ និងតម្រូវការ។\nទាក់ទង Admin តាម **Telegram**។",
      services_answer: "💼 **ឱកាសការងារ៖**\n\n- ជាងម៉ាស៊ីន CNC\n- បុគ្គលិកផ្នែកលក់\n- វិស្វករមេកានិក\n\nទាក់ទងតាម **Telegram** ដើម្បីដាក់ពាក្យ!",
      contact_answer: "📞 **ទំនាក់ទំនង៖**\n\n📧 sales_v2@littlemaker.com.kh\n📱 +855 71 971 6888\n📍 ខេត្តស្វាយរៀង\n\nចុច **Telegram** ដើម្បីជជែក!",
      lang_placeholder: "km-KH", time_locale: "km-KH", day_label: "ថ្ងៃនេះ"
    },
    cn: {
      btn_label: "AI 聊天", header_title: "Little Maker AI", header_sub: "在线 24/7",
      clear_title: "清除聊天", close_title: "关闭",
      input_placeholder: "提问...", listening: "正在聆听...",
      greeting: "你好！👋", greeting_pm: "下午好！☀️", greeting_ev: "晚上好！🌙",
      welcome_msg: "我是 Little Maker 的 AI 助手。有什么可以帮助您的？您可以打字或**使用语音输入**！🎙️",
      location_chip: "📍 公司位置", rental_chip: "🏢 建筑租赁", price_chip: "💲 价格",
      services_chip: "💼 招贤纳士", contact_chip: "📞 联系方式",
      transfer_msg: "正在转接管理员 👇", tg_label: "联系管理员",
      error_msg: "抱歉，系统繁忙。请稍后再试。",
      location_answer: `📍 **Little Maker 位置：**\n\n我们的工厂位于**柬埔寨柴桢省**。\n\n🗺️ **Google 地图：**\n[点击打开地图](${GOOGLE_MAPS_URL})\n\n我们还有可供出租的厂房。`,
      rental_answer: "🏢 **建筑租赁：**\n\n- 24/7 安保\n- 灵活的条件\n- 柴桢省和金边\n\n点击 **Telegram** 咨询。",
      price_answer: "💲 **价格：**\n\n价格取决于尺寸和需求。\n请联系管理员获取报价，点击 **Telegram**。",
      services_answer: "💼 **招贤纳士：**\n\n- CNC 机床操作员\n- 销售主管\n- 机械工程师\n\n通过 **Telegram** 联系我们申请！",
      contact_answer: "📞 **联系我们：**\n\n📧 sales_v2@littlemaker.com.kh\n📱 +855 71 971 6888\n📍 柴桢省\n\n点击 **Telegram** 直接聊天！",
      lang_placeholder: "zh-CN", time_locale: "zh-CN", day_label: "今天"
    }
  };

  /* ════════════════════════════════════════
     CSS
  ════════════════════════════════════════ */
  const css = document.createElement('style');
  css.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
    #floatingChatBtn, #floatingChatBox { display: none !important; }

    #lmAIBtn {
      position:fixed;bottom:28px;right:28px;z-index:10000;
      display:flex;align-items:center;gap:10px;
      background:linear-gradient(135deg,#0f9d58 0%,#0b8043 100%);
      color:#fff;border:none;border-radius:56px;
      padding:14px 24px;cursor:pointer;
      font-family:'Battambang',sans-serif;font-weight:700;font-size:.95rem;
      box-shadow:0 8px 32px rgba(15,157,88,.45),0 2px 8px rgba(0,0,0,.15);
      transition:transform .3s cubic-bezier(.175,.885,.32,1.4),box-shadow .3s,opacity .3s;
    }
    #lmAIBtn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 40px rgba(15,157,88,.55)}
    #lmAIBtn.hidden{transform:scale(0);opacity:0;pointer-events:none}
    #lmAIBtn i{font-size:1.15rem}
    #lmAIBtn .pulse-ring{position:absolute;inset:-4px;border-radius:60px;border:2px solid rgba(15,157,88,.4);animation:pulseRing 2.5s ease-out infinite}
    @keyframes pulseRing{0%{transform:scale(1);opacity:1}100%{transform:scale(1.25);opacity:0}}
    @media(max-width:600px){#lmAIBtn{bottom:88px;right:20px;width:58px;height:58px;padding:0;border-radius:50%;justify-content:center}#lmAIBtn .lbl{display:none}#lmAIBtn .pulse-ring{border-radius:50%}}

    #lmAIBox{position:fixed;bottom:100px;right:28px;width:380px;max-height:580px;height:85vh;background:#fff;border-radius:24px;box-shadow:0 32px 80px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08);z-index:10000;display:none;flex-direction:column;overflow:hidden;font-family:'Battambang',sans-serif}
    #lmAIBox.open{display:flex;animation:boxIn .35s cubic-bezier(.175,.885,.32,1.275)}
    @keyframes boxIn{from{opacity:0;transform:scale(.82) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @media(max-width:600px){#lmAIBox{right:10px;left:10px;width:auto;bottom:158px;max-height:70vh;border-radius:20px}}

    .lm-hdr{background:linear-gradient(135deg,#0f9d58,#0b8043 50%,#0a6636);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;position:relative;overflow:hidden}
    .lm-hdr::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.06)}
    .lm-hdr-left{display:flex;align-items:center;gap:12px;z-index:1}
    .lm-avatar{width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:#fff;flex-shrink:0}
    .lm-hdr-info{flex:1}
    .lm-hdr-title{color:#fff;font-size:.98rem;font-weight:700;margin:0}
    .lm-hdr-sub{color:rgba(255,255,255,.75);font-size:.75rem;display:flex;align-items:center;gap:5px;margin-top:2px}
    .lm-online-dot{width:7px;height:7px;background:#4cff91;border-radius:50%;display:inline-block;box-shadow:0 0 6px rgba(76,255,145,.8);animation:blink 2s ease-in-out infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
    .lm-hdr-actions{display:flex;gap:8px;z-index:1}
    .lm-icon-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);color:#fff;width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:background .2s}
    .lm-icon-btn:hover{background:rgba(255,255,255,.3)}

    .lm-social-bar{display:flex;gap:8px;padding:10px 14px;background:#f8fafd;border-bottom:1px solid #edf0f7;justify-content:center;flex-shrink:0}
    .lm-social-btn{display:flex;align-items:center;gap:6px;text-decoration:none;font-size:.8rem;font-weight:700;padding:7px 14px;border-radius:20px;color:#fff;transition:transform .2s;font-family:'Battambang',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .lm-social-btn.tg{background:linear-gradient(135deg,#0088cc,#0099dd)}
    .lm-social-btn.fb{background:linear-gradient(135deg,#1877f2,#145dbf)}
    .lm-social-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.2)}

    #lmSuggestions{display:flex;gap:7px;padding:12px 14px 4px;overflow-x:auto;flex-shrink:0;scrollbar-width:none;background:#fff}
    #lmSuggestions::-webkit-scrollbar{display:none}
    .lm-chip{white-space:nowrap;padding:7px 14px;background:#e8f5e9;color:#0b8043;border:1px solid #c8e6c9;border-radius:20px;font-size:.8rem;cursor:pointer;flex-shrink:0;font-family:'Battambang',sans-serif;transition:all .2s}
    .lm-chip:hover{background:#0b8043;color:#fff;border-color:#0b8043}

    #lmMsgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:14px;background:#f8fafd;scroll-behavior:smooth}
    #lmMsgs::-webkit-scrollbar{width:5px}
    #lmMsgs::-webkit-scrollbar-track{background:transparent}
    #lmMsgs::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:5px}

    .lm-divider{text-align:center;font-size:.72rem;color:#9aa5b8;margin:4px 0;position:relative}
    .lm-divider::before,.lm-divider::after{content:'';position:absolute;top:50%;width:28%;height:1px;background:#e2e8f2}
    .lm-divider::before{left:0}.lm-divider::after{right:0}

    .lm-row{display:flex;align-items:flex-end;gap:8px}
    .lm-row.usr{flex-direction:row-reverse}
    .lm-bot-icon{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,#0f9d58,#0b8043);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.72rem;flex-shrink:0}

    .lm-bubble-wrap{position:relative;max-width:82%}
    .lm-bubble{padding:12px 16px;font-size:.9rem;line-height:1.6;animation:bubbleIn .25s ease;word-wrap:break-word}
    @keyframes bubbleIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    .lm-row.bot .lm-bubble{background:#fff;color:#1e2840;border-radius:4px 16px 16px 16px;box-shadow:0 2px 12px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.04)}
    .lm-row.usr .lm-bubble{background:linear-gradient(135deg,#0f9d58,#0b8043);color:#fff;border-radius:16px 4px 16px 16px;box-shadow:0 4px 16px rgba(15,157,88,.3)}

    .lm-copy-btn{position:absolute;bottom:0;right:-30px;width:24px;height:24px;border-radius:6px;background:#fff;border:1px solid #e2e8f0;color:#64748b;font-size:.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:all .2s}
    .lm-row.bot:hover .lm-copy-btn{opacity:1;transform:translateX(5px)}
    .lm-copy-btn:hover{background:#f1f5f9;color:#0f9d58}

    .lm-row.bot .lm-bubble strong{color:#0b8043;font-weight:700}
    .lm-row.bot .lm-bubble ul{margin:6px 0 6px 20px;padding:0;list-style-type:disc}
    .lm-row.bot .lm-bubble li{margin-bottom:4px}
    .lm-row.bot .lm-bubble a{color:#0b8043;text-decoration:underline;font-weight:600}

    .lm-dots{display:flex;gap:5px;align-items:center;padding:12px 16px;background:#fff;border-radius:4px 16px 16px 16px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
    .lm-dots span{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:dot 1.4s ease-in-out infinite}
    .lm-dots span:nth-child(2){animation-delay:.2s}.lm-dots span:nth-child(3){animation-delay:.4s}

    .lm-time{font-size:.65rem;color:#b0bad0;margin-top:5px;text-align:right}
    .lm-row.bot .lm-time{text-align:left}
    .lm-row.err .lm-bubble{background:#fff5f5;color:#c53030;border-left:3px solid #fc8181}

    .lm-tg-btn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#0088cc,#0099dd);color:#fff;border:none;padding:9px 16px;border-radius:12px;cursor:pointer;font-size:.85rem;margin-top:10px;font-family:'Battambang',sans-serif;text-decoration:none;box-shadow:0 4px 14px rgba(0,136,204,.3);font-weight:700;transition:transform .2s}
    .lm-tg-btn:hover{transform:translateY(-2px)}

    .lm-inp-bar{padding:10px 14px;background:#fff;border-top:1px solid #edf0f7;flex-shrink:0;display:flex;gap:8px;align-items:flex-end}

    #lmMicBtn{width:44px;height:44px;border-radius:13px;flex-shrink:0;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all .2s}
    #lmMicBtn:hover{background:#e2e8f0}
    #lmMicBtn.listening{background:#fee2e2;color:#ef4444;border-color:#fca5a5;animation:micPulse 1.5s infinite}
    @keyframes micPulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}

    #lmInp{flex:1;padding:11px 14px;border:1.5px solid #e2e8f2;border-radius:14px;outline:none;font-family:'Battambang',sans-serif;font-size:.9rem;resize:none;max-height:100px;background:#f8fafd;color:#1e2840;transition:border-color .2s}
    #lmInp:focus{border-color:#0b8043;background:#fff}
    #lmSndBtn{width:44px;height:44px;border-radius:13px;flex-shrink:0;background:linear-gradient(135deg,#0f9d58,#0b8043);color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(15,157,88,.3);transition:transform .2s}
    #lmSndBtn:hover{transform:scale(1.05)}
    #lmSndBtn:disabled{background:#cbd5e1;box-shadow:none;cursor:not-allowed}
    .lm-footer{text-align:center;font-size:.65rem;color:#94a3b8;padding:4px 14px 10px;background:#fff}
  `;
  document.head.appendChild(css);

  /* ════════════════════════════════════════
     Helpers
  ════════════════════════════════════════ */
  function getLang() { return localStorage.getItem('lm_lang') || 'en'; }
  function t() { return L[getLang()] || L.en; }

  /* ════════════════════════════════════════
     HTML Structure (built once, updated dynamically)
  ════════════════════════════════════════ */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="lmAIBtn" aria-label="AI Chat">
      <span class="pulse-ring"></span>
      <i class="fa-solid fa-robot"></i>
      <span class="lbl" id="lmBtnLabel">${t().btn_label}</span>
    </button>

    <div id="lmAIBox" role="dialog">
      <div class="lm-hdr">
        <div class="lm-hdr-left">
            <div class="lm-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="lm-hdr-info">
              <p class="lm-hdr-title" id="lmHdrTitle">${t().header_title}</p>
              <span class="lm-hdr-sub"><span class="lm-online-dot"></span> <span id="lmHdrSub">${t().header_sub}</span></span>
            </div>
        </div>
        <div class="lm-hdr-actions">
            <button class="lm-icon-btn" id="lmClearBtn" title="${t().clear_title}"><i class="fa-solid fa-trash-can"></i></button>
            <button class="lm-icon-btn" id="lmX" title="${t().close_title}"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>

      <div class="lm-social-bar">
         <a href="https://t.me/${TELEGRAM_USERNAME}" target="_blank" class="lm-social-btn tg"><i class="fa-brands fa-telegram"></i> Telegram</a>
         <a href="${FACEBOOK_URL}" target="_blank" class="lm-social-btn fb"><i class="fa-brands fa-facebook"></i> Facebook</a>
      </div>

      <div id="lmSuggestions">
        <span class="lm-chip" data-q="location" id="lmChipLoc">${t().location_chip}</span>
        <span class="lm-chip" data-q="services" id="lmChipSvc">${t().services_chip}</span>
        <span class="lm-chip" data-q="rental" id="lmChipRent">${t().rental_chip}</span>
        <span class="lm-chip" data-q="price" id="lmChipPrice">${t().price_chip}</span>
        <span class="lm-chip" data-q="contact" id="lmChipContact">${t().contact_chip}</span>
      </div>

      <div id="lmMsgs"></div>

      <div class="lm-inp-bar">
        <button id="lmMicBtn" title="Voice"><i class="fa-solid fa-microphone"></i></button>
        <textarea id="lmInp" rows="1" placeholder="${t().input_placeholder}"></textarea>
        <button id="lmSndBtn" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
      <div class="lm-footer">Powered by Dev : Khiev Samnang</div>
    </div>
  `);

  /* ════════════════════════════════════════
     Update UI on language change (no reload)
  ════════════════════════════════════════ */
  function updateAIChatUI() {
    const lt = t();
    const el = id => document.getElementById(id);
    if(el('lmBtnLabel')) el('lmBtnLabel').textContent = lt.btn_label;
    if(el('lmHdrTitle')) el('lmHdrTitle').textContent = lt.header_title;
    if(el('lmHdrSub')) el('lmHdrSub').textContent = lt.header_sub;
    if(el('lmClearBtn')) el('lmClearBtn').title = lt.clear_title;
    if(el('lmX')) el('lmX').title = lt.close_title;
    if(el('lmInp')) el('lmInp').placeholder = lt.input_placeholder;
    if(el('lmChipLoc')) el('lmChipLoc').textContent = lt.location_chip;
    if(el('lmChipSvc')) el('lmChipSvc').textContent = lt.services_chip;
    if(el('lmChipRent')) el('lmChipRent').textContent = lt.rental_chip;
    if(el('lmChipPrice')) el('lmChipPrice').textContent = lt.price_chip;
    if(el('lmChipContact')) el('lmChipContact').textContent = lt.contact_chip;
    if(recognition) recognition.lang = lt.lang_placeholder;
  }

  /* Listen for language changes from the site's lang switcher */
  document.querySelectorAll('.lang-menu a').forEach(a => {
    a.addEventListener('click', () => {
      setTimeout(updateAIChatUI, 100);
    });
  });
  /* Also watch localStorage for changes (fallback) */
  let _lastLang = getLang();
  setInterval(() => { const c=getLang(); if(c!==_lastLang){_lastLang=c;updateAIChatUI();} }, 500);

  /* ════════════════════════════════════════
     Logic
  ════════════════════════════════════════ */
  const fabBtn=document.getElementById('lmAIBtn'),chatBox=document.getElementById('lmAIBox'),
        xBtn=document.getElementById('lmX'),clearBtn=document.getElementById('lmClearBtn'),
        inp=document.getElementById('lmInp'),sndBtn=document.getElementById('lmSndBtn'),
        micBtn=document.getElementById('lmMicBtn'),msgs=document.getElementById('lmMsgs'),
        suggs=document.getElementById('lmSuggestions');
  let isOpen=false;

  /* Voice */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let recognition,isListening=false;
  if(SR){recognition=new SR();recognition.continuous=false;recognition.interimResults=true;
    recognition.onstart=()=>{isListening=true;micBtn.classList.add('listening');micBtn.innerHTML='<i class="fa-solid fa-microphone-lines"></i>';inp.placeholder=t().listening;};
    recognition.onresult=e=>{let s='';for(let i=e.resultIndex;i<e.results.length;i++)s+=e.results[i][0].transcript;inp.value=s;inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';};
    recognition.onend=()=>{isListening=false;micBtn.classList.remove('listening');micBtn.innerHTML='<i class="fa-solid fa-microphone"></i>';inp.placeholder=t().input_placeholder;if(inp.value.trim())sndBtn.focus();};
    recognition.onerror=()=>{isListening=false;micBtn.classList.remove('listening');micBtn.innerHTML='<i class="fa-solid fa-microphone"></i>';inp.placeholder=t().input_placeholder;};
    micBtn.addEventListener('click',()=>{if(isListening)recognition.stop();else{recognition.lang=t().lang_placeholder;inp.value='';recognition.start();}});
  }else{micBtn.style.display='none';}

  /* History */
  let hist=[];try{const h=sessionStorage.getItem('lm_ai_chat_hist');if(h)hist=JSON.parse(h);}catch(e){}
  function saveHistory(){sessionStorage.setItem('lm_ai_chat_hist',JSON.stringify(hist));}

  const now=()=>new Date().toLocaleTimeString(t().time_locale,{hour:'2-digit',minute:'2-digit'});
  const getGreeting=()=>{const hr=new Date().getHours();return hr<12?t().greeting:hr<18?t().greeting_pm:t().greeting_ev;};

  function parseMarkdown(text){
    return text
      .replace(/`([^`]+)`/g,'<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">$1</code>')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/(?:^|\n)- (.*?)(?=\n|$)/g,'<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s,'<ul style="margin:4px 0 4px 20px;">$1</ul>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" style="color:#0b8043;text-decoration:underline;font-weight:600">$1</a>')
      .replace(/\n/g,'<br>');
  }

  window._copyLmMsg=btn=>{navigator.clipboard.writeText(btn.parentElement.querySelector('.lm-bubble').innerText).then(()=>{const o=btn.innerHTML;btn.innerHTML='<i class="fa-solid fa-check"></i>';setTimeout(()=>btn.innerHTML=o,2000);}).catch(()=>{});};

  function renderHistory(){
    msgs.innerHTML=`<div class="lm-divider">${t().day_label}</div>`;
    if(hist.length===0){addBot(`${getGreeting()} ${t().welcome_msg}`);suggs.style.display='flex';}
    else{suggs.style.display='none';hist.forEach(m=>{if(m.role==='user')addUsr(m.parts[0].text,false);else addBot(m.parts[0].text,false);});}
    setTimeout(()=>msgs.scrollTop=msgs.scrollHeight,50);
  }

  const openChat=()=>{isOpen=true;chatBox.classList.add('open');fabBtn.classList.add('hidden');renderHistory();setTimeout(()=>inp.focus(),350);};
  const closeChat=()=>{isOpen=false;chatBox.classList.remove('open');fabBtn.classList.remove('hidden');if(isListening&&recognition)recognition.stop();};

  clearBtn.addEventListener('click',()=>{hist=[];saveHistory();renderHistory();inp.value='';inp.style.height='auto';});
  fabBtn.addEventListener('click',()=>isOpen?closeChat():openChat());
  xBtn.addEventListener('click',closeChat);
  sndBtn.addEventListener('click',send);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  inp.addEventListener('input',()=>{inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';});

  /* Quick Answers */
  const QA={location:()=>t().location_answer,rental:()=>t().rental_answer,price:()=>t().price_answer,services:()=>t().services_answer,contact:()=>t().contact_answer};

  document.querySelectorAll('.lm-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const k=chip.dataset.q,ans=QA[k]?QA[k]():null;
      if(ans){if(suggs)suggs.style.display='none';addUsr(chip.textContent.trim());hist.push({role:'user',parts:[{text:chip.textContent.trim()}]});saveHistory();const typ=addTyping();setTimeout(()=>{typ.remove();addBot(ans);hist.push({role:'model',parts:[{text:ans}]});saveHistory();},300);}
    });
  });

  function addBot(text){const row=document.createElement('div');row.className='lm-row bot';row.innerHTML=`<div class="lm-bot-icon"><i class="fa-solid fa-robot"></i></div><div class="lm-bubble-wrap"><div class="lm-bubble">${parseMarkdown(text)}</div><button class="lm-copy-btn" onclick="_copyLmMsg(this)"><i class="fa-regular fa-copy"></i></button><div class="lm-time">${now()}</div></div>`;msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;}
  function addUsr(text){const row=document.createElement('div');row.className='lm-row usr';row.innerHTML=`<div class="lm-bubble-wrap"><div class="lm-bubble">${text.replace(/</g,'<').replace(/\n/g,'<br>')}</div><div class="lm-time">${now()}</div></div>`;msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;}
  function addTyping(){const row=document.createElement('div');row.className='lm-row bot';row.id='lmTyp';row.innerHTML=`<div class="lm-bot-icon"><i class="fa-solid fa-robot"></i></div><div class="lm-bubble-wrap"><div class="lm-dots"><span></span><span></span><span></span></div></div>`;msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;return row;}
  function addErr(text){const row=document.createElement('div');row.className='lm-row err';row.innerHTML=`<div class="lm-bot-icon" style="background:linear-gradient(135deg,#c53030,#e53e3e)"><i class="fa-solid fa-triangle-exclamation"></i></div><div><div class="lm-bubble">${text}</div></div>`;msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;}
  function addTG(msg){const lang=getLang(),p=lang==='kh'?'🤖 AI Chat → Admin\n\n💬 សំណួរ: ':lang==='cn'?'🤖 AI Chat → Admin\n\n💬 问题: ':'🤖 AI Chat → Admin\n\n💬 Question: ';const row=document.createElement('div');row.className='lm-row bot';row.innerHTML=`<div class="lm-bot-icon"><i class="fa-solid fa-robot"></i></div><div class="lm-bubble-wrap"><div class="lm-bubble">${t().transfer_msg}<br><a class="lm-tg-btn" href="https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(p+msg)}" target="_blank"><i class="fa-brands fa-telegram"></i> ${t().tg_label}</a></div><div class="lm-time">${now()}</div></div>`;msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;}

  async function send(){
    const text=inp.value.trim();if(!text||sndBtn.disabled)return;
    if(isListening&&recognition)recognition.stop();if(suggs)suggs.style.display='none';
    addUsr(text);inp.value='';inp.style.height='auto';sndBtn.disabled=true;
    hist.push({role:'user',parts:[{text}]});saveHistory();
    const typ=addTyping();let done=false;
    let keys=[...GEMINI_API_KEYS].sort(()=>Math.random()-.5);
    for(let i=0;i<keys.length&&!done;i++){
      for(let j=0;j<MODELS.length&&!done;j++){
        try{
          const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELS[j]}:generateContent?key=${keys[i]}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:SYSTEM_PROMPT}]},contents:hist,generationConfig:{maxOutputTokens:200,temperature:.7}})});
          if(!res.ok){if(res.status===404)continue;else break;}
          const data=await res.json(),c=data?.candidates?.[0];
          if(c?.finishReason==='SAFETY')break;
          const reply=c?.content?.parts?.[0]?.text?.trim();
          typ.remove();
          if(!reply||reply==='TRANSFER_TO_ADMIN')addTG(text);
          else{addBot(reply);hist.push({role:'model',parts:[{text:reply}]});saveHistory();}
          done=true;break;
        }catch(e){console.warn(e.message);}
      }
    }
    if(!done){try{typ.remove();}catch(e){}addErr(t().error_msg);addTG(text);hist.pop();saveHistory();}
    sndBtn.disabled=false;inp.focus();
  }

})();