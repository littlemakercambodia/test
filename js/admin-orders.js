/* ================================================================
   LITTLEMAKER CAMBODIA — admin-orders.js
   Module: Order Management & Invoicing
   ================================================================ */

'use strict';

// 1. បង្កើត HTML សម្រាប់ផ្នែកបញ្ជាទិញ និងវិក្កយបត្រដោយស្វ័យប្រវត្តិ
window.initOrdersManager = function() {
    const container = document.getElementById('sa-orders');
    if (!container) return;

    container.innerHTML = `
        <div class="tc">
          <div class="tc-head">
            <div class="tc-title">Customer Orders</div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:140px">Date</th>
                <th>Customer Info</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th style="width:160px">Action</th>
              </tr>
            </thead>
            <tbody id="ordTbody">
              <tr><td colspan="6" style="text-align:center;padding:50px;color:var(--mu)"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- INVOICE MODAL -->
        <div class="invoice-backdrop" id="invBackdrop"></div>
        <div class="invoice-modal" id="invoiceModal">
          <div class="invoice-header-bar">
            <h3 style="margin:0; font-size:1.2rem; color:var(--blue); font-family:'Barlow Condensed', sans-serif;"><i class="fa-solid fa-file-invoice"></i> INVOICE / វិក្កយបត្រ</h3>
            <div class="invoice-actions" id="invActions" style="display: flex; gap: 8px;">
              <button class="btn bo" id="dlJpgBtn" style="background:#fff;font-weight:700;"><i class="fa-solid fa-image"></i> JPG</button>
              <button class="btn bo" id="dlPdfBtn" style="background:#fff;font-weight:700;"><i class="fa-solid fa-file-pdf"></i> PDF</button>
              <button class="btn bp" onclick="window.print()" style="font-weight:700;"><i class="fa-solid fa-print"></i> Print</button>
              <button class="btn" id="closeInv" style="color:var(--re);border:1.5px solid #fca5a5;background:#fef2f2;font-weight:700;"><i class="fa-solid fa-xmark"></i> Close</button>
            </div>
          </div>
          <div class="invoice-scroll-area">
            <div class="invoice-paper" id="invoicePaper"></div>
          </div>
        </div>
    `;

    // ភ្ជាប់ Event សម្រាប់ការទាញយក Invoice
    document.addEventListener('click', e => {
      if (e.target.closest('#closeInv') || e.target.id === 'invBackdrop') {
        document.getElementById('invoiceModal')?.classList.remove('open');
        document.getElementById('invBackdrop')?.classList.remove('open');
      }

      const pdfBtn = e.target.closest('#dlPdfBtn');
      if (pdfBtn) {
        const orig = pdfBtn.innerHTML; pdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PDF...';
        document.fonts.ready.then(() => {
          window.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', () => {
            const paper = document.getElementById('invoicePaper'); const scrollArea = document.querySelector('.invoice-scroll-area');
            const origOverflow = scrollArea.style.overflowY; scrollArea.style.overflowY = 'visible'; 
            const opt = { margin: 0.3, filename: 'Order_Invoice.pdf', image: { type: 'jpeg', quality: 1.0 }, html2canvas: { scale: 3, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
            html2pdf().set(opt).from(paper).save().then(() => { scrollArea.style.overflowY = origOverflow; pdfBtn.innerHTML = orig; });
          });
        });
      }

      const jpgBtn = e.target.closest('#dlJpgBtn');
      if (jpgBtn) {
        const orig = jpgBtn.innerHTML; jpgBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> JPG...';
        document.fonts.ready.then(() => {
          window.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => {
            const paper = document.getElementById('invoicePaper'); const scrollArea = document.querySelector('.invoice-scroll-area');
            const origOverflow = scrollArea.style.overflowY; scrollArea.style.overflowY = 'visible'; 
            window.html2canvas(paper, { scale: 3, useCORS: true }).then(canvas => {
              scrollArea.style.overflowY = origOverflow; jpgBtn.innerHTML = orig;
              const link = document.createElement('a'); link.download = 'Order_Invoice.jpg'; link.href = canvas.toDataURL('image/jpeg', 1.0); link.click();
            });
          });
        });
      }
    });
};

