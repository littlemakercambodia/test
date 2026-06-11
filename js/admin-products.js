/* ================================================================
   LITTLEMAKER CAMBODIA — admin-products.js
   Module: Product Management
   ================================================================ */

'use strict';

// 1. បង្កើត HTML សម្រាប់ផ្នែកផលិតផលដោយស្វ័យប្រវត្តិ
window.initProductsManager = function() {
    const container = document.getElementById('sa-products');
    if (!container) return;

    container.innerHTML = `
        <div class="stats-row">
          <div class="stat-c"><div class="stat-ic si-bl"><i class="fa-solid fa-box"></i></div><div><div class="sv" id="stTotal">0</div><div class="sl">Total Products</div></div></div>
          <div class="stat-c"><div class="stat-ic si-or"><i class="fa-solid fa-chair"></i></div><div><div class="sv" id="stTbl">0</div><div class="sl">Tables</div></div></div>
          <div class="stat-c"><div class="stat-ic si-re"><i class="fa-solid fa-cabinet-filing"></i></div><div><div class="sv" id="stCab">0</div><div class="sl">Cabinets</div></div></div>
          <div class="stat-c"><div class="stat-ic si-gr"><i class="fa-solid fa-fire-burner"></i></div><div><div class="sv" id="stGrl">0</div><div class="sl">Grills</div></div></div>
        </div>
        <div class="tc">
          <div class="tc-head">
            <div class="tc-title">Product List</div>
            <div class="si-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="si" placeholder="Search products..." oninput="filterProds(this.value)"></div>
          </div>
          <table><thead><tr><th style="width:60px">Image</th><th>Name</th><th>Category</th><th>Price</th><th>Badge</th><th>Actions</th></tr></thead>
          <tbody id="prodTbody"></tbody></table>
        </div>

        <!-- PRODUCT MODAL -->
        <div class="mo" id="moProduct" data-backdrop="static">
          <div class="md">
            <div class="mh"><h3 id="moProdTitle">Add Product</h3><button class="close-btn" onclick="closeMo('moProduct')"><i class="fa-solid fa-xmark"></i></button></div>
            <div class="mc">
              <div class="form-grid">
                <div class="fg form-full"><label>Product Name *</label><input type="text" id="fTitle" placeholder="e.g. Modern Executive Desk" oninput="updatePrev()"></div>
                <div class="fg"><label>Category *</label><select id="fCat" onchange="updatePrev()"><option value="tables">Tables</option><option value="cabinets">Cabinets</option><option value="grills">Grills</option></select></div>
                <div class="fg"><label>Price (USD) *</label><input type="number" id="fPrice" placeholder="0" min="0" step="0.01" oninput="updatePrev()"></div>
                <div class="fg"><label>Badge</label><select id="fBadge"><option value="">None</option><option value="new">New</option><option value="sale">Hot/Sale</option></select></div>
                <div class="fg form-full"><label>Description</label><textarea id="fDesc" rows="3" placeholder="Product description..."></textarea></div>
                <div class="fg form-full"><label>Main Image — <span style="color:var(--blue);cursor:pointer;font-weight:600" onclick="openImgPicker('fImgSrc','prevImg','fImgPh',true,event)">Browse Library</span></label>
                  <div class="iu-area" ondragover="event.preventDefault();this.classList.add('dov')" ondragleave="this.classList.remove('dov')" ondrop="handleMainDrop(event)">
                    <input type="file" accept="image/*" onchange="handleMainImg(this)" id="fImgFile">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag & Drop <span>or Click Upload</span> <span style="color:var(--mu)">or use Browse Library above</span></p>
                    <img class="prev-img" id="prevImg" src="" alt="">
                  </div>
                  <input type="hidden" id="fImgSrc">
                </div>
                <div class="fg form-full"><label>Gallery Images</label>
                  <div class="gal-grid" id="galGrid"><div class="ga" title="Add"><i class="fa-solid fa-plus"></i><input type="file" accept="image/*" multiple onchange="handleGalAdd(this)"></div></div>
                </div>
                <div class="fg form-full"><label>Specifications</label>
                  <div id="specsEd"></div>
                  <button class="add-spec" onclick="addSpec()" style="margin-top:8px"><i class="fa-solid fa-plus"></i> Add Spec</button>
                </div>
              </div>
              <div class="prev-panel">
                <div class="pp-lbl"><i class="fa-solid fa-eye" style="margin-right:5px"></i>Live Preview</div>
                <div class="pp-card">
                  <img id="ppImg" src="images/cabinet.jpg" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;64&quot; height=&quot;64&quot;><rect width=&quot;64&quot; height=&quot;64&quot; fill=&quot;%23e8edf5&quot;/></svg>'">
                  <div><div style="font-size:.68rem;color:var(--mu);text-transform:uppercase;letter-spacing:1px" id="ppCat">tables</div><div style="font-weight:700;font-size:.9rem;margin-top:2px" id="ppName">Product Name</div><div style="color:var(--blue);font-weight:800;font-size:1rem;margin-top:3px" id="ppPrice">$0.00</div></div>
                </div>
              </div>
            </div>
            <div class="mf"><button class="btn bo" onclick="closeMo('moProduct')">Cancel</button><button class="btn bp" onclick="saveProd()"><i class="fa-solid fa-floppy-disk"></i> Save Product</button></div>
          </div>
        </div>

        <!-- DELETE CONFIRM MODAL -->
        <div class="mo" id="moDelProd">
          <div class="md cm" style="max-width:400px">
            <div class="mc"><span class="cm-icon">⚠️</span><h4>លុបផលិតផល?</h4><p id="delProdName"></p></div>
            <div class="mf"><button class="btn bo" onclick="closeMo('moDelProd')">Cancel</button><button class="btn bd2" onclick="confirmDelProd()"><i class="fa-solid fa-trash"></i> Delete</button></div>
          </div>
        </div>
    `;

    document.getElementById('moDelProd')?.addEventListener('click', function(e){
        if(e.target === this) this.classList.remove('open');
    });
};

