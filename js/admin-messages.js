/* ================================================================
   LITTLEMAKER CAMBODIA — admin-messages.js
   Module: Customer Messages Management
   ================================================================ */

'use strict';

window.contactMessages = [];
window.unsubscribeMessages = null;

// បង្កើត Modal សម្រាប់បើកមើលសារលម្អិត
document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <div class="mo" id="moViewMsg">
      <div class="md" style="max-width:500px;">
        <div class="mh">
            <h3 style="font-family:'Battambang', sans-serif;"><i class="fa-solid fa-envelope-open-text" style="color:var(--blue);margin-right:7px;"></i> ព័ត៌មានលម្អិតនៃសារ</h3>
            <button class="close-btn" onclick="closeMo('moViewMsg')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mc" style="font-size:0.9rem; font-family:'Battambang', sans-serif;">
          <div style="margin-bottom:12px;"><strong>ឈ្មោះ (Name):</strong> <span id="vMsgName"></span></div>
          <div style="margin-bottom:12px;"><strong>អ៊ីមែល (Email):</strong> <a id="vMsgEmail" href="#" style="color:var(--blue);text-decoration:underline;"></a></div>
          <div style="margin-bottom:12px;"><strong>ប្រធានបទ (Subject):</strong> <span id="vMsgSubj"></span></div>
          <div style="margin-bottom:12px;"><strong>កាលបរិច្ឆេទ (Date):</strong> <span id="vMsgDate"></span></div>
          <hr style="border:none; border-top:1px dashed var(--bd); margin:15px 0;">
          <div style="margin-bottom:8px;"><strong>សារ (Message):</strong></div>
          <div id="vMsgContent" style="background:var(--bg); padding:15px; border-radius:8px; line-height:1.6; white-space:pre-wrap;"></div>
        </div>
        <div class="mf">
            <button class="btn bo" onclick="closeMo('moViewMsg')">បិទ (Close)</button>
            <a id="vMsgReply" href="#" target="_blank" class="btn bp"><i class="fa-solid fa-reply"></i> ឆ្លើយតប (Reply)</a>
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
});

// ទាញយកសារពី Firebase
window.loadMessages = function() {
  if (!window.firestoreDB) return;
  if (window.unsubscribeMessages) window.unsubscribeMessages(); 
  
  window.unsubscribeMessages = window.fsOnSnapshot(window.fsCollection(window.firestoreDB, "messages"), (snapshot) => {
    window.contactMessages = [];
    let unreadCount = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      window.contactMessages.push({ id: doc.id, ...data });
      if (data.status === 'unread') unreadCount++;
    });
    
    // រៀបពីថ្មីទៅចាស់
    window.contactMessages.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // លោតលេខពណ៌ក្រហម (Badge) ប្រសិនបើមានសារថ្មី
    const badge = document.getElementById('sbMsgCnt');
    if (badge) {
       badge.textContent = unreadCount;
       badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
    
    if (document.getElementById('sa-messages') && document.getElementById('sa-messages').classList.contains('active')) {
      window.renderMessages();
    }
  });
};

// បង្ហាញក្នុងតារាង
window.renderMessages = function() {
  const tb = document.getElementById('msgTbody');
  if (!tb) return;
  
  if (!window.contactMessages.length) { 
    tb.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:50px;color:var(--mu)"><i class="fa-solid fa-inbox" style="font-size:2rem;opacity:.2;display:block;margin-bottom:10px"></i>មិនទាន់មានសារទេ (No Messages)</td></tr>'; 
    return; 
  }
  
  tb.innerHTML = window.contactMessages.map(m => {
    const d = new Date(m.createdAt).toLocaleString('en-US');
    
    let statusBadge = '';
    if(m.status === 'unread') statusBadge = '<span class="b-sale" style="background:#fff0e0;color:var(--or)">Unread</span>';
    else if(m.status === 'read') statusBadge = '<span class="b-new" style="background:#e8f0fa;color:var(--blue)">Read</span>';
    else statusBadge = '<span class="b-new" style="background:#e8faf0;color:var(--gr)">Replied</span>';

    const isBold = m.status === 'unread' ? 'font-weight:700; color:var(--text);' : 'color:var(--mu);';

    return `<tr style="${m.status === 'unread' ? 'background:#fbfdff;' : ''}">
      <td style="font-size:.8rem;color:var(--mu)">${d}</td>
      <td style="${isBold}">
        <div style="font-size:.9rem">${m.name}</div>
        <div style="font-size:.75rem; color:var(--blue); font-weight:normal;">${m.email}</div>
      </td>
      <td style="${isBold}">${m.subject || '(គ្មានប្រធានបទ)'}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn bo btn-sm btn-icon" title="View Message" onclick="window.viewMessage('${m.id}')"><i class="fa-solid fa-eye"></i></button>
          <select onchange="window.updateMsgStatus('${m.id}', this.value)" style="padding:6px;border-radius:6px;border:1px solid var(--bd);outline:none">
            <option value="unread" ${m.status==='unread'?'selected':''}>Unread</option>
            <option value="read" ${m.status==='read'?'selected':''}>Read</option>
            <option value="replied" ${m.status==='replied'?'selected':''}>Replied</option>
          </select>
          <button class="btn bd2 btn-sm btn-icon" title="Delete Message" onclick="window.deleteMessage('${m.id}')" style="margin-left:4px;"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
};

window.viewMessage = function(id) {
  const m = window.contactMessages.find(x => x.id === id);
  if(!m) return;
  
  document.getElementById('vMsgName').textContent = m.name;
  const emailEl = document.getElementById('vMsgEmail');
  emailEl.textContent = m.email;
  emailEl.href = `mailto:${m.email}`;
  document.getElementById('vMsgSubj').textContent = m.subject || 'N/A';
  document.getElementById('vMsgDate').textContent = new Date(m.createdAt).toLocaleString('en-US');
  document.getElementById('vMsgContent').textContent = m.message;
  
  document.getElementById('vMsgReply').href = `mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`;
  
  // ពេលបើកមើល ប្តូរទៅ Read
  if (m.status === 'unread') {
      window.updateMsgStatus(id, 'read');
  }
  
  if (window.openMo) window.openMo('moViewMsg');
};

window.updateMsgStatus = async function(id, newStatus) {
  if (!window.firestoreDB) return;
  try {
    await window.fsUpdateDoc(window.fsDoc(window.firestoreDB, "messages", id), { status: newStatus });
    if(window.logActivity) window.logActivity('save', `Updated Message status to ${newStatus}`);
    if(window.toast) window.toast('ប្តូរស្ថានភាពជោគជ័យ!', 'success');
  } catch(e) {
    console.error(e);
    if(window.toast) window.toast('មានបញ្ហាក្នុងការប្តូរស្ថានភាព', 'error');
  }
};

window.deleteMessage = async function(id) {
  if (!confirm("តើអ្នកពិតជាចង់លុបសារនេះមែនទេ? (Are you sure you want to delete this message?)")) return;
  if (!window.firestoreDB) return;
  try {
    await window.fsDeleteDoc(window.fsDoc(window.firestoreDB, "messages", id));
    if(window.logActivity) window.logActivity('delete', `Deleted a customer message`);
    if(window.toast) window.toast('លុបសារជោគជ័យ!', 'success');
  } catch (error) {
    console.error("Delete Error: ", error);
    if(window.toast) window.toast("មានបញ្ហាក្នុងការលុប", "error");
  }
};