window.orders = [];
window.unsubscribeOrders = null;

// 2. ទាញយក និងបង្ហាញទិន្នន័យ
window.loadOrders = function() {
  if (!window.firestoreDB) return;
  if (window.unsubscribeOrders) window.unsubscribeOrders(); 
  window.unsubscribeOrders = window.fsOnSnapshot(window.fsCollection(window.firestoreDB, "orders"), (snapshot) => {
    window.orders = [];
    let pendingCount = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      window.orders.push({ id: doc.id, ...data });
      if (data.status === 'pending') pendingCount++;
    });
    
    window.orders.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    window.orders.forEach((o, index) => { o.seqInvNo = 'LMK-' + String(index + 1).padStart(5, '0'); });
    window.orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const badge = document.getElementById('sbOrdCnt');
    if (badge) {
       badge.textContent = pendingCount;
       badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
    if (document.getElementById('sa-orders').classList.contains('active')) window.renderOrders();
  });
};

window.renderOrders = function() {
  const tb = document.getElementById('ordTbody');
  if (!window.orders.length) { 
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:50px;color:var(--mu)"><i class="fa-solid fa-box-open" style="font-size:2rem;opacity:.2;display:block;margin-bottom:10px"></i>មិនទាន់មានការកម្មង់ទេ (No Orders)</td></tr>'; return; 
  }
  tb.innerHTML = window.orders.map(o => {
    // កំណត់ម៉ោងទៅជាម៉ោងកម្ពុជាជានិច្ច (Timezone: Asia/Phnom_Penh)
    const d = new Date(o.createdAt).toLocaleString('en-US', { 
        timeZone: 'Asia/Phnom_Penh',
        year: 'numeric', month: 'short', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', hour12: true 
    });
    const itemsStr = (o.items||[]).map(i => `<b>${i.qty}x</b> ${i.name}`).join('<br>');
    let statusBadge = '';
    if(o.status === 'pending') statusBadge = '<span class="b-sale" style="background:#fff0e0;color:var(--or)">Pending</span>';
    else if(o.status === 'completed') statusBadge = '<span class="b-new" style="background:#e8faf0;color:var(--gr)">Completed</span>';
    else statusBadge = '<span class="b-new" style="background:#ffe6e6;color:var(--re)">Cancelled</span>';
    return `<tr>
      <td style="font-size:.8rem;color:var(--mu)">${d}</td>
      <td style="font-weight:700">${o.customerInfo}</td>
      <td style="font-size:.82rem;line-height:1.5">${itemsStr}</td>
      <td style="font-weight:700;color:var(--blue)">$${(o.totalAmount||0).toFixed(2)}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn bo btn-sm btn-icon" title="View Invoice" onclick="viewAdminInvoice('${o.id}')"><i class="fa-solid fa-file-invoice"></i></button>
          <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:6px;border-radius:6px;border:1px solid var(--bd);outline:none">
            <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
            <option value="completed" ${o.status==='completed'?'selected':''}>Completed</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
          </select>
        </div>
      </td>
    </tr>`;
  }).join('');
};

window.updateOrderStatus = async function(id, newStatus) {
  if (!window.firestoreDB) return;
  try {
    await window.fsUpdateDoc(window.fsDoc(window.firestoreDB, "orders", id), { status: newStatus });
    if(window.logActivity) window.logActivity('save', `Updated Order ${id} to ${newStatus}`);
    if(window.toast) window.toast('ប្តូរស្ថានភាពជោគជ័យ!', 'success');
  } catch(e) { if(window.toast) window.toast('មានបញ្ហាក្នុងការប្តូរស្ថានភាព', 'error'); }
};