window.products = [];
window.editingId = null;
window.delProdId = null;
window.mainImgData = null;
window.galImgs = [];
window.unsubscribeProducts = null;

// 2. មុខងារទាក់ទងនឹងផលិតផល
window.loadProds = function() {
  if (!window.firestoreDB) return;
  if (window.unsubscribeProducts) window.unsubscribeProducts(); 
  window.unsubscribeProducts = window.fsOnSnapshot(window.fsCollection(window.firestoreDB, "products"), (snapshot) => {
    window.products = [];
    snapshot.forEach((doc) => { window.products.push({ id: doc.id, ...doc.data() }); });
    window.products.sort((a,b) => (a.orderId||0) - (b.orderId||0));
    if (document.getElementById('sa-products').classList.contains('active')) window.renderProds();
    window.updateStats();
    localStorage.setItem('lm_products', JSON.stringify(window.products));
  });
};

window.updateStats = function() {
  document.getElementById('stTotal').textContent = window.products.length;
  document.getElementById('stTbl').textContent = window.products.filter(p=>p.category==='tables').length;
  document.getElementById('stCab').textContent = window.products.filter(p=>p.category==='cabinets').length;
  document.getElementById('stGrl').textContent = window.products.filter(p=>p.category==='grills').length;
  document.getElementById('sbProdCnt').textContent = window.products.length;
};

window.renderProds = function(list) {
  const data = list || window.products;
  const tb = document.getElementById('prodTbody');
  const btnImport = document.getElementById('btnImport');
  if (btnImport) btnImport.style.display = window.products.length === 0 ? 'inline-flex' : 'none';

  if (!data.length) { tb.innerHTML = '<tr class="erow"><td colspan="6" style="text-align:center;padding:50px;color:var(--mu)"><i class="fa-solid fa-box-open" style="font-size:2rem;opacity:.2;display:block;margin-bottom:10px"></i>No products</td></tr>'; return; }
  tb.innerHTML = data.map(p => {
    const imgEl = p.image ? `<img class="p-thumb" src="${p.image}" onerror="this.src='images/cabinet.jpg'">` : `<div class="p-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--mu)"><i class="fa-solid fa-image"></i></div>`;
    const badge = p.badge==='new'?`<span class="b-new">New</span>`:p.badge==='sale'?`<span class="b-sale">Hot</span>`:`<span style="color:var(--mu)">—</span>`;
    return `<tr>
      <td>${imgEl}</td>
      <td><div class="p-name">${p.title}</div><div style="font-size:.73rem;color:var(--mu);margin-top:2px">${(p.desc||'').substring(0,55)}...</div></td>
      <td><span class="p-cat cat-${p.category}">${p.category}</span></td>
      <td style="font-weight:700;color:var(--blue)">$${Number(p.price).toFixed(2)}</td>
      <td>${badge}</td>
      <td><div class="act-cell">
        <button class="btn bo btn-sm btn-icon" onclick="openEditProd('${p.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn bd2 btn-sm btn-icon" onclick="openDelProd('${p.id}')"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
};

window.filterProds = function(q) { 
  window.renderProds(window.products.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())||p.category.includes(q.toLowerCase()))); 
};

window.openAddProd = function() { 
  window.editingId=null; window.mainImgData=null; window.galImgs=[];
  document.getElementById('moProdTitle').textContent='Add New Product';
  window.resetProdForm(); window.openMo('moProduct'); 
};

window.openEditProd = function(id) {
  const p = window.products.find(x=>x.id===id); if(!p) return;
  window.editingId=id; window.mainImgData=p.image||null; window.galImgs=[...(p.gallery||[])];
  document.getElementById('moProdTitle').textContent='Edit Product';
  document.getElementById('fTitle').value=p.title;
  document.getElementById('fCat').value=p.category;
  document.getElementById('fPrice').value=p.price;
  document.getElementById('fBadge').value=p.badge||'';
  document.getElementById('fDesc').value=p.desc||'';
  document.getElementById('fImgSrc').value=p.image||'';
  const pv = document.getElementById('prevImg');
  if (p.image){pv.src=p.image;pv.classList.add('show')}else pv.classList.remove('show');
  window.renderGal(); window.renderSpecs(p.specs||{}); window.updatePrev(); window.openMo('moProduct');
};

window.resetProdForm = function() {
  ['fTitle','fDesc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fCat').value='tables';document.getElementById('fPrice').value='0';document.getElementById('fBadge').value='';document.getElementById('fImgSrc').value='';
  document.getElementById('prevImg').classList.remove('show');document.getElementById('fImgFile').value='';
  window.galImgs=[]; window.renderGal(); window.renderSpecs({}); window.updatePrev();
};

window.saveProd = async function() {
  const title=document.getElementById('fTitle').value.trim();
  const cat=document.getElementById('fCat').value;
  const price=parseFloat(document.getElementById('fPrice').value||'0');
  const badge=document.getElementById('fBadge').value;
  const desc=document.getElementById('fDesc').value.trim();
  let imgSrc=document.getElementById('fImgSrc').value;
  
  if(!title){if(window.toast)window.toast('Enter product name','error');return;}
  if(isNaN(price)||price<0){if(window.toast)window.toast('Enter valid price','error');return;}

  const btn = document.querySelector('#moProduct .bp');
  const ogBtnText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងរក្សាទុក...';
  btn.disabled = true;

  try {
    const specs=window.collectSpecs();
    const finalImg = imgSrc || window.mainImgData || (window.galImgs[0]||'images/cabinet.jpg');
    const finalGal = window.galImgs.length ? window.galImgs : [finalImg];
    
    const productData = { 
      title, category: cat, price, badge, desc, specs, 
      image: finalImg, gallery: finalGal, 
      orderId: window.editingId ? (window.products.find(x=>x.id===window.editingId)?.orderId || Date.now()) : Date.now() 
    };

    if(window.editingId !== null){
      await window.fsUpdateDoc(window.fsDoc(window.firestoreDB, "products", window.editingId), productData);
      if(window.logActivity) window.logActivity('save','Updated product: '+title);
      if(window.toast) window.toast('Product updated!','success');
    } else {
      await window.fsAddDoc(window.fsCollection(window.firestoreDB, "products"), productData);
      if(window.logActivity) window.logActivity('add','Added product: '+title);
      if(window.toast) window.toast('Product added!','success');
    }
    window.closeMo('moProduct');
  } catch (error) { if(window.toast) window.toast("មានបញ្ហាក្នុងការរក្សាទុក", "error");
  } finally { btn.innerHTML = ogBtnText; btn.disabled = false; }
};

window.openDelProd = function(id) { 
  const p=window.products.find(x=>x.id===id);if(!p)return;
  window.delProdId=id;
  document.getElementById('delProdName').textContent=`"${p.title}" will be permanently deleted.`;
  window.openMo('moDelProd'); 
};

window.confirmDelProd = async function() {
  const p=window.products.find(x=>x.id===window.delProdId);
  try {
    await window.fsDeleteDoc(window.fsDoc(window.firestoreDB, "products", window.delProdId));
    if(window.logActivity) window.logActivity('delete','Deleted product: '+(p?.title||window.delProdId));
    if(window.toast) window.toast('Product deleted','success'); 
    window.closeMo('moDelProd');
  } catch (error) { if(window.toast) window.toast("មានបញ្ហាក្នុងការលុប", "error"); }
};

window.handleMainImg = function(input) {
  const file=input.files[0];if(!file)return;
  window.compressImage(file, (compressedBase64) => {
    window.mainImgData = compressedBase64;
    document.getElementById('fImgSrc').value = ''; 
    const pv = document.getElementById('prevImg');
    pv.src = compressedBase64; pv.classList.add('show');
    window.updatePrev();
  });
};
window.handleMainDrop = function(e) { e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))window.handleMainImg({files:[f]}); };
window.handleGalAdd = function(input) {
  const files=Array.from(input.files); let done=0;
  files.forEach(file => {
    window.compressImage(file, (compressedBase64) => {
      window.galImgs.push(compressedBase64); done++;
      if(done===files.length) window.renderGal();
    });
  }); input.value='';
};

window.renderGal = function() {
  const g=document.getElementById('galGrid');
  const items=window.galImgs.map((src,i)=>`<div class="gi"><img src="${src}" alt=""><button class="gi-del" onclick="delGal(${i})"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
  g.innerHTML=items+`<div class="ga"><i class="fa-solid fa-plus"></i><input type="file" accept="image/*" multiple onchange="handleGalAdd(this)"></div>`;
};
window.delGal = function(i){window.galImgs.splice(i,1);window.renderGal();};
window.renderSpecs = function(s){const ed=document.getElementById('specsEd');ed.innerHTML='';Object.entries(s).forEach(([k,v])=>window.addSpec(k,v));};
window.addSpec = function(k='',v=''){const ed=document.getElementById('specsEd');const r=document.createElement('div');r.className='spec-row';r.innerHTML=`<input type="text" placeholder="Key" value="${k}"><input type="text" placeholder="Value" value="${v}"><button class="sd" onclick="this.parentNode.remove()"><i class="fa-solid fa-xmark"></i></button>`;ed.appendChild(r);};
window.collectSpecs = function(){const s={};document.querySelectorAll('#specsEd .spec-row').forEach(r=>{const ins=r.querySelectorAll('input');const k=ins[0].value.trim();const v=ins[1].value.trim();if(k)s[k]=v;});return s;};
window.updatePrev = function(){
  const t=document.getElementById('fTitle').value||'Product Name';
  const p=parseFloat(document.getElementById('fPrice').value)||0;
  const c=document.getElementById('fCat').value;
  let src = 'images/cabinet.jpg';
  if (document.getElementById('fImgSrc').value) src = document.getElementById('fImgSrc').value;
  else if (window.mainImgData) src = window.mainImgData;
  else if (window.galImgs[0]) src = window.galImgs[0];
  document.getElementById('ppName').textContent=t;
  document.getElementById('ppPrice').textContent='$'+p.toFixed(2);
  document.getElementById('ppCat').textContent=c;
  document.getElementById('ppImg').src=src;
};

window.initProductsManager();