/* ================================================================
   LITTLEMAKER CAMBODIA — admin-ai-assistant.js  v2.2 (Fixed)
   Module: Floating AI Assistant Drawer (Gemini API)
   Fixes:
     - Drag position bug (left/top consistent, no transform conflict)
     - Updated model names to valid Gemini models (2025/2026)
     - Fixed HTTP 404: removed deprecated preview model names
     - Better error handling (401, 403, 404, blocked content)
     - Response safety check
   ================================================================ */

'use strict';

window.initAIAssistant = function() {
    if (document.getElementById('aiTriggerBtn')) return;

    // 1. CSS Styles
    if (!document.getElementById('aiAssistantStyles')) {
        const style = document.createElement('style');
        style.id = 'aiAssistantStyles';
        style.innerHTML = `
            .ai-trigger-btn {
                position: fixed; bottom: 30px; right: 30px;
                background: linear-gradient(135deg, #6c3483, #8e44ad);
                color: #fff; border: none; border-radius: 50px;
                padding: 14px 24px;
                font-family: 'Battambang', 'Barlow', sans-serif;
                font-weight: 700; font-size: 1rem;
                cursor: grab; box-shadow: 0 10px 25px rgba(142,68,173,0.4);
                display: flex; align-items: center; gap: 10px;
                z-index: 99999; user-select: none; touch-action: none;
                transition: box-shadow 0.3s ease;
            }
            .ai-trigger-btn:hover { box-shadow: 0 14px 30px rgba(142,68,173,0.5); }
            .ai-trigger-btn:active { cursor: grabbing; }
            .ai-trigger-btn.dragging { opacity: 0.9; }
            .ai-trigger-btn i.fa-wand-magic-sparkles {
                font-size: 1.2rem; pointer-events: none;
                animation: starPulse 2s infinite;
            }
            .ai-trigger-btn span { pointer-events: none; }
            @keyframes starPulse {
                0%,100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }

            .ai-drawer-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.4);
                backdrop-filter: blur(3px); z-index: 999998;
                opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
            }
            .ai-drawer-overlay.show { opacity: 1; pointer-events: auto; }

            .ai-drawer {
                position: fixed; top: 0; right: -450px;
                width: 100%; max-width: 420px; height: 100vh;
                background: #fff; z-index: 999999;
                box-shadow: -10px 0 40px rgba(0,0,0,0.15);
                display: flex; flex-direction: column;
                transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.05);
            }
            .ai-drawer.open { right: 0; }

            .ai-header {
                background: linear-gradient(135deg, #6c3483, #8e44ad);
                padding: 18px 24px; color: #fff;
                display: flex; justify-content: space-between; align-items: center;
                flex-shrink: 0;
            }
            .ai-header-title {
                font-family: 'Battambang', sans-serif; font-weight: 800;
                font-size: 1.15rem; display: flex; align-items: center;
                gap: 10px; margin: 0;
            }
            .ai-header-actions { display: flex; gap: 8px; }
            .ai-icon-btn {
                background: rgba(255,255,255,0.15); border: none;
                width: 34px; height: 34px; border-radius: 8px; color: #fff;
                cursor: pointer; transition: 0.2s;
                display: flex; align-items: center; justify-content: center;
                font-size: 0.95rem;
            }
            .ai-icon-btn:hover { background: #fff; color: #8e44ad; }

            .ai-settings-panel {
                display: none; padding: 20px;
                background: #fbfdff; border-bottom: 1px solid var(--bd);
                flex-shrink: 0; animation: slideDown 0.3s ease;
                max-height: 50vh; overflow-y: auto;
            }
            .ai-settings-panel.show { display: block; }
            @keyframes slideDown {
                from { transform: translateY(-10px); opacity: 0; }
                to   { transform: translateY(0); opacity: 1; }
            }
            .ai-set-group { margin-bottom: 12px; }
            .ai-set-group label {
                display: block; font-size: 0.75rem; font-weight: 700;
                color: var(--mu); text-transform: uppercase; margin-bottom: 6px;
                font-family: 'Battambang', sans-serif;
            }
            .ai-set-group input, .ai-set-group select {
                width: 100%; padding: 10px 12px;
                border: 1.5px solid var(--bd); border-radius: 8px;
                font-size: 0.85rem; outline: none; transition: 0.2s;
                font-family: 'Barlow', 'Battambang', sans-serif;
            }
            .ai-set-group input:focus, .ai-set-group select:focus {
                border-color: #8e44ad;
                box-shadow: 0 0 0 3px rgba(142,68,173,0.1);
            }
            .ai-set-note { font-size: 0.7rem; color: var(--mu); margin-top: 4px; display: block; }

            .ai-chat-body {
                flex: 1; overflow-y: auto; padding: 20px;
                background: #f8fafc; display: flex;
                flex-direction: column; gap: 16px; scroll-behavior: smooth;
            }
            .ai-msg {
                max-width: 85%; padding: 14px 18px; border-radius: 16px;
                font-family: 'Battambang', 'Barlow', sans-serif;
                font-size: 0.95rem; line-height: 1.6; word-wrap: break-word;
                animation: popIn 0.3s ease;
            }
            @keyframes popIn {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .ai-msg.bot {
                background: #fff; color: var(--text);
                border: 1px solid var(--bd); border-top-left-radius: 4px;
                align-self: flex-start;
                box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            }
            .ai-msg.user {
                background: var(--blue); color: #fff;
                border-top-right-radius: 4px; align-self: flex-end;
                box-shadow: 0 4px 10px rgba(0,77,153,0.2);
            }
            .ai-msg.error {
                background: #fff0f0; color: #cc2222;
                border: 1px solid #f5c6c6; border-top-left-radius: 4px;
                align-self: flex-start;
            }
            .ai-msg.bot strong { color: #8e44ad; font-weight: 800; }
            .ai-msg.bot p { margin-bottom: 10px; }
            .ai-msg.bot p:last-child { margin-bottom: 0; }
            .ai-msg.bot ul { margin-left: 20px; margin-bottom: 10px; }
            .ai-msg.bot li { margin-bottom: 5px; }
            .ai-msg.bot code {
                background: #f0e8f8; color: #6c3483;
                padding: 1px 5px; border-radius: 4px; font-size: 0.88rem;
            }

            .ai-typing {
                display: none; align-items: center; gap: 5px;
                padding: 14px 18px; background: #fff;
                border: 1px solid var(--bd); border-radius: 16px;
                border-top-left-radius: 4px; align-self: flex-start;
                width: fit-content;
            }
            .ai-typing span {
                width: 8px; height: 8px; background: #8e44ad;
                border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both;
            }
            .ai-typing span:nth-child(1) { animation-delay: -0.32s; }
            .ai-typing span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40%           { transform: scale(1); }
            }

            .ai-quick-prompts {
                display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
            }
            .ai-chip {
                background: #e8dbef; color: #6c3483;
                border: 1px solid #d2b4de; padding: 6px 12px;
                border-radius: 50px; font-size: 0.8rem;
                font-family: 'Battambang', sans-serif;
                cursor: pointer; transition: 0.2s; white-space: nowrap;
            }
            .ai-chip:hover { background: #6c3483; color: #fff; }

            .ai-input-area {
                padding: 20px; background: #fff;
                border-top: 1px solid var(--bd);
                display: flex; gap: 10px; align-items: flex-end;
            }
            .ai-textarea {
                flex: 1; border: 1.5px solid var(--bd); border-radius: 12px;
                padding: 12px 14px;
                font-family: 'Battambang', 'Barlow', sans-serif;
                font-size: 0.95rem; resize: none; outline: none;
                background: var(--bg); transition: 0.2s;
                max-height: 120px; min-height: 50px;
            }
            .ai-textarea:focus {
                border-color: #8e44ad; background: #fff;
                box-shadow: 0 0 0 3px rgba(142,68,173,0.1);
            }
            .ai-send-btn {
                background: #6c3483; color: #fff; border: none;
                width: 50px; height: 50px; border-radius: 12px;
                cursor: pointer; display: flex; align-items: center;
                justify-content: center; font-size: 1.2rem;
                transition: 0.2s; flex-shrink: 0;
            }
            .ai-send-btn:hover {
                background: #8e44ad; transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(142,68,173,0.3);
            }
            .ai-send-btn:disabled {
                background: var(--mu); cursor: not-allowed;
                transform: none; box-shadow: none;
            }

            .ai-model-badge {
                font-size: 0.65rem; padding: 2px 7px;
                background: rgba(255,255,255,0.2); border-radius: 99px;
                margin-left: 4px; font-weight: 600; letter-spacing: 0.3px;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. HTML Structure
    const html = `
        <button id="aiTriggerBtn" class="ai-trigger-btn" title="ទាញដើម្បីប្តូរទីតាំង · ចុចដើម្បីបើក">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>ជំនួយការ AI</span>
        </button>

        <div id="aiOverlay" class="ai-drawer-overlay"></div>

        <div id="aiDrawer" class="ai-drawer">
            <div class="ai-header">
                <h3 class="ai-header-title">
                    <i class="fa-solid fa-robot"></i>
                    <span id="aiHeaderName">LittleMaker AI</span>
                    <span class="ai-model-badge" id="aiModelBadge">Gemini</span>
                </h3>
                <div class="ai-header-actions">
                    <button id="aiClearBtn" class="ai-icon-btn" title="Clear Chat">
                        <i class="fa-solid fa-broom"></i>
                    </button>
                    <button id="aiSettingsBtn" class="ai-icon-btn" title="Settings">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                    <button id="aiCloseBtn" class="ai-icon-btn" title="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- Settings Panel -->
            <div class="ai-settings-panel" id="aiSettingsPanel">
                <div class="ai-set-group">
                    <label>🔑 Gemini API Key (Google AI Studio)</label>
                    <input type="password" id="aiKeyInput"
                           placeholder="AIzaSy...">
                    <span class="ai-set-note">
                        ទទួល API Key ឥតគិតថ្លៃនៅ
                        <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#8e44ad;">aistudio.google.com</a>
                    </span>
                </div>

                <div class="ai-set-group">
                    <label>🤖 ម៉ូដែល AI</label>
                    <select id="aiModelInput">
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash ⚡ (ល្អបំផុត)</option>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (ល្អ)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (ឆាប់)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (ប្រសើរ)</option>
                    </select>
                    <span class="ai-set-note">
                        ប្រព័ន្ធនឹងប្តូរម៉ូដែលដោយស្វ័យប្រវត្តិ បើម៉ូដែលដែលជ្រើសរើស Error
                    </span>
                </div>

                <div class="ai-set-group">
                    <label>💬 ឈ្មោះជំនួយការ</label>
                    <input type="text" id="aiNameInput" placeholder="LittleMaker AI">
                </div>

                <div class="ai-set-group">
                    <label>🎯 ស្ទីលឆ្លើយតប</label>
                    <select id="aiToneInput">
                        <option value="professional">មានវិជ្ជាជីវៈ និងរាក់ទាក់ (Professional)</option>
                        <option value="creative">ច្នៃប្រឌិត ទាក់ទាញ (Sales Creative)</option>
                        <option value="concise">ខ្លី ច្បាស់លាស់ (Concise)</option>
                    </select>
                </div>

                <button class="btn bp" id="aiSaveSettingsBtn"
                        style="width:100%;justify-content:center;background:#6c3483;border:none;margin-top:4px;">
                    <i class="fa-solid fa-save"></i> រក្សាទុកការកំណត់
                </button>
            </div>

            <!-- Chat Body -->
            <div class="ai-chat-body" id="aiChatBody">
                <div class="ai-msg bot">
                    សួស្តី Admin! 👋 ខ្ញុំជាជំនួយការ AI របស់លោកអ្នក។<br>
                    តើថ្ងៃនេះចង់ឱ្យខ្ញុំជួយអ្វី?
                </div>
                <div class="ai-quick-prompts">
                    <button class="ai-chip"
                        onclick="window.sendQuickPrompt('សូមជួយសរសេរការពិពណ៌នាដ៏ទាក់ទាញសម្រាប់ផលិតផលតុការិយាល័យ។')">
                        📝 ការពិពណ៌នាផលិតផល
                    </button>
                    <button class="ai-chip"
                        onclick="window.sendQuickPrompt('តើគួរឆ្លើយតបយ៉ាងណាទៅកាន់អតិថិជនដែលសួររកបញ្ចុះតម្លៃ?')">
                        ✉️ ឆ្លើយសារអតិថិជន
                    </button>
                    <button class="ai-chip"
                        onclick="window.sendQuickPrompt('សូមជួយបកប្រែទៅជាភាសាអង់គ្លេស និងចិន: [វាយអត្ថបទ]')">
                        🌐 បកប្រែភាសា
                    </button>
                    <button class="ai-chip"
                        onclick="window.sendQuickPrompt('សូមជួយបង្ហាញ SEO description ខ្លីៗ ១-២ ប្រយោគ សម្រាប់ LittleMaker Cambodia')">
                        🔍 SEO Description
                    </button>
                </div>
                <div id="aiTyping" class="ai-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <!-- Input Area -->
            <div class="ai-input-area">
                <textarea id="aiInput" class="ai-textarea" rows="1"
                          placeholder="សួរអ្វីក៏បាន ឬវាយបញ្ជា..."></textarea>
                <button id="aiSendBtn" class="ai-send-btn">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // 3. Element References
    const triggerBtn      = document.getElementById('aiTriggerBtn');
    const overlay         = document.getElementById('aiOverlay');
    const drawer          = document.getElementById('aiDrawer');
    const closeBtn        = document.getElementById('aiCloseBtn');
    const clearBtn        = document.getElementById('aiClearBtn');
    const settingsBtn     = document.getElementById('aiSettingsBtn');
    const settingsPanel   = document.getElementById('aiSettingsPanel');
    const saveSettingsBtn = document.getElementById('aiSaveSettingsBtn');

    const keyInput    = document.getElementById('aiKeyInput');
    const modelInput  = document.getElementById('aiModelInput');
    const nameInput   = document.getElementById('aiNameInput');
    const toneInput   = document.getElementById('aiToneInput');
    const headerName  = document.getElementById('aiHeaderName');
    const modelBadge  = document.getElementById('aiModelBadge');

    const input           = document.getElementById('aiInput');
    const sendBtn         = document.getElementById('aiSendBtn');
    const chatBody        = document.getElementById('aiChatBody');
    const typingIndicator = document.getElementById('aiTyping');

    // 4. Settings
    function loadSettings() {
        const savedKey   = localStorage.getItem('lm_ai_api_key') || '';
        const savedModel = localStorage.getItem('lm_ai_model')   || 'gemini-2.5-flash';
        const savedName  = localStorage.getItem('lm_ai_name')    || 'LittleMaker AI';
        const savedTone  = localStorage.getItem('lm_ai_tone')    || 'professional';

        keyInput.value   = savedKey;
        modelInput.value = savedModel;
        nameInput.value  = savedName;
        toneInput.value  = savedTone;

        headerName.textContent = savedName;
        modelBadge.textContent = savedModel.includes('2.5') ? 'Gemini 2.5'
                               : savedModel.includes('2.0') ? 'Gemini 2.0'
                               : 'Gemini 1.5';
    }
    loadSettings();

    settingsBtn.addEventListener('click', () => settingsPanel.classList.toggle('show'));

    saveSettingsBtn.addEventListener('click', () => {
        const newKey   = keyInput.value.trim();
        const newModel = modelInput.value;
        const newName  = nameInput.value.trim() || 'LittleMaker AI';
        const newTone  = toneInput.value;

        localStorage.setItem('lm_ai_api_key', newKey);
        localStorage.setItem('lm_ai_model',   newModel);
        localStorage.setItem('lm_ai_name',    newName);
        localStorage.setItem('lm_ai_tone',    newTone);

        headerName.textContent = newName;
        modelBadge.textContent = newModel.includes('2.5') ? 'Gemini 2.5'
                               : newModel.includes('2.0') ? 'Gemini 2.0'
                               : 'Gemini 1.5';
        settingsPanel.classList.remove('show');

        if (typeof window.toast === 'function') {
            window.toast('រក្សាទុករួចរាល់!', 'success');
        }
    });

    // 5. =====================================================
    //    DRAG — FIX: use left/top only, no transform conflict
    //    =====================================================
    let isDragging = false;
    let wasDragged = false;
    let startPointerX, startPointerY, startBtnLeft, startBtnTop;

    // Restore saved position using left/top
    try {
        const savedPos = JSON.parse(localStorage.getItem('lm_ai_btn_pos') || 'null');
        if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
            const safeLeft = Math.max(0, Math.min(savedPos.left, window.innerWidth - triggerBtn.offsetWidth - 10));
            const safeTop  = Math.max(0, Math.min(savedPos.top,  window.innerHeight - 60));
            triggerBtn.style.right  = 'auto';
            triggerBtn.style.bottom = 'auto';
            triggerBtn.style.left   = safeLeft + 'px';
            triggerBtn.style.top    = safeTop  + 'px';
        }
    } catch (e) {}

    function getPointer(e) {
        return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                         : { x: e.clientX, y: e.clientY };
    }

    function onDragStart(e) {
        if (!triggerBtn.contains(e.target)) return;
        const p = getPointer(e);
        const rect = triggerBtn.getBoundingClientRect();
        startPointerX = p.x;
        startPointerY = p.y;
        startBtnLeft  = rect.left;
        startBtnTop   = rect.top;
        isDragging    = true;
        wasDragged    = false;
        triggerBtn.classList.add('dragging');
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const p    = getPointer(e);
        const dx   = p.x - startPointerX;
        const dy   = p.y - startPointerY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) wasDragged = true;

        const newLeft = Math.max(0, Math.min(startBtnLeft + dx, window.innerWidth  - triggerBtn.offsetWidth));
        const newTop  = Math.max(0, Math.min(startBtnTop  + dy, window.innerHeight - triggerBtn.offsetHeight));

        triggerBtn.style.right  = 'auto';
        triggerBtn.style.bottom = 'auto';
        triggerBtn.style.left   = newLeft + 'px';
        triggerBtn.style.top    = newTop  + 'px';
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        triggerBtn.classList.remove('dragging');
        const rect = triggerBtn.getBoundingClientRect();
        localStorage.setItem('lm_ai_btn_pos', JSON.stringify({ left: rect.left, top: rect.top }));
    }

    triggerBtn.addEventListener('mousedown',  onDragStart);
    document.addEventListener('mousemove',    onDragMove);
    document.addEventListener('mouseup',      onDragEnd);
    triggerBtn.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove',    onDragMove,  { passive: false });
    document.addEventListener('touchend',     onDragEnd);

    // 6. Drawer Toggle
    function toggleDrawer() {
        if (wasDragged) { wasDragged = false; return; }
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            drawer.classList.remove('open');
            overlay.classList.remove('show');
            settingsPanel.classList.remove('show');
        } else {
            drawer.classList.add('open');
            overlay.classList.add('show');
            setTimeout(() => input.focus(), 350);
        }
    }

    triggerBtn.addEventListener('click', toggleDrawer);
    closeBtn.addEventListener('click',   toggleDrawer);
    overlay.addEventListener('click',    toggleDrawer);

    // Clear chat
    clearBtn.addEventListener('click', () => {
        window.aiChatHistory = [];
        chatBody.innerHTML = `
            <div class="ai-msg bot">Chat ត្រូវបានសម្អាត។ តើចង់ជួយអ្វី?</div>
            <div class="ai-quick-prompts">
                <button class="ai-chip" onclick="window.sendQuickPrompt('សូមជួយសរសេរការពិពណ៌នាដ៏ទាក់ទាញសម្រាប់ផលិតផលតុការិយាល័យ។')">📝 ការពិពណ៌នាផលិតផល</button>
                <button class="ai-chip" onclick="window.sendQuickPrompt('តើគួរឆ្លើយតបយ៉ាងណាទៅកាន់អតិថិជនដែលសួររកបញ្ចុះតម្លៃ?')">✉️ ឆ្លើយសារអតិថិជន</button>
                <button class="ai-chip" onclick="window.sendQuickPrompt('សូមជួយបកប្រែទៅជាភាសាអង់គ្លេស និងចិន: [វាយអត្ថបទ]')">🌐 បកប្រែភាសា</button>
            </div>
            <div id="aiTyping" class="ai-typing"><span></span><span></span><span></span></div>`;
    });

    // 7. Input Events
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    });
    sendBtn.addEventListener('click', sendMsg);

    window.sendQuickPrompt = function(text) {
        input.value = text;
        input.style.height = 'auto';
        input.focus();
    };

    // 8. Markdown Parser
    function parseMarkdown(text) {
        return text
            .replace(/```([\s\S]*?)```/g, '<code>$1</code>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');
    }

    // 9. Chat History
    window.aiChatHistory = [];

    // 10. Valid Gemini Models (ordered by preference) — updated 2025/2026
    const FALLBACK_MODELS = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ];

    // 11. Send Message
    async function sendMsg() {
        const msg = input.value.trim();
        if (!msg) return;

        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        // Show user message
        const userDiv = document.createElement('div');
        userDiv.className = 'ai-msg user';
        userDiv.textContent = msg;
        const typing = document.getElementById('aiTyping');
        chatBody.insertBefore(userDiv, typing);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Show typing indicator
        typing.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;

        window.aiChatHistory.push({ role: 'user', parts: [{ text: msg }] });

        const apiKey = localStorage.getItem('lm_ai_api_key') || '';

        if (!apiKey) {
            typing.style.display = 'none';
            appendBotMsg(
                '⚙️ សូមបញ្ចូល <strong>Gemini API Key</strong> ក្នុង Settings (រូបចក្រ) ជាមុន។<br>' +
                '<small>ទទួល Key ឥតគិតថ្លៃ: <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#8e44ad">aistudio.google.com</a></small>',
                true
            );
            window.aiChatHistory.pop();
            sendBtn.disabled = false;
            return;
        }

        // Build model list: user-selected first, then fallbacks
        const userModel = localStorage.getItem('lm_ai_model') || 'gemini-2.5-flash';
        const modelsToTry = [...new Set([userModel, ...FALLBACK_MODELS])];

        const assistName = localStorage.getItem('lm_ai_name') || 'LittleMaker AI';
        const assistTone = localStorage.getItem('lm_ai_tone') || 'professional';

        const systemPrompt =
            `អ្នកជា ${assistName} — ជំនួយការ AI ក្នុង Admin Panel របស់ LittleMaker Cambodia។\n` +
            `ក្រុមហ៊ុននេះផលិត: គ្រឿងសង្ហារឹមការិយាល័យ (តុ ទូ), គ្រឿងលោហៈ, ម៉ាស៊ីន CNC, ` +
            `និងមានសេវាជួលអគារ/រោងចក្រ ក្នុងប្រទេសកម្ពុជា។\n` +
            `- ជួយ Admin: សរសេរការពិពណ៌នា, បកប្រែ (KH/EN/CN), ឆ្លើយសារអតិថិជន, ផ្ដល់យោបល់ Marketing\n` +
            `- ឆ្លើយជាភាសាខ្មែរ · ស្ទីល: ${assistTone}\n` +
            `- ប្រើ Markdown (bold, list) ដើម្បីឱ្យអ្នកអានងាយ`;

        const payload = {
            contents: window.aiChatHistory,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: assistTone === 'creative' ? 0.9
                           : assistTone === 'concise'  ? 0.3 : 0.6,
                maxOutputTokens: 1024
            }
        };

        let aiText = '';
        let usedModel = '';
        let lastError = 'Unknown error';
        let success   = false;

        for (const model of modelsToTry) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                // Invalid API key → stop immediately (no point trying other models)
                if (res.status === 400 || res.status === 401 || res.status === 403) {
                    const errData = await res.json().catch(() => ({}));
                    const errMsg  = errData?.error?.message || `HTTP ${res.status}`;
                    if (res.status === 401 || res.status === 403 ||
                        errMsg.toLowerCase().includes('api key') ||
                        errMsg.toLowerCase().includes('permission')) {
                        lastError = `API Key មិនត្រឹមត្រូវ ឬគ្មានសិទ្ធិ (${res.status})`;
                        break;
                    }
                    // 400 other reason → try next model
                    lastError = errMsg;
                    continue;
                }

                if (!res.ok) {
                    if (res.status === 404) {
                        lastError = `ម៉ូដែល "${model}" រកមិនឃើញ (404) — កំពុងព្យាយាម model បន្ទាប់...`;
                    } else {
                        lastError = `HTTP Error ${res.status}`;
                    }
                    continue; // try next model
                }

                const data = await res.json();

                // Check for safety block
                const candidate = data.candidates?.[0];
                if (candidate?.finishReason === 'SAFETY') {
                    lastError = 'ខ្លឹមសារត្រូវបានរារាំងដោយ Safety Filter';
                    break;
                }

                aiText = candidate?.content?.parts?.[0]?.text || '';
                if (aiText) {
                    success   = true;
                    usedModel = model;
                    // Auto-update saved model if a fallback worked
                    if (model !== userModel) {
                        localStorage.setItem('lm_ai_model', model);
                        modelInput.value = model;
                        modelBadge.textContent = model.includes('2.5') ? 'Gemini 2.5'
                                              : model.includes('2.0') ? 'Gemini 2.0'
                                              : 'Gemini 1.5';
                    }
                    break;
                }

                lastError = 'ម៉ូដែលឆ្លើយតបទទេ (Empty response)';

            } catch (err) {
                lastError = err.message || 'Network error';
                // Network error — may still work with same model on retry, but try next for now
            }
        }

        typing.style.display = 'none';

        if (success) {
            window.aiChatHistory.push({ role: 'model', parts: [{ text: aiText }] });
            appendBotMsg(parseMarkdown(aiText), false);
            if (window.aiChatHistory.length > 20) {
                window.aiChatHistory.splice(0, 2); // keep history manageable
            }
        } else {
            window.aiChatHistory.pop(); // remove the user msg that failed
            appendBotMsg(
                `⚠️ <strong>បញ្ហា:</strong> ${lastError}<br><br>` +
                `<small>💡 សូមពិនិត្យ API Key ក្នុង Settings ឬ សាកល្បងម្ដងទៀត<br>` +
                `ប្រសិនបើ Error 404: សូម Reset API Key ហើយ Save Settings ម្ដងទៀត</small>`,
                true
            );
        }

        sendBtn.disabled = false;
    }

    function appendBotMsg(htmlContent, isError = false) {
        const div = document.createElement('div');
        div.className = isError ? 'ai-msg error' : 'ai-msg bot';
        div.innerHTML = htmlContent;
        const typing = document.getElementById('aiTyping');
        chatBody.insertBefore(div, typing);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAIAssistant);
} else {
    window.initAIAssistant();
}