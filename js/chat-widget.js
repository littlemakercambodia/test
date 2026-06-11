/* ================================================================
   LITTLEMAKER CAMBODIA — chat-widget.js
   Floating Live Chat Widget — setup and events
   ================================================================ */

'use strict';

function setupChatWidget() {
  /* ── Floating Chat Toggle ── */
  document.getElementById('floatingChatBtn')?.addEventListener('click', () => {
    const box = document.getElementById('floatingChatBox');
    box.style.display = 'flex';
    document.getElementById('floatingChatBtn').style.transform = 'scale(0)';
  });
  document.getElementById('closeFloatingChat')?.addEventListener('click', () => {
    document.getElementById('floatingChatBox').style.display = 'none';
    document.getElementById('floatingChatBtn').style.transform = 'scale(1)';
  });

  /* ── Send Chat Message ── */
  document.getElementById('fcSendBtn')?.addEventListener('click', async (e) => {
    const name = document.getElementById('fcName').value.trim();
    const phone = document.getElementById('fcPhone').value.trim();
    const msg = document.getElementById('fcMsg').value.trim();

    if(!name || !phone || !msg) {
       showToast('សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់! (Please fill all fields)');
       return;
    }

    const btn = e.currentTarget;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';
    btn.disabled = true;

    // Save to Firebase Messages Collection
    if (window.fsDB && window.fsAddDoc && window.fsCollection) {
      try {
        await window.fsAddDoc(window.fsCollection(window.fsDB, "messages"), {
          name: name,
          email: phone,
          subject: 'Live Chat Message',
          message: msg,
          status: 'unread',
          createdAt: new Date().toISOString()
        });
      } catch(err) { console.error("Save chat error:", err); }
    }

    // Open Telegram
    const tgMsg = encodeURIComponent('💬 សារថ្មីពី Live Chat\n\n👤 ឈ្មោះ: ' + name + '\n📞 ទូរស័ព្ទ: ' + phone + '\n💬 សារ:\n' + msg);
    window.open('https://t.me/samnangkhiev?text=' + tgMsg, '_blank');

    showToast('✓ សារបានបញ្ជូន! (Message sent!)');
    document.getElementById('fcName').value = '';
    document.getElementById('fcPhone').value = '';
    document.getElementById('fcMsg').value = '';
    document.getElementById('closeFloatingChat').click();

    btn.innerHTML = orig;
    btn.disabled = false;
  });
}