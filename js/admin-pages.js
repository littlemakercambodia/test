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
  <div class="lang-panel active" id="home-en">${homeSections('en')}</div>
  <div class="lang-panel" id="home-kh">${homeSections('kh')}</div>
  <div class="lang-panel" id="home-cn">${homeSections('cn')}</div>
  <div class="save-bar"><div class="sb-info">Changes are saved to <strong>Firebase</strong></div><button class="btn bp" onclick="saveTranslations('home')"><i class="fa-solid fa-save"></i> Save Home Page</button></div>`;
}

function homeSections(lang) {
  const f = lang==='en'?'🇺🇸 English':lang==='kh'?'🇰🇭 ខ្មែរ':'🇨🇳 中文';
  return `
  <!-- 1. Hero Section -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-image"></i> 1. Hero Section (${f})</div><span style="font-size:.73rem;color:var(--mu)">index.html</span></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Hero Title</label>${RTE_TOOLBAR}${rteEditor(lang+'_hero_title')}</div>
    <div class="pg pe-full"><label>Hero Description</label>${RTE_TOOLBAR_SIMPLE}${rteEditor(lang+'_hero_desc')}</div>
    <div class="pg"><label>Button Text</label><input type="text" id="${lang}_about_preview_btn"></div>
    <div class="pg"><label>ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID', lang+'_h_hero_anim')}</div>
    <div class="pg pe-full"><label>Hero Background Image</label>${muHTML(lang+'_h_hero_bg',lang+'HeroBg',lang+'HeroBgPh','Hero Image')}</div>
    <div class="pg"><label>Stat: Projects</label><input type="text" id="${lang}_stat_projects"></div>
    <div class="pg"><label>Stat: Years</label><input type="text" id="${lang}_stat_years"></div>
  </div></div></div>

  <!-- 2. Matrix Cards (Office, Careers, Rental) -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-th-large"></i> 2. Matrix Cards (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Card 1 (Office) Title</label><input type="text" id="${lang}_feat_off"></div>
    <div class="pg"><label>Card 1 Desc</label><input type="text" id="${lang}_feat_off_desc"></div>
    <div class="pg"><label>Card 1 - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID', lang+'_h_feat_off_anim')}</div>
    <div class="pg pe-full"><label>Card 1 Background</label>${muHTML(lang+'_h_feat_off_bg',lang+'FeatOffBg',lang+'FeatOffBgPh','Office Image')}</div>
    
    <div class="pg"><label>Card 2 (Careers) Title</label><input type="text" id="${lang}_nav_careers"></div>
    <div class="pg"><label>Card 2 Desc</label><input type="text" id="${lang}_car_sub"></div>
    <div class="pg"><label>Card 2 - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID', lang+'_h_feat_ind_anim')}</div>
    <div class="pg pe-full"><label>Card 2 Background</label>${muHTML(lang+'_h_feat_ind_bg',lang+'FeatIndBg',lang+'FeatIndBgPh','Careers Image')}</div>

    <div class="pg"><label>Card 3 (Rental) Title</label><input type="text" id="${lang}_serv_rental"></div>
    <div class="pg"><label>Card 3 Desc</label><input type="text" id="${lang}_serv_rental_desc"></div>
    <div class="pg"><label>Card 3 - ចលនា (Animation)</label>${ANIM_SELECT.replace('LANG_ANIM_ID', lang+'_h_serv_rental_anim')}</div>
    <div class="pg pe-full"><label>Card 3 Background</label>${muHTML(lang+'_h_serv_rental_bg',lang+'FeatRentBg',lang+'FeatRentBgPh','Rental Image')}</div>
  </div></div></div>

  <!-- 3. Corporate Culture (Split Section) -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-users"></i> 3. Corporate Culture (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Sub Heading</label><input type="text" id="${lang}_about_who"></div>
    <div class="pg"><label>Main Title</label><input type="text" id="${lang}_why_sub"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_about_preview_desc" rows="3"></textarea></div>
    <div class="pg pe-full"><label>Side Image</label>${muHTML(lang+'_h_about_img',lang+'AboutImg',lang+'AboutImgPh','Corporate Culture Image')}</div>

    <div class="pg"><label>Feature 1 Title (Quality)</label><input type="text" id="${lang}_why_quality"></div>
    <div class="pg"><label>Feature 1 Desc</label><textarea id="${lang}_why_quality_desc" rows="2"></textarea></div>
    <div class="pg"><label>Feature 2 Title (Custom)</label><input type="text" id="${lang}_why_custom"></div>
    <div class="pg"><label>Feature 2 Desc</label><textarea id="${lang}_why_custom_desc" rows="2"></textarea></div>
    <div class="pg"><label>Feature 3 Title (Fast)</label><input type="text" id="${lang}_why_fast"></div>
    <div class="pg"><label>Feature 3 Desc</label><textarea id="${lang}_why_fast_desc" rows="2"></textarea></div>
  </div></div></div>

  <!-- 4. Product Matrix & Video -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-boxes-stacked"></i> 4. Product Matrix (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Main Title</label><input type="text" id="${lang}_matrix_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_matrix_desc" rows="2"></textarea></div>
    <div class="pg pe-full"><label>Background Image (Fallback)</label>${muHTML(lang+'_h_matrix_bg',lang+'MatrixBg',lang+'MatrixBgPh','Matrix BG Image')}</div>
    <div class="pg pe-full"><label>Video URL (Leave blank to use image)</label><input type="text" id="${lang}_h_matrix_video" placeholder="images/Video1.mp4"></div>
    
    <div class="pg"><label>Category 1 (Metal)</label><input type="text" id="${lang}_cat_metal"></div>
    <div class="pg"><label>Category 2 (Office)</label><input type="text" id="${lang}_cat_office"></div>
    <div class="pg"><label>Category 3 (Steel)</label><input type="text" id="${lang}_cat_steel"></div>
    <div class="pg"><label>Category 4 (Custom)</label><input type="text" id="${lang}_cat_custom"></div>
  </div></div></div>

  <!-- 5. Featured Products & Careers -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-star"></i> 5. Featured & Careers (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Products Sub Heading</label><input type="text" id="${lang}_featured_products_sub"></div>
    <div class="pg"><label>Products Main Title</label><input type="text" id="${lang}_featured_products"></div>
    <div class="pg"><label>View Catalog Button</label><input type="text" id="${lang}_btn_view_cat"></div>
    <div class="pg"><label>Careers Main Title</label><input type="text" id="${lang}_car_header"></div>
  </div></div></div>

  <!-- 6. Global Presence (Map) -->
  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-globe"></i> 6. Global Map (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg"><label>Sub Heading</label><input type="text" id="${lang}_map_sub"></div>
    <div class="pg"><label>Main Title</label><input type="text" id="${lang}_map_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_map_desc" rows="2"></textarea></div>
    <div class="pg pe-full"><label>Timeline 1 (Taiwan)</label><input type="text" id="${lang}_map_t1"></div>
    <div class="pg pe-full"><label>Timeline 2 (Vietnam)</label><input type="text" id="${lang}_map_v1"></div>
    <div class="pg pe-full"><label>Timeline 3 (Cambodia)</label><input type="text" id="${lang}_map_c1"></div>
    <div class="pg"><label>Button Text</label><input type="text" id="${lang}_map_btn"></div>
  </div></div></div>
  `;
}

/* ── ABOUT US EDITOR ── */
function aboutPageHTML() {
  return `<div class="lang-tabs"><button class="lang-tab active" onclick="switchLang('about','en',this)"><span class="flag">🇺🇸</span> English</button><button class="lang-tab" onclick="switchLang('about','kh',this)"><span class="flag">🇰🇭</span> ខ្មែរ</button><button class="lang-tab" onclick="switchLang('about','cn',this)"><span class="flag">🇨🇳</span> 中文</button></div>
  <div class="lang-panel active" id="about-en">${aboutSection('en')}</div>
  <div class="lang-panel" id="about-kh">${aboutSection('kh')}</div>
  <div class="lang-panel" id="about-cn">${aboutSection('cn')}</div>
  <div class="save-bar"><div class="sb-info">Changes are saved to <strong>Firebase</strong></div><button class="btn bp" onclick="saveTranslations('about')"><i class="fa-solid fa-save"></i> Save About Us</button></div>`;
}
function aboutSection(lang) {
  const f = lang==='en'?'🇺🇸 English':lang==='kh'?'🇰🇭 ខ្មែរ':'🇨🇳 中文';
  return `<div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-circle-info"></i> Our Story - Header & Welcome (${f})</div><span style="font-size:.73rem;color:var(--mu)">about.html</span></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Welcome Banner Text</label><input type="text" id="${lang}_story_welcome"></div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-history"></i> Heritage & Expansion (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Title</label><input type="text" id="${lang}_story_heritage_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_story_heritage_desc" rows="3"></textarea></div>
    <div class="pg pe-full"><label>Image</label>${muHTML(lang+'_story_heritage_img',lang+'StoryHerImg',lang+'StoryHerPh','Heritage Image')}</div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-cogs"></i> Engineering Excellence (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Title</label><input type="text" id="${lang}_story_eng_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_story_eng_desc" rows="3"></textarea></div>
    <div class="pg pe-full"><label>Image</label>${muHTML(lang+'_story_eng_img',lang+'StoryEngImg',lang+'StoryEngPh','Engineering Image')}</div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-check-circle"></i> Committed to Quality Standards (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Title</label><input type="text" id="${lang}_story_commit_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_story_commit_desc" rows="3"></textarea></div>
    <div class="pg pe-full"><label>Image</label>${muHTML(lang+'_story_commit_img',lang+'StoryComImg',lang+'StoryComPh','Quality Image')}</div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-eye"></i> Looking Forward (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Title</label><input type="text" id="${lang}_story_future_title"></div>
    <div class="pg pe-full"><label>Description</label><textarea id="${lang}_story_future_desc" rows="3"></textarea></div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-box-open"></i> Core Products (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Main Title</label><input type="text" id="${lang}_story_products_title"></div>
    <div class="pg pe-full"><label>Main Description</label><textarea id="${lang}_story_products_main_desc" rows="2"></textarea></div>
    
    <div class="pg"><label>Product 1 Title (Office)</label><input type="text" id="${lang}_story_prod_office_title"></div>
    <div class="pg"><label>Product 1 Desc</label><textarea id="${lang}_story_prod_office_desc" rows="2"></textarea></div>

    <div class="pg"><label>Product 2 Title (Tools)</label><input type="text" id="${lang}_story_prod_tools_title"></div>
    <div class="pg"><label>Product 2 Desc</label><textarea id="${lang}_story_prod_tools_desc" rows="2"></textarea></div>

    <div class="pg"><label>Product 3 Title (BBQ)</label><input type="text" id="${lang}_story_prod_bbq_title"></div>
    <div class="pg"><label>Product 3 Desc</label><textarea id="${lang}_story_prod_bbq_desc" rows="2"></textarea></div>
  </div></div></div>

  <div class="pec"><div class="peh"><div class="pet"><i class="fa-solid fa-globe"></i> Consumer Market (${f})</div></div><div class="peb"><div class="pe-grid">
    <div class="pg pe-full"><label>Market Title</label><input type="text" id="${lang}_story_market_title"></div>
    <div class="pg"><label>US</label><input type="text" id="${lang}_story_market_us"></div>
    <div class="pg"><label>Canada</label><input type="text" id="${lang}_story_market_ca"></div>
    <div class="pg"><label>Australia</label><input type="text" id="${lang}_story_market_au"></div>
    <div class="pg"><label>Vietnam</label><input type="text" id="${lang}_story_market_vn"></div>
  </div></div></div>`;
}

/* ── CAREERS (SERVICES) POST MANAGER ── */
let adminCareerPosts = [];

function loadAdminCareerPosts() {
    if (window.firestoreDB && window.fsCollection && window.fsGetDocs) {
        window.fsGetDocs(window.fsCollection(window.firestoreDB, "careers"))
        .then(snap => {
            if (!snap.empty) {
                adminCareerPosts = [];
                snap.forEach(doc => adminCareerPosts.push({ id: doc.id, ...doc.data() }));
                renderCareerPostsTable();
            } else {
                adminCareerPosts = [];
                renderCareerPostsTable();
            }
        })
        .catch(e => {
            console.error("Firebase fetch error", e);
            fallbackLoadAdminCareerPosts();
        });
    } else {
        fallbackLoadAdminCareerPosts();
    }
}

function fallbackLoadAdminCareerPosts() {
    try {
        const stored = localStorage.getItem('lm_career_posts');
        if (stored) {
            adminCareerPosts = JSON.parse(stored);
        } else {
            adminCareerPosts = [];
        }
    } catch(e) {
        adminCareerPosts = [];
    }
    renderCareerPostsTable();
}

function saveAdminCareerPosts() {
    // Only used for fallback now
    localStorage.setItem('lm_career_posts', JSON.stringify(adminCareerPosts));
    renderCareerPostsTable();
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
              <div style="display:flex; gap:12px; margin-top:12px;">
                  <div class="pg" style="flex:1;"><label>Salary</label><input type="text" id="cpSalary" placeholder="e.g. $300 - $500"></div>
                  <div class="pg" style="flex:0.5;"><label>Vacancies</label><input type="number" id="cpVacancies" min="1" value="1"></div>
                  <div class="pg" style="flex:0.5;"><label>Status</label><select id="cpStatus" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;"><option value="Open">Open</option><option value="Closed">Closed</option></select></div>
              </div>
              <div style="display:flex; gap:12px; margin-top:12px;">
                  <div class="pg" style="flex:1;"><label>Base Likes</label><input type="number" id="cpLikes" min="0"></div>
                  <div class="pg" style="flex:1;"><label>Base Comments</label><input type="number" id="cpComments" min="0"></div>
                  <div class="pg" style="flex:1;"><label>Base Shares</label><input type="number" id="cpShares" min="0"></div>
              </div>
              <div class="pg" style="margin-top:12px;">
                  <label>Facebook Link (Optional)</label>
                  <input type="url" id="cpFbLink" placeholder="https://www.facebook.com/...">
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
            <td>
                <strong>${p.title}</strong>
                ${p.status === 'Closed' ? '<span style="color:red; font-size:10px; border:1px solid red; padding:2px 4px; border-radius:4px; margin-left:4px;">Closed</span>' : ''}
                <br><small style="color:var(--mu)">${p.desc.substring(0,40)}...</small>
            </td>
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
    const likes = document.getElementById('cpLikes');
    const comments = document.getElementById('cpComments');
    const shares = document.getElementById('cpShares');
    const salary = document.getElementById('cpSalary');
    const vacancies = document.getElementById('cpVacancies');
    const status = document.getElementById('cpStatus');
    const fbLink = document.getElementById('cpFbLink');

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
        likes.value = post.likes || 0;
        comments.value = post.commentsCount || 0;
        shares.value = post.shares || 0;
        salary.value = post.salary || '';
        vacancies.value = post.vacancies || 1;
        status.value = post.status || 'Open';
        fbLink.value = post.fbLink || '';
        
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
        likes.value = Math.floor(Math.random() * 50) + 10;
        comments.value = Math.floor(Math.random() * 20);
        shares.value = Math.floor(Math.random() * 10);
        salary.value = 'Negotiable';
        vacancies.value = 1;
        status.value = 'Open';
        fbLink.value = '';
        imgPrev.classList.remove('show');
        imgPh.style.display = 'flex';
    }
    openMo('moCareerPost');
};

window.saveCareerPostForm = async function() {
    const id = document.getElementById('cpId').value;
    const title = document.getElementById('cpTitle').value.trim();
    const desc = document.getElementById('cpDesc').value.trim();
    const loc = document.getElementById('cpLocation').value.trim();
    const type = document.getElementById('cpType').value.trim();
    const img = document.getElementById('cpImg').value;
    const likes = parseInt(document.getElementById('cpLikes').value) || 0;
    const comments = parseInt(document.getElementById('cpComments').value) || 0;
    const shares = parseInt(document.getElementById('cpShares').value) || 0;
    const salary = document.getElementById('cpSalary').value.trim();
    const vacancies = parseInt(document.getElementById('cpVacancies').value) || 1;
    const status = document.getElementById('cpStatus').value;
    const fbLink = document.getElementById('cpFbLink').value.trim();

    if(!title) { window.toast('Job Title is required!', 'error'); return; }

    let post = null;
    if(id) {
        post = adminCareerPosts.find(p => p.id === id);
        if(post) {
            post.title = title; post.desc = desc; post.location = loc; post.type = type; post.image = img;
            post.likes = likes; post.commentsCount = comments; post.shares = shares; post.salary = salary;
            post.vacancies = vacancies; post.status = status; post.fbLink = fbLink;
        }
    } else {
        post = {
            id: 'job_' + Date.now(), title: title, desc: desc, location: loc, type: type, image: img,
            timestamp: Date.now(), likes: likes, commentsCount: comments, shares: shares, salary: salary,
            vacancies: vacancies, status: status, fbLink: fbLink
        };
        adminCareerPosts.push(post);
    }
    
    try {
        if(window.firestoreDB && window.fsSetDoc && window.fsDoc) {
            await window.fsSetDoc(window.fsDoc(window.firestoreDB, "careers", post.id), post);
            window.toast('Post saved to Firebase successfully!', 'success');
        } else {
            saveAdminCareerPosts();
            window.toast('Saved locally (Firebase not ready)', 'info');
        }
    } catch(e) {
        console.error("Save error", e);
        window.toast('Error saving post', 'error');
    }
    
    renderCareerPostsTable();
    closeMo('moCareerPost');
};

window.deleteCareerPost = async function(id) {
    if(!confirm('Are you sure you want to delete this career post?')) return;
    
    try {
        if(window.firestoreDB && window.fsDeleteDoc && window.fsDoc) {
            await window.fsDeleteDoc(window.fsDoc(window.firestoreDB, "careers", id));
            window.toast('Deleted successfully!', 'success');
        }
        adminCareerPosts = adminCareerPosts.filter(p => p.id !== id);
        renderCareerPostsTable();
    } catch(e) {
        console.error("Delete error", e);
        window.toast('Error deleting post', 'error');
    }
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
  // Home Page
  'hero_title':{type:'rte'}, 'hero_desc':{type:'rte'}, 'about_preview_btn':{type:'text'}, 'stat_projects':{type:'text'}, 'stat_years':{type:'text'}, 'h_hero_bg':{type:'image'}, 'h_hero_anim':{type:'text'},
  'feat_off':{type:'text'}, 'feat_off_desc':{type:'text'}, 'h_feat_off_bg':{type:'image'}, 'h_feat_off_anim':{type:'text'},
  'nav_careers':{type:'text'}, 'car_sub':{type:'text'}, 'h_feat_ind_bg':{type:'image'}, 'h_feat_ind_anim':{type:'text'},
  'serv_rental':{type:'text'}, 'serv_rental_desc':{type:'text'}, 'h_serv_rental_bg':{type:'image'}, 'h_serv_rental_anim':{type:'text'},
  'about_who':{type:'text'}, 'why_sub':{type:'text'}, 'about_preview_desc':{type:'textarea'}, 'h_about_img':{type:'image'},
  'why_quality':{type:'text'}, 'why_quality_desc':{type:'textarea'}, 'why_custom':{type:'text'}, 'why_custom_desc':{type:'textarea'}, 'why_fast':{type:'text'}, 'why_fast_desc':{type:'textarea'},
  'matrix_title':{type:'text'}, 'matrix_desc':{type:'textarea'}, 'h_matrix_bg':{type:'image'}, 'h_matrix_video':{type:'text'},
  'cat_metal':{type:'text'}, 'cat_office':{type:'text'}, 'cat_steel':{type:'text'}, 'cat_custom':{type:'text'},
  'featured_products_sub':{type:'text'}, 'featured_products':{type:'text'}, 'btn_view_cat':{type:'text'}, 'car_header':{type:'text'},
  'map_sub':{type:'text'}, 'map_title':{type:'text'}, 'map_desc':{type:'textarea'}, 'map_t1':{type:'text'}, 'map_v1':{type:'text'}, 'map_c1':{type:'text'}, 'map_btn':{type:'text'},
  
  // About Us Page
  'story_welcome':{type:'text'},
  'story_heritage_title':{type:'text'},'story_heritage_desc':{type:'textarea'},'story_heritage_img':{type:'image'},
  'story_eng_title':{type:'text'},'story_eng_desc':{type:'textarea'},'story_eng_img':{type:'image'},
  'story_commit_title':{type:'text'},'story_commit_desc':{type:'textarea'},'story_commit_img':{type:'image'},
  'story_future_title':{type:'text'},'story_future_desc':{type:'textarea'},
  'story_products_title':{type:'text'},'story_products_main_desc':{type:'textarea'},
  'story_prod_office_title':{type:'text'},'story_prod_office_desc':{type:'textarea'},
  'story_prod_tools_title':{type:'text'},'story_prod_tools_desc':{type:'textarea'},
  'story_prod_bbq_title':{type:'text'},'story_prod_bbq_desc':{type:'textarea'},
  'story_market_title':{type:'text'},'story_market_us':{type:'text'},'story_market_ca':{type:'text'},'story_market_au':{type:'text'},'story_market_vn':{type:'text'}
};

/* ── DEFAULT IMAGES ── */
const DEFAULT_IMAGES = {
  h_hero_bg: "images/backgroud_1.png",
  h_feat_off_bg: "images/cabinet.jpg",
  h_feat_ind_bg: "images/Husky1.png",
  h_serv_rental_bg: "images/backgroud_1.png",
  h_about_img: "images/R2.png",
  h_matrix_bg: "images/matrix_bg.png",
  story_heritage_img: "images/backgroud_1.png",
  story_eng_img: "images/cabinet.jpg",
  story_commit_img: "images/R2.png"
};

/* ── LOAD TRANSLATIONS ── */
window.loadTranslations = async function() {
  if (window.firestoreDB && window.fsGetDoc && window.fsDoc) {
    try {
      const docSnap = await window.fsGetDoc(window.fsDoc(window.firestoreDB, 'settings', 'translations'));
      if (docSnap.exists()) {
        localStorage.setItem('lm_translations', JSON.stringify(docSnap.data()));
      }
    } catch(e) {
      console.error("Firebase fetch error", e);
    }
  }

  let all={}; try{all=JSON.parse(localStorage.getItem('lm_translations')||'{}');}catch(e){}
  ['en','kh','cn'].forEach(lang=>{
    const data=all[lang]||{};
    const defText = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
    
    for(const key in FIELD_MAP){
      const cfg=FIELD_MAP[key]; 
      let val=data[key];
      
      // Fallback to translations.js text or default images if empty
      if (val === undefined || val === '') {
        if (cfg.type === 'image') {
          val = DEFAULT_IMAGES[key] || '';
        } else {
          val = defText[key] || '';
        }
      }
      
      const el=document.getElementById(lang+'_'+key);
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

function findPrevImg(lang,key){
  const m = {
    'h_hero_bg': lang+'HeroBg',
    'h_feat_off_bg': lang+'FeatOffBg',
    'h_feat_ind_bg': lang+'FeatIndBg',
    'h_serv_rental_bg': lang+'FeatRentBg',
    'h_about_img': lang+'AboutImg',
    'h_matrix_bg': lang+'MatrixBg',
    'story_heritage_img': lang+'StoryHerImg',
    'story_eng_img': lang+'StoryEngImg',
    'story_commit_img': lang+'StoryComImg'
  };
  return document.getElementById(m[key]||'');
}
function findPhPlaceholder(lang,key){
  const m = {
    'h_hero_bg': lang+'HeroBgPh',
    'h_feat_off_bg': lang+'FeatOffBgPh',
    'h_feat_ind_bg': lang+'FeatIndBgPh',
    'h_serv_rental_bg': lang+'FeatRentBgPh',
    'h_about_img': lang+'AboutImgPh',
    'h_matrix_bg': lang+'MatrixBgPh',
    'story_heritage_img': lang+'StoryHerPh',
    'story_eng_img': lang+'StoryEngPh',
    'story_commit_img': lang+'StoryComPh'
  };
  return document.getElementById(m[key]||'');
}

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