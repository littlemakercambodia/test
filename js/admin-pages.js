/* ================================================================
   LITTLEMAKER CAMBODIA — admin-pages.js
   Module: Page Editor & Translations (Home, About, Services)
   ================================================================ */

'use strict';

/* ── Helpers ── */
function muHTML(hiddenId, prevId, phId, label, sublabel) {
  return `<div class="mu" onclick="openImgPicker('${hiddenId}','${prevId}','${phId}',false,event)"><div class="mu-ph" id="${phId}"><i class="fa-solid fa-image"></i></div><img class="mu-prev" id="${prevId}" src="" alt=""><div class="mu-txt"><strong>${label}</strong><span>${sublabel || 'Click to browse Image Library'}</span></div></div><input type="hidden" id="${hiddenId}">`;
}
const RTE_TOOLBAR = `<div class="rte-toolbar"><select onchange="document.execCommand('fontName',false,this.value);this.selectedIndex=0;"><option value="">Font</option><option value="Battambang">Battambang</option><option value="Barlow Condensed">Barlow Condensed</option></select><input type="color" onchange="document.execCommand('foreColor',false,this.value)" title="Color"><button type="button" onclick="document.execCommand('bold',false,null)"><b>B</b></button><button type="button" onclick="document.execCommand('italic',false,null)"><i>I</i></button><button type="button" onclick="document.execCommand('removeFormat',false,null)"><i class="fa-solid fa-eraser"></i></button></div>`;
const RTE_TOOLBAR_SIMPLE = `<div class="rte-toolbar"><input type="color" onchange="document.execCommand('foreColor',false,this.value)"><button type="button" onclick="document.execCommand('bold',false,null)"><b>B</b></button></div>`;
function rteEditor(id) { return `<div class="rte-editor" id="${id}" contenteditable="true"></div>`; }

const ANIM_SELECT = `<select id="LANG_ANIM_ID"><option value="fade">Fade In/Out</option><option value="slide-left">Slide Left → Right</option><option value="slide-right">Slide Right → Left</option><option value="zoom-in">Zoom In</option><option value="zoom-out">Zoom Out</option><option value="ken-burns">Ken Burns (Pan & Zoom)</option><option value="blur">Blur Focus</option></select>`;

/* ── HOME PAGE EDITOR ── */
function homePageHTML() {
  return `<div class="lang-tabs"><button class="lang-tab active" onclick="switchLang('home','en',this)"><span class="flag">🇺🇸</span> English</button><button class="lang-tab" onclick="switchLang('home','kh',this)"><span class="flag">🇰🇭</span> ខ្មែរ</button><button class="lang-tab" onclick="switchLang('home','cn',this)"><span class="flag">🇨🇳</span> 中文</button></div>
  <div class="lang-panel active" id="home-en">${heroSection('en')}${featuresSection('en')}</div>
  <div class="lang-panel" id="home-kh">${heroSection('kh')}${featuresSection('kh')}</div>
  <div class="lang-panel" id="home-cn">${heroSection('cn')}${featuresSection('cn')}</div>
  <div class="save-bar"><div class="sb-info">Changes are saved to <strong>localStorage</strong> & <strong>Firebase</strong></div><button class="btn bp" onclick="saveTranslations('home')"><i class="fa-solid fa-save"></i> Save Home Page</button></div>`;
}
function heroSection(lang) {
  const f = lang==='en'?'🇺🇸 English':lang==='kh'?'🇰🇭 ខ្មែរ':'🇨🇳 中文';
  const animId = lang+'_h_hero_anim';
  return `<div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-image"></i> Hero Section (${f})</div><span style="font-size:.73rem;color:var(--mu)">index.html</span></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Hero Title</label>${RTE_TOOLBAR}${rteEditor(lang+'_h_hero_title')}</div>
    <div class="pg pe-full"><label>Hero Description</label>${RTE_TOOLBAR_SIMPLE}${rteEditor(lang+'_h_hero_desc')}</div>
    <div class="pg"><label>ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID',animId)}</div>
    <div class="pg pe-full"><label>រូបភាពទី១ (Image 1)</label>${muHTML(lang+'_h_hero_bg',lang+'HeroBgImg',lang+'HeroBgPh','Image 1 - Background')}</div>
    <div class="pg pe-full"><label>រូបភាពទី២ (Image 2)</label>${muHTML(lang+'_h_hero_bg2',lang+'HeroBgImg2',lang+'HeroBgPh2','Image 2 - Background')}</div>
    <div class="pg pe-full"><label>រូបភាពទី៣ (Image 3)</label>${muHTML(lang+'_h_hero_bg3',lang+'HeroBgImg3',lang+'HeroBgPh3','Image 3 - Background')}</div>
  </div></div></div>`;
}
function featuresSection(lang) {
  const f = lang==='en'?'🇺🇸 English':lang==='kh'?'🇰🇭 ខ្មែរ':'🇨🇳 中文';
  return `<div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-th-large"></i> Features Section (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Section Label</label><input type="text" id="${lang}_h_feat_title"></div>
    <div class="pg"><label>Section Main Title</label><input type="text" id="${lang}_h_feat_sub"></div>
    <div class="pg"><label>Feature 1 Title</label><input type="text" id="${lang}_h_feat_off"></div>
    <div class="pg"><label>Feature 1 Desc</label><input type="text" id="${lang}_h_feat_off_desc"></div>
    <div class="pg"><label>Feature 1 - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID',lang+'_h_feat_off_anim')}</div>
    <div class="pg pe-full"><label>Feature 1 - រូបភាពទី១ (Image 1)</label>${muHTML(lang+'_h_feat_off_bg',lang+'FeatOffImg',lang+'FeatOffPh','Feature 1 - Image 1')}</div>
    <div class="pg pe-full"><label>Feature 1 - រូបភាពទី២ (Image 2)</label>${muHTML(lang+'_h_feat_off_bg2',lang+'FeatOffImg2',lang+'FeatOffPh2','Feature 1 - Image 2')}</div>
    <div class="pg pe-full"><label>Feature 1 - រូបភាពទី៣ (Image 3)</label>${muHTML(lang+'_h_feat_off_bg3',lang+'FeatOffImg3',lang+'FeatOffPh3','Feature 1 - Image 3')}</div>
    <div class="pg"><label>Feature 2 Title</label><input type="text" id="${lang}_h_feat_ind"></div>
    <div class="pg"><label>Feature 2 Desc</label><input type="text" id="${lang}_h_feat_ind_desc"></div>
    <div class="pg"><label>Feature 2 - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID',lang+'_h_feat_ind_anim')}</div>
    <div class="pg pe-full"><label>Feature 2 - រូបភាពទី១ (Image 1)</label>${muHTML(lang+'_h_feat_ind_bg',lang+'FeatIndImg',lang+'FeatIndPh','Feature 2 - Image 1')}</div>
    <div class="pg pe-full"><label>Feature 2 - រូបភាពទី២ (Image 2)</label>${muHTML(lang+'_h_feat_ind_bg2',lang+'FeatIndImg2',lang+'FeatIndPh2','Feature 2 - Image 2')}</div>
    <div class="pg pe-full"><label>Feature 2 - រូបភាពទី៣ (Image 3)</label>${muHTML(lang+'_h_feat_ind_bg3',lang+'FeatIndImg3',lang+'FeatIndPh3','Feature 2 - Image 3')}</div>
    <div class="pg"><label>Building Rental Title</label><input type="text" id="${lang}_serv_rental"></div>
    <div class="pg"><label>Building Rental Desc</label><input type="text" id="${lang}_serv_rental_desc"></div>
    <div class="pg"><label>Rental - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID',lang+'_h_serv_rental_anim')}</div>
    <div class="pg pe-full"><label>Building Rental - រូបភាពទី១ (Image 1)</label>${muHTML(lang+'_h_serv_rental_bg',lang+'ServRentalImg',lang+'ServRentalPh','Rental - Image 1')}</div>
    <div class="pg pe-full"><label>Building Rental - រូបភាពទី២ (Image 2)</label>${muHTML(lang+'_h_serv_rental_bg2',lang+'ServRentalImg2',lang+'ServRentalPh2','Rental - Image 2')}</div>
    <div class="pg pe-full"><label>Building Rental - រូបភាពទី៣ (Image 3)</label>${muHTML(lang+'_h_serv_rental_bg3',lang+'ServRentalImg3',lang+'ServRentalPh3','Rental - Image 3')}</div>
    <div class="pg"><label>CTA Title</label><input type="text" id="${lang}_h_cta_title"></div>
    <div class="pg"><label>CTA Description</label><input type="text" id="${lang}_h_cta_desc"></div>
    <div class="pg"><label>Button Shop</label><input type="text" id="${lang}_btn_shop"></div>
    <div class="pg"><label>Button Quote</label><input type="text" id="${lang}_btn_quote"></div>
  </div></div></div>`;
}

/* ── ABOUT US EDITOR ── */
function aboutPageHTML() {
  return `<div class="lang-tabs"><button class="lang-tab active" onclick="switchLang('about','en',this)"><span class="flag">🇺🇸</span> English</button><button class="lang-tab" onclick="switchLang('about','kh',this)"><span class="flag">🇰🇭</span> ខ្មែរ</button><button class="lang-tab" onclick="switchLang('about','cn',this)"><span class="flag">🇨🇳</span> 中文</button></div>
  <div class="lang-panel active" id="about-en">${aboutSection('en')}</div>
  <div class="lang-panel" id="about-kh">${aboutSection('kh')}</div>
  <div class="lang-panel" id="about-cn">${aboutSection('cn')}</div>
  <div class="save-bar"><div class="sb-info">Changes are saved to <strong>localStorage</strong> & <strong>Firebase</strong></div><button class="btn bp" onclick="saveTranslations('about')"><i class="fa-solid fa-save"></i> Save About Us</button></div>`;
}
function aboutSection(lang) {
  const f = lang==='en'?'🇺🇸 English':lang==='kh'?'🇰🇭 ខ្មែរ':'🇨🇳 中文';
  return `<div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-circle-info"></i> About Us Section (${f})</div><span style="font-size:.73rem;color:var(--mu)">about.html</span></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Page Header Title</label><input type="text" id="${lang}_about_header"></div>
    <div class="pg pe-full"><label>Page Subtitle</label><input type="text" id="${lang}_about_sub"></div>
    <div class="pg pe-full"><label>Section Title (Who We Are)</label><input type="text" id="${lang}_about_title"></div>
    <div class="pg pe-full"><label>Paragraph 1</label><textarea id="${lang}_about_p1" rows="3"></textarea></div>
    <div class="pg pe-full"><label>Paragraph 2</label><textarea id="${lang}_about_p2" rows="3"></textarea></div>
    <div class="pg pe-full"><label>About Page Image</label>${muHTML(lang+'_a_img',lang+'AboutImg',lang+'AboutPh','About Image')}</div>
  </div></div></div>
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-star"></i> Feature List (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Feature 1</label><input type="text" id="${lang}_feat_iso"></div>
    <div class="pg"><label>Feature 2</label><input type="text" id="${lang}_feat_high"></div>
    <div class="pg"><label>Feature 3</label><input type="text" id="${lang}_feat_fast"></div>
  </div></div></div>`;
}

/* ── CAREERS (SERVICES) POST MANAGER ── */
let adminCareerPosts = [];

function loadAdminCareerPosts() {
    try {
        const stored = localStorage.getItem('lm_career_posts');
        if (stored) {
            adminCareerPosts = JSON.parse(stored);
        } else {
            // Default 3 posts if empty
            adminCareerPosts = [
                {id: "job1", title: "CNC Machine Operator", desc: "We are looking for an experienced CNC operator to handle our high-precision milling machines.", location: "Phnom Penh", type: "Full Time", image: "images/cabinet.jpg", timestamp: Date.now() - 2 * 60 * 60 * 1000, likes: 1200, commentsCount: 120, shares: 45},
                {id: "job2", title: "Sales Executive", desc: "Join our dynamic sales team to promote our premium office furniture and industrial parts.", location: "Phnom Penh", type: "Full Time", image: "images/Husky1.png", timestamp: Date.now() - 5 * 60 * 60 * 1000, likes: 845, commentsCount: 89, shares: 21},
                {id: "job3", title: "Mechanical Engineer", desc: "Seeking a skilled mechanical engineer for CAD design and product development.", location: "Svay Rieng", type: "Full Time", image: "images/backgroud_1.png", timestamp: Date.now() - 24 * 60 * 60 * 1000, likes: 2100, commentsCount: 340, shares: 150}
            ];
            localStorage.setItem('lm_career_posts', JSON.stringify(adminCareerPosts));
        }
    } catch(e) {
        adminCareerPosts = [];
    }
}

function saveAdminCareerPosts() {
    localStorage.setItem('lm_career_posts', JSON.stringify(adminCareerPosts));
    renderCareerPostsTable();
    window.toast('Careers Posts Saved successfully!', 'success');
}

function servicesPageHTML() {
  loadAdminCareerPosts();
  return `
  <div class="tc" style="margin-bottom:20px;">
      <div class="tc-head">
          <div class="tc-title"><i class="fa-solid fa-briefcase" style="color:var(--or);margin-right:7px"></i> Careers Posts Manager</div>
          <button class="btn bp btn-sm" onclick="openCareerPostModal()"><i class="fa-solid fa-plus"></i> Add New Post</button>
      </div>
      <table style="width:100%; border-collapse:collapse;">
          <thead>
              <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Stats (L/C/S)</th>
                  <th style="width:140px">Actions</th>
              </tr>
          </thead>
          <tbody id="careerPostsTbody">
              <!-- Rendered via JS -->
          </tbody>
      </table>
  </div>
  
  <!-- Editor Modal -->
  <div class="mo" id="moCareerPost">
      <div class="md cm" style="max-width:600px">
          <div class="mh">
              <h3 id="cpModalTitle"><i class="fa-solid fa-edit"></i> Edit Post</h3>
              <button class="close-btn" onclick="closeMo('moCareerPost')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="mc" style="text-align:left; padding: 20px;">
              <input type="hidden" id="cpId">
              <div class="pg"><label>Job Title</label><input type="text" id="cpTitle"></div>
              <div class="pg" style="margin-top:12px;"><label>Description</label><textarea id="cpDesc" rows="4"></textarea></div>
              <div class="pe-grid" style="margin-top:12px;">
                  <div class="pg"><label>Location</label><input type="text" id="cpLocation"></div>
                  <div class="pg"><label>Job Type</label><input type="text" id="cpType"></div>
              </div>
              <div class="pg pe-full" style="margin-top:12px;">
                  <label>Post Image</label>
                  ${muHTML('cpImg','cpImgPrev','cpImgPh','Post Image')}
              </div>
          </div>
          <div class="mf">
              <button class="btn bo" onclick="closeMo('moCareerPost')">Cancel</button>
              <button class="btn bp" onclick="saveCareerPostForm()"><i class="fa-solid fa-save"></i> Save Post</button>
          </div>
      </div>
  </div>
  `;
}