window.viewAdminInvoice = function(id) {
  const o = window.orders.find(x => x.id === id); if(!o) return;
  let sum = o.totalAmount || 0;
  const rows = (o.items || []).map(i => {
    const p = parseFloat(i.price)||0; const s = p * i.qty;
    return `<tr>
              <td style="padding:14px 10px; border-bottom:1px solid #edf2f7; color:#2d3748; font-weight:600;">${i.name}</td>
              <td style="text-align:center; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#4a5568;">${i.qty}</td>
              <td style="text-align:right; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#4a5568;">$${p.toFixed(2)}</td>
              <td style="text-align:right; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#2d3748; font-weight:700;">$${s.toFixed(2)}</td>
        </tr>`;
  }).join('');

  const invNo = o.seqInvNo || 'LMK-00000'; 
  // កំណត់ម៉ោងលើវិក្កយបត្រទៅជាម៉ោងនៅកម្ពុជាជានិច្ច
  const dateStr = new Date(o.createdAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Phnom_Penh' }); 
  const rielTotal = (sum * 4100).toLocaleString();

  document.getElementById('invoicePaper').innerHTML = `
    <div style="font-family: 'Battambang', 'Barlow', sans-serif; background:#fff; color:#1a202c; padding: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin:0; font-size: 1.6rem; color: #1e2a38; font-weight: 800; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.5px;">🏢 LITTLEMAKER (CAMBODIA) CO., LTD.</h2>
        <p style="margin: 6px 0 0; color: #718096; font-size: 0.95rem; font-family: 'Barlow', sans-serif;">📍 Svay Rieng, Cambodia &nbsp;|&nbsp; 📞 +855 71 971 6888</p>
      </div>
      <h3 style="text-align: center; color: #1a202c; font-size: 1.8rem; font-weight: 900; margin-bottom: 35px; padding-bottom: 20px; border-bottom: 2px dashed #cbd5e0;">🧾 វិក្កយបត្រ (INVOICE)</h3>
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 0.95rem; border-radius: 8px; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
        <div>
          <div style="font-weight: 700; color: #4a5568; margin-bottom: 4px;">អតិថិជន (Customer):</div>
          <div style="font-weight: 800; color: #1e2a38;">👤 ${o.customerName || 'N/A'}</div>
          <div style="color: #4a5568; margin-top:4px;">📞 ${o.customerPhone || 'N/A'}</div>
          <div style="color: #4a5568; margin-top:4px;">📍 ${o.customerLocation || 'N/A'}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: #4a5568; margin-bottom: 4px;">លេខវិក្កយបត្រ (Invoice No.):</div>
          <div style="color: #4f46e5; font-size: 1.05rem; font-weight: 700; font-family: 'Barlow', sans-serif;">${invNo}</div>
          <div style="font-weight: 800; color: #4a5568; margin-bottom: 4px;">កាលបរិច្ឆេទ (Date):</div>
          <div style="color: #718096; font-size: 1.05rem; font-weight: 600; font-family: 'Barlow', sans-serif;">${dateStr}</div>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">📦 មុខទំនិញ (Item)</th>
            <th style="text-align: center; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">📊 បរិមាណ (Qty)</th>
            <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">💲 តម្លៃរាយ (Price)</th>
            <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">💵 សរុប (Total)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <div style="width: 320px; max-width:100%;">
          <div style="display: flex; justify-content: space-between; padding: 8px 10px; color: #4a5568; font-size: 1rem;">
            <span>សរុបរង (Subtotal):</span><span style="font-weight:600; font-family: 'Barlow', sans-serif;">$${sum.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 10px; color: #4a5568; font-size: 1rem;">
            <span>ពន្ធ (Tax 0%):</span><span style="font-weight:600; font-family: 'Barlow', sans-serif;">$0.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 16px 10px 4px 10px; margin-top: 10px; border-top: 2px dashed #cbd5e0; font-weight: 800; color: #4f46e5; align-items: flex-start;">
            <span style="font-size: 1.3rem;">💵 សរុប (Total):</span>
            <div style="text-align: right; line-height: 1.3; font-family: 'Barlow', sans-serif;">
              <div style="font-size: 1.35rem;">$${sum.toFixed(2)}</div>
              <div style="font-size: 1rem; color: #4a5568; font-weight: 700; margin-top: 4px;">${rielTotal} ៛</div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 60px; color: #718096; font-size: 1rem; font-weight:600;">❤️ សូមអរគុណសម្រាប់ការគាំទ្រ! (Thank you!)</div>
    </div>`;
  document.getElementById('invBackdrop').classList.add('open');
  document.getElementById('invoiceModal').classList.add('open');
};

window.initOrdersManager();