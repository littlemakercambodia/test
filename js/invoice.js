/* ================================================================
   LITTLEMAKER CAMBODIA — invoice.js
   Invoice number generation, rendering, PDF/JPG export
   ================================================================ */

'use strict';

/* ── Helper: load external script ── */
function loadScript(src, cb) {
  if (document.querySelector('script[src="' + src + '"]')) return cb();
  const s = document.createElement('script');
  s.src = src; s.onload = cb; document.head.appendChild(s);
}

/* ── Next Invoice Number (Firebase or localStorage fallback) ── */
async function getNextInvoiceNumber() {
  if (window._currentCartInv) return window._currentCartInv;
  
  let maxId = 0;
  if (window.fsDB && window.fsCollection && window.fsGetDocs) {
    try {
      const snap = await window.fsGetDocs(window.fsCollection(window.fsDB, "orders"));
      snap.forEach(doc => {
        const data = doc.data();
        if (data.invNo && data.invNo.startsWith('LMK-')) {
          const num = parseInt(data.invNo.replace('LMK-', ''), 10);
          if (!isNaN(num) && num > maxId) {
            maxId = num;
          }
        }
      });
    } catch(err) {
      console.warn("Could not fetch orders from DB, falling back to local counter", err);
      maxId = parseInt(localStorage.getItem('lm_inv_counter') || '0');
    }
  } else {
    maxId = parseInt(localStorage.getItem('lm_inv_counter') || '0');
  }
  
  const nextOrderNum = maxId + 1;
  const invNo = 'LMK-' + String(nextOrderNum).padStart(5, '0');
  window._currentCartInv = invNo;
  localStorage.setItem('lm_inv_counter', nextOrderNum);
  
  return invNo;
}

/* ── Show Invoice Modal ── */
async function showInvoice() {
  if (!cart.length) { showToast('Your cart is empty'); return; }
  
  const btn = document.getElementById('viewInvBtn');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
      btn.disabled = true;
  }
  
  let sum = 0;
  const lang = localStorage.getItem('lm_lang') || 'en';
  const t = T[lang] || T.en;

  const rows = cart.map(i => {
    const p = parseFloat(i.price)||0;
    const s = p * i.qty; sum += s;
    return `<tr>
              <td style="padding:14px 10px; border-bottom:1px solid #edf2f7; color:#2d3748; font-weight:600;">${i.name}</td>
              <td style="text-align:center; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#4a5568;">${i.qty}</td>
              <td style="text-align:right; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#4a5568;">$${p.toFixed(2)}</td>
              <td style="text-align:right; padding:14px 10px; border-bottom:1px solid #edf2f7; color:#2d3748; font-weight:700;">$${s.toFixed(2)}</td>
            </tr>`;
  }).join('');

  const invNo = await getNextInvoiceNumber();

  if (btn) {
      btn.innerHTML = origText;
      btn.disabled = false;
  }

  const date = new Date();
  const dateStr = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  const rielTotal = (sum * 4100).toLocaleString();

  document.getElementById('invoicePaper').innerHTML = `
    <div style="font-family: 'Battambang', 'Barlow', sans-serif; background:#fff; color:#1a202c; padding: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="images/Logo.png" alt="LittleMaker Cambodia logo" style="width: 110px; height: auto; margin: 0 auto 14px; display:block; filter:drop-shadow(0 8px 18px rgba(204,0,0,.14));">
        <h2 style="margin:0; font-size: 1.6rem; color: #1e2a38; font-weight: 800; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.5px;">LITTLEMAKER (CAMBODIA) CO., LTD.</h2>
        <p style="margin: 6px 0 0; color: #718096; font-size: 0.95rem; font-family: 'Barlow', sans-serif;">📍 Svay Rieng, Cambodia &nbsp;|&nbsp; 📞 +855 71 971 6888</p>
      </div>

      <h3 style="text-align: center; color: #1a202c; font-size: 1.8rem; font-weight: 900; margin-bottom: 35px; padding-bottom: 20px; border-bottom: 2px dashed #cbd5e0;">🧾 ${t.inv_main_title}</h3>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 0.95rem; border-radius: 8px; background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
        <div>
          <div style="font-weight: 800; color: #4a5568; margin-bottom: 4px;">${t.inv_no}</div>
          <div style="color: #4f46e5; font-size: 1.05rem; font-weight: 700; font-family: 'Barlow', sans-serif;">${invNo}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: #4a5568; margin-bottom: 4px;">${t.inv_date}</div>
          <div style="color: #718096; font-size: 1.05rem; font-weight: 600; font-family: 'Barlow', sans-serif;">${dateStr}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">📦 ${t.inv_item}</th>
            <th style="text-align: center; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">📊 ${t.inv_qty}</th>
            <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">💲 ${t.inv_price}</th>
            <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-weight: 800; font-size: 0.95rem;">💵 ${t.inv_total}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <div style="width: 320px; max-width:100%;">
          <div style="display: flex; justify-content: space-between; padding: 8px 10px; color: #4a5568; font-size: 1rem;">
            <span>${t.inv_sub}</span>
            <span style="font-weight:600; font-family: 'Barlow', sans-serif;">$${sum.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 10px; color: #4a5568; font-size: 1rem;">
            <span>${t.inv_tax}</span>
            <span style="font-weight:600; font-family: 'Barlow', sans-serif;">$0.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 16px 10px 4px 10px; margin-top: 10px; border-top: 2px dashed #cbd5e0; font-weight: 800; color: #4f46e5; align-items: flex-start;">
            <span style="font-size: 1.3rem;">💵 ${t.inv_total}</span>
            <div style="text-align: right; line-height: 1.3; font-family: 'Barlow', sans-serif;">
              <div style="font-size: 1.35rem;">$${sum.toFixed(2)}</div>
              <div style="font-size: 1rem; color: #4a5568; font-weight: 700; margin-top: 4px;">${rielTotal} ៛</div>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 60px; color: #718096; font-size: 1rem; font-weight:600;">
        ❤️ ${t.inv_thanks}
      </div>
    </div>
  `;
  document.getElementById('invBackdrop').classList.add('open');
  document.getElementById('invoiceModal').classList.add('open');
}

/* ── Helper: clone paper into clean capture container ── */
function getCleanPaperClone() {
  const paper = document.getElementById('invoicePaper');
  
  /* clone the paper */
  const clone = paper.cloneNode(true);
  clone.style.cssText = 'width:800px;max-width:800px;padding:40px;background:#fff;font-family:\'Battambang\',\'Barlow\',sans-serif;color:#1a202c;overflow:visible;height:auto;';
  
  /* temporary off-screen container (still in DOM so html2canvas can read it) */
  const wrapper = document.createElement('div');
  wrapper.id = '_invCaptureWrapper';
  wrapper.style.cssText = 'position:fixed;left:0;top:0;z-index:-1;pointer-events:none;width:800px;opacity:1;';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  
  return wrapper;
}

function removeCaptureWrapper() {
  const w = document.getElementById('_invCaptureWrapper');
  if (w) w.remove();
}

/* ── PDF Export ── */
function exportInvoicePDF() {
  const pdfBtn = document.getElementById('dlPdfBtn');
  const orig = pdfBtn.innerHTML;
  pdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
  pdfBtn.disabled = true;
  
  document.fonts.ready.then(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', () => {
      const wrapper = getCleanPaperClone();
      const clone  = wrapper.firstChild;
      
      /* let browser compute layout */
      requestAnimationFrame(() => {
        setTimeout(() => {
          const opt = {
            margin:       [0.4, 0.4, 0.4, 0.4],
            filename:     'LittleMaker_Invoice.pdf',
            image:        { type:'jpeg', quality:0.98 },
            html2canvas:  {
              scale: 2,
              useCORS: true,
              logging: false,
              letterRendering: true,
              allowTaint: false,
              scrollX: 0,
              scrollY: 0,
              windowWidth:  800,
              windowHeight: wrapper.scrollHeight + 50,
              backgroundColor: '#ffffff'
            },
            jsPDF: { unit:'in', format:'a4', orientation:'portrait' },
            pagebreak: { mode:['avoid-all','css','legacy'] }
          };
          
          html2pdf().set(opt).from(clone).save()
            .then(() => {
              removeCaptureWrapper();
              pdfBtn.innerHTML = orig;
              pdfBtn.disabled = false;
              showToast('PDF exported successfully!');
            })
            .catch(err => {
              console.error('PDF export error:', err);
              removeCaptureWrapper();
              pdfBtn.innerHTML = orig;
              pdfBtn.disabled = false;
              showToast('PDF export failed. Try JPG.');
            });
        }, 300);
      });
    });
  });
}

/* ── JPG Export ── */
function exportInvoiceJPG() {
  const jpgBtn = document.getElementById('dlJpgBtn');
  const orig = jpgBtn.innerHTML;
  jpgBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Capturing...';
  jpgBtn.disabled = true;
  
  document.fonts.ready.then(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => {
      const wrapper = getCleanPaperClone();
      const clone  = wrapper.firstChild;
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 800,
            windowHeight: wrapper.scrollHeight + 50,
            backgroundColor: '#ffffff'
          }).then(canvas => {
            removeCaptureWrapper();
            jpgBtn.innerHTML = orig;
            jpgBtn.disabled = false;
            
            const link = document.createElement('a');
            link.download = 'LittleMaker_Invoice.jpg';
            link.href = canvas.toDataURL('image/jpeg', 1.0);
            link.click();
            showToast('JPG exported successfully!');
          }).catch(err => {
            console.error('JPG export error:', err);
            removeCaptureWrapper();
            jpgBtn.innerHTML = orig;
            jpgBtn.disabled = false;
            showToast('JPG export failed');
          });
        }, 300);
      });
    });
  });
}