window.renderCareerPostsTable = function() {
    const tbody = document.getElementById('careerPostsTbody');
    if(!tbody) return;
    
    if(adminCareerPosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--mu);padding:30px;">No posts found. Add one above!</td></tr>';
        return;
    }
    
    adminCareerPosts.sort((a,b)=>b.timestamp - a.timestamp);
    
    tbody.innerHTML = adminCareerPosts.map(p => `
        <tr>
            <td><img src="${p.image || 'images/Logo.png'}" class="p-thumb"></td>
            <td><strong>${p.title}</strong><br><small style="color:var(--mu)">${p.desc.substring(0,40)}...</small></td>
            <td>${p.location}</td>
            <td><span class="p-cat cat-tables">${p.type}</span></td>
            <td style="font-size:0.8rem; color:var(--mu)">
                <i class="fa-solid fa-thumbs-up"></i> ${p.likes} &nbsp; 
                <i class="fa-solid fa-comment"></i> ${p.commentsCount} &nbsp; 
                <i class="fa-solid fa-share"></i> ${p.shares}
            </td>
            <td>
                <button class="btn bo btn-sm" onclick="openCareerPostModal('${p.id}')"><i class="fa-solid fa-edit"></i> Edit</button>
                <button class="btn bd2 btn-sm" onclick="deleteCareerPost('${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
};

window.openCareerPostModal = function(id = null) {
    const titleEl = document.getElementById('cpModalTitle');
    const idEl = document.getElementById('cpId');
    const title = document.getElementById('cpTitle');
    const desc = document.getElementById('cpDesc');
    const loc = document.getElementById('cpLocation');
    const type = document.getElementById('cpType');
    const img = document.getElementById('cpImg');
    const imgPrev = document.getElementById('cpImgPrev');
    const imgPh = document.getElementById('cpImgPh');

    if(id) {
        const post = adminCareerPosts.find(p => p.id === id);
        if(!post) return;
        titleEl.innerHTML = '<i class="fa-solid fa-edit"></i> Edit Post';
        idEl.value = post.id;
        title.value = post.title;
        desc.value = post.desc;
        loc.value = post.location;
        type.value = post.type;
        img.value = post.image || '';
        
        if(post.image) {
            imgPrev.src = post.image;
            imgPrev.classList.add('show');
            imgPh.style.display = 'none';
        } else {
            imgPrev.classList.remove('show');
            imgPh.style.display = 'flex';
        }
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Post';
        idEl.value = '';
        title.value = '';
        desc.value = '';
        loc.value = 'Phnom Penh';
        type.value = 'Full Time';
        img.value = '';
        imgPrev.classList.remove('show');
        imgPh.style.display = 'flex';
    }
    openMo('moCareerPost');
};

window.saveCareerPostForm = function() {
    const id = document.getElementById('cpId').value;
    const title = document.getElementById('cpTitle').value.trim();
    const desc = document.getElementById('cpDesc').value.trim();
    const loc = document.getElementById('cpLocation').value.trim();
    const type = document.getElementById('cpType').value.trim();
    const img = document.getElementById('cpImg').value;

    if(!title) { window.toast('Job Title is required!', 'error'); return; }

    if(id) {
        // Edit existing
        const post = adminCareerPosts.find(p => p.id === id);
        if(post) {
            post.title = title;
            post.desc = desc;
            post.location = loc;
            post.type = type;
            post.image = img;
        }
    } else {
        // Add new
        adminCareerPosts.push({
            id: 'job_' + Date.now(),
            title: title,
            desc: desc,
            location: loc,
            type: type,
            image: img,
            timestamp: Date.now(),
            likes: Math.floor(Math.random() * 50) + 10,
            commentsCount: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 10)
        });
    }
    
    saveAdminCareerPosts();
    closeMo('moCareerPost');
};

window.deleteCareerPost = function(id) {
    if(!confirm('Are you sure you want to delete this career post?')) return;
    adminCareerPosts = adminCareerPosts.filter(p => p.id !== id);
    saveAdminCareerPosts();
};


/* ── INIT / SWITCH ── */
window.initPageEditors = function() {
  const h=document.getElementById('sa-home'); if(h) h.innerHTML=homePageHTML();
  const a=document.getElementById('sa-about'); if(a) a.innerHTML=aboutPageHTML();
  const s=document.getElementById('sa-services'); if(s) { s.innerHTML=servicesPageHTML(); window.renderCareerPostsTable(); }
};
window.switchLang = function(page,lang,btn) {
  const c=btn.closest('.lang-tabs').parentElement;
  c.querySelectorAll('.lang-tab').forEach(t=>t.classList.remove('active'));
  c.querySelectorAll('.lang-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const p=c.querySelector('#'+page+'-'+lang); if(p) p.classList.add('active');
};

/* ── FIELD MAP ── */
const FIELD_MAP = {
  'h_hero_title':{type:'rte'},'h_hero_desc':{type:'rte'},
  'h_hero_bg':{type:'image'},'h_hero_bg2':{type:'image'},'h_hero_bg3':{type:'image'},
  'h_hero_anim':{type:'text'},
  'h_feat_title':{type:'text'},'h_feat_sub':{type:'text'},
  'h_feat_off':{type:'text'},'h_feat_off_desc':{type:'text'},
  'h_feat_off_bg':{type:'image'},'h_feat_off_bg2':{type:'image'},'h_feat_off_bg3':{type:'image'},
  'h_feat_off_anim':{type:'text'},
  'h_feat_ind':{type:'text'},'h_feat_ind_desc':{type:'text'},
  'h_feat_ind_bg':{type:'image'},'h_feat_ind_bg2':{type:'image'},'h_feat_ind_bg3':{type:'image'},
  'h_feat_ind_anim':{type:'text'},
  'serv_rental':{type:'text'},'serv_rental_desc':{type:'text'},
  'h_serv_rental_bg':{type:'image'},'h_serv_rental_bg2':{type:'image'},'h_serv_rental_bg3':{type:'image'},
  'h_serv_rental_anim':{type:'text'},
  'h_cta_title':{type:'text'},'h_cta_desc':{type:'text'},'btn_shop':{type:'text'},'btn_quote':{type:'text'},
  'about_header':{type:'text'},'about_sub':{type:'text'},'about_title':{type:'text'},
  'about_p1':{type:'textarea'},'about_p2':{type:'textarea'},'a_img':{type:'image'},
  'feat_iso':{type:'text'},'feat_high':{type:'text'},'feat_fast':{type:'text'},
  'serv_header':{type:'text'},'serv_sub':{type:'text'},
  'serv_cnc':{type:'text'},'serv_cnc_desc':{type:'text'},'serv_laser':{type:'text'},'serv_laser_desc':{type:'text'},
  'serv_weld':{type:'text'},'serv_weld_desc':{type:'text'},'serv_finish':{type:'text'},'serv_finish_desc':{type:'text'},
  'serv_cad':{type:'text'},'serv_cad_desc':{type:'text'},'serv_ass':{type:'text'},'serv_ass_desc':{type:'text'}
};

/* ── LOAD TRANSLATIONS ── */
window.loadTranslations = function() {
  let all={}; try{all=JSON.parse(localStorage.getItem('lm_translations')||'{}');}catch(e){}
  ['en','kh','cn'].forEach(lang=>{
    const data=all[lang]||{};
    for(const key in FIELD_MAP){
      const cfg=FIELD_MAP[key]; const val=data[key]||''; const el=document.getElementById(lang+'_'+key);
      if(!el) continue;
      if(cfg.type==='rte'){el.innerHTML=val;}
      else if(cfg.type==='image'){
        el.value=val;
        if(val){
          const prevEl=findPrevImg(lang,key);
          const phEl=findPhPlaceholder(lang,key);
          if(prevEl){prevEl.src=val;prevEl.classList.add('show');}
          if(phEl){phEl.style.display='none';}
        }
      } else {el.value=val;}
    }
  });
};

function findPrevImg(lang,key){const m={'h_hero_bg':lang+'HeroBgImg','h_hero_bg2':lang+'HeroBgImg2','h_hero_bg3':lang+'HeroBgImg3','h_feat_off_bg':lang+'FeatOffImg','h_feat_off_bg2':lang+'FeatOffImg2','h_feat_off_bg3':lang+'FeatOffImg3','h_feat_ind_bg':lang+'FeatIndImg','h_feat_ind_bg2':lang+'FeatIndImg2','h_feat_ind_bg3':lang+'FeatIndImg3','h_serv_rental_bg':lang+'ServRentalImg','h_serv_rental_bg2':lang+'ServRentalImg2','h_serv_rental_bg3':lang+'ServRentalImg3','a_img':lang+'AboutImg'};return document.getElementById(m[key]||'');}
function findPhPlaceholder(lang,key){const m={'h_hero_bg':lang+'HeroBgPh','h_hero_bg2':lang+'HeroBgPh2','h_hero_bg3':lang+'HeroBgPh3','h_feat_off_bg':lang+'FeatOffPh','h_feat_off_bg2':lang+'FeatOffPh2','h_feat_off_bg3':lang+'FeatOffPh3','h_feat_ind_bg':lang+'FeatIndPh','h_feat_ind_bg2':lang+'FeatIndPh2','h_feat_ind_bg3':lang+'FeatIndPh3','h_serv_rental_bg':lang+'ServRentalPh','h_serv_rental_bg2':lang+'ServRentalPh2','h_serv_rental_bg3':lang+'ServRentalPh3','a_img':lang+'AboutPh'};return document.getElementById(m[key]||'');}

/* ── SAVE TRANSLATIONS ── */
window.saveTranslations=function(section){
  let all={}; try{all=JSON.parse(localStorage.getItem('lm_translations')||'{}');}catch(e){}
  ['en','kh','cn'].forEach(lang=>{
    if(!all[lang]) all[lang]={};
    for(const key in FIELD_MAP){
      const cfg=FIELD_MAP[key]; const el=document.getElementById(lang+'_'+key);
      if(!el) continue;
      if(cfg.type==='rte'){all[lang][key]=el.innerHTML;}
      else if(cfg.type==='image'){if(el.value) all[lang][key]=el.value;}
      else{if(el.value) all[lang][key]=el.value;}
    }
  });
  localStorage.setItem('lm_translations',JSON.stringify(all));
  if(window.firestoreDB&&window.fsSetDoc&&window.fsDoc){
    window.fsSetDoc(window.fsDoc(window.firestoreDB,'settings','translations'),all)
      .then(()=>{window.toast('✓ Saved to Firebase!','success');window.logActivity('save',`${section} saved`);})
      .catch(e=>{window.toast('✓ Saved locally','info');window.logActivity('save',`${section} saved locally`);});
  } else {
    window.toast('✓ Saved to localStorage','success');
    window.logActivity('save',`${section} saved locally`);
  }
};