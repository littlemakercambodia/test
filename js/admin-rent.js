/* ================================================================
   LITTLEMAKER CAMBODIA — admin-rent.js
   Module: Building & Factory Rental Management + AI Auto-Translator
   ================================================================ */

'use strict';

window.rentalList = [];
window.rentMainImgData = null;
window.rentGalImgs = [];

// ទិន្នន័យគំរូសម្រាប់អចលនទ្រព្យ
const DEFAULT_RENTALS = [
    {
        id: "default_1", 
        title: "Standard Industrial Factory", title_kh: "អគាររោងចក្រស្តង់ដារ", title_cn: "标准工业厂房",
        location: "Svay Rieng Zone A", location_kh: "តំបន់ស្វាយរៀង", location_cn: "柴桢省 A 区",
        price: "$3,500", price_sqm: "$1.40",
        description: "A spacious factory building ideal for heavy manufacturing.", 
        desc_kh: "អគាររោងចក្រធំទូលាយស័ក្តិសមសម្រាប់ផលិតកម្មធុនធ្ងន់ មានដំបូលខ្ពស់ និងសន្តិសុខល្អ។", 
        desc_cn: "宽敞的厂房，非常适合重型制造。",
        image: "images/backgroud_1.png",
        gallery: ["images/backgroud_1.png"],
        specs: { "Total Area": "2,500 sqm", "Power": "1000 kVA" },
        badge_en: "For Rent", badge_kh: "សម្រាប់ជួល", badge_cn: "出租",
        badge_color: "#ff4d4d", badge_icon: "fa-solid fa-key", map_link: ""
    },
    {
        id: "default_2", 
        title: "Premium Warehouse Space", title_kh: "ឃ្លាំងស្តុកទំនិញកម្រិតខ្ពស់", title_cn: "高级仓库空间",
        location: "Phnom Penh Outskirts", location_kh: "ជាយក្រុងភ្នំពេញ", location_cn: "金边市郊",
        price: "$2,200", price_sqm: "$1.83",
        description: "Modern warehousing facility with loading docks.", 
        desc_kh: "ឃ្លាំងស្តុកទំនិញទំនើបមានកន្លែងទម្លាក់ទំនិញ និងមានខ្យល់ចេញចូលល្អ។", 
        desc_cn: "现代化的仓储设施，设有装卸码头。",
        image: "images/cabinet.jpg",
        gallery: ["images/cabinet.jpg", "images/R2.png"],
        specs: { "Total Area": "1,200 sqm", "Power": "500 kVA" },
        badge_en: "For Rent", badge_kh: "សម្រាប់ជួល", badge_cn: "出租",
        badge_color: "#ff4d4d", badge_icon: "fa-solid fa-key", map_link: ""
    }
];

const PAGE_DEFAULTS = {
    en: { rental_header: "Building & Factory Rental", rental_sub: "Premium commercial spaces for your business", btn_rental: "Building Rental", prop_intro_title: "Available Properties for Rent", prop_intro_desc: "Explore our premium spaces designed to support your business growth. We offer strategic locations with flexible terms." },
    kh: { rental_header: "សេវាកម្មជួលអគារ និងរោងចក្រ", rental_sub: "ទីតាំងពាណិជ្ជកម្មកម្រិតខ្ពស់សម្រាប់អាជីវកម្មរបស់អ្នក", btn_rental: "សេវាកម្មជួលអគារ", prop_intro_title: "អចលនទ្រព្យសម្រាប់ជួល", prop_intro_desc: "ស្វែងយល់ពីទីតាំងស្តង់ដារខ្ពស់របស់យើង ដែលរៀបចំឡើងដើម្បីគាំទ្រដល់កំណើនអាជីវកម្មរបស់អ្នក។" },
    cn: { rental_header: "厂房与建筑租赁", rental_sub: "为您的企业提供优质的商业空间", btn_rental: "建筑租赁", prop_intro_title: "可租物业", prop_intro_desc: "探索我们为支持您的业务增长而设计的优质空间。" }
};

window.renderRentalManager = async function() {
    const container = document.getElementById('sa-rentals');
    if (!container) return;

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="font-family:'Battambang', sans-serif; margin:0;"><i class="fa-solid fa-building"></i> គ្រប់គ្រងអគារជួល</h2>
            <div style="display:flex; gap:10px;">
                <button class="btn bs" onclick="saveRentalSettings()"><i class="fa-solid fa-floppy-disk"></i> Save Page Info</button>
                <button class="btn bp" onclick="openRentalModal()"><i class="fa-solid fa-plus"></i> បន្ថែមអគារថ្មី</button>
            </div>
        </div>

        <!-- PAGE SETTINGS -->
        <div class="tc" style="margin-bottom:25px; border-radius:12px; background:#fff; border:1px solid var(--bd);">
            <div class="tc-head"><div class="tc-title"><i class="fa-solid fa-heading" style="color:var(--blue);margin-right:7px"></i> ព័ត៌មានទំព័រ (Rental Page Content)</div></div>
            <div style="padding:20px;">
                <div class="lang-tabs" style="margin-bottom:15px; border-bottom:2px solid var(--bd); padding-bottom:0;">
                    <button class="lang-tab active" onclick="switchRentalLang('en',this)"><span class="flag">🇺🇸</span> English</button>
                    <button class="lang-tab" onclick="switchRentalLang('kh',this)"><span class="flag">🇰🇭</span> ខ្មែរ</button>
                    <button class="lang-tab" onclick="switchRentalLang('cn',this)"><span class="flag">🇨🇳</span> 中文</button>
                </div>

                <div class="rental-lang-panel active" id="rent-set-en" style="display:block;">
                    <div class="form-grid">
                        <div class="fg"><label>Header Title</label><input type="text" id="en_rental_header"></div>
                        <div class="fg"><label>Header Subtitle</label><input type="text" id="en_rental_sub"></div>
                        <div class="fg"><label>Intro Small Tag</label><input type="text" id="en_btn_rental"></div>
                        <div class="fg"><label>Intro Title</label><input type="text" id="en_prop_intro_title"></div>
                        <div class="fg form-full"><label>Intro Description</label><textarea id="en_prop_intro_desc" rows="2"></textarea></div>
                        <div class="fg form-full"><label>Page Background Image (Header)</label>
                            <div class="mu" onclick="openImgPicker('en_rental_bg','rentalBgImg','rentalBgPh',false,event)" style="max-width:350px;">
                                <div class="mu-ph" id="rentalBgPh"><i class="fa-solid fa-panorama"></i></div>
                                <img class="mu-prev" id="rentalBgImg" src="" alt="" style="display:none; width:100%; height:80px; object-fit:cover;">
                            </div>
                            <input type="hidden" id="en_rental_bg">
                        </div>
                    </div>
                </div>
                <div class="rental-lang-panel" id="rent-set-kh" style="display:none;">
                    <div class="form-grid">
                        <div class="fg"><label>Header Title (ខ្មែរ)</label><input type="text" id="kh_rental_header"></div>
                        <div class="fg"><label>Header Subtitle (ខ្មែរ)</label><input type="text" id="kh_rental_sub"></div>
                        <div class="fg"><label>Intro Small Tag (ខ្មែរ)</label><input type="text" id="kh_btn_rental"></div>
                        <div class="fg"><label>Intro Title (ខ្មែរ)</label><input type="text" id="kh_prop_intro_title"></div>
                        <div class="fg form-full"><label>Intro Description (ខ្មែរ)</label><textarea id="kh_prop_intro_desc" rows="2"></textarea></div>
                        <div class="fg form-full"><label>Page Background Image (Header) - ខ្មែរ</label>
                            <div class="mu" onclick="openImgPicker('kh_rental_bg','khRentalBgImg','khRentalBgPh',false,event)" style="max-width:350px;">
                                <div class="mu-ph" id="khRentalBgPh"><i class="fa-solid fa-panorama"></i></div>
                                <img class="mu-prev" id="khRentalBgImg" src="" alt="" style="display:none; width:100%; height:80px; object-fit:cover;">
                            </div>
                            <input type="hidden" id="kh_rental_bg">
                        </div>
                    </div>
                </div>
                <div class="rental-lang-panel" id="rent-set-cn" style="display:none;">
                    <div class="form-grid">
                        <div class="fg"><label>Header Title (中文)</label><input type="text" id="cn_rental_header"></div>
                        <div class="fg"><label>Header Subtitle (中文)</label><input type="text" id="cn_rental_sub"></div>
                        <div class="fg"><label>Intro Small Tag (中文)</label><input type="text" id="cn_btn_rental"></div>
                        <div class="fg"><label>Intro Title (中文)</label><input type="text" id="cn_prop_intro_title"></div>
                        <div class="fg form-full"><label>Intro Description (中文)</label><textarea id="cn_prop_intro_desc" rows="2"></textarea></div>
                        <div class="fg form-full"><label>Page Background Image (Header) - 中文</label>
                            <div class="mu" onclick="openImgPicker('cn_rental_bg','cnRentalBgImg','cnRentalBgPh',false,event)" style="max-width:350px;">
                                <div class="mu-ph" id="cnRentalBgPh"><i class="fa-solid fa-panorama"></i></div>
                                <img class="mu-prev" id="cnRentalBgImg" src="" alt="" style="display:none; width:100%; height:80px; object-fit:cover;">
                            </div>
                            <input type="hidden" id="cn_rental_bg">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TABLE -->
        <div class="tc" style="background:#fff; border-radius:12px; border:1px solid var(--bd); padding-bottom:20px;">
            <div class="tc-head"><div class="tc-title"><i class="fa-solid fa-list-ul" style="color:var(--blue);margin-right:7px"></i> បញ្ជីអគារដែលកំពុងដាក់ជួល</div></div>
            <div style="overflow-x:auto; padding: 0 10px;">
                <table style="width:100%; min-width:800px; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr style="border-bottom:1px solid var(--bd); background:var(--bg);">
                            <th style="padding:10px 15px; color:var(--mu); font-size:0.75rem;">រូបភាព</th>
                            <th style="padding:10px 15px; color:var(--mu); font-size:0.75rem;">ឈ្មោះអគារ</th>
                            <th style="padding:10px 15px; color:var(--mu); font-size:0.75rem;">តម្លៃ/ខែ</th>
                            <th style="padding:10px 15px; color:var(--mu); font-size:0.75rem;">ទីតាំង</th>
                            <th style="padding:10px 15px; color:var(--mu); font-size:0.75rem; text-align:center;">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody id="rentalTableBody"></tbody>
                </table>
            </div>
        </div>

        <!-- ADD/EDIT RENTAL MODAL (WITH AI TRANSLATOR) -->
        <div class="mo" id="moRental" data-backdrop="static">
          <div class="md" style="max-width:800px; width:95%;">
            <div class="mh">
                <h3 id="rentalModalTitle">បន្ថែមអគារថ្មី (Add Property)</h3>
                <button class="close-btn" onclick="closeRentalModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="mc">
                <input type="hidden" id="rentId">
                
                <div class="form-grid" style="margin-bottom:15px;">
                    <div class="fg"><label>តម្លៃប្រចាំខែ (Monthly Price) *</label><input type="text" id="rentPrice" placeholder="ឧ. $3,500"></div>
                    <div class="fg"><label>តម្លៃក្នុង ១ម៉ែត្រការ៉េ (Price/Sqm)</label><input type="text" id="rentPriceSqm" placeholder="ឧ. $1.40"></div>
                    <div class="fg form-full"><label>តំណភ្ជាប់ផែនទី (Google Map Link)</label><input type="url" id="rentMapLink" placeholder="https://maps.google.com/..."></div>
                </div>

                <!-- Badge Design Settings -->
                <div class="form-grid" style="margin-bottom:20px; background:var(--bg); padding:15px; border-radius:8px; border:1px solid var(--bd);">
                    <div class="fg">
                        <label>ពណ៌ផ្លាក (Badge Color)</label>
                        <input type="color" id="rentBadgeColor" value="#ff4d4d" style="width:100%; height:42px; padding:2px; border:1.5px solid var(--bd); border-radius:8px; cursor:pointer; background:#fff;">
                    </div>
                    <div class="fg">
                        <label>រូបតំណាងផ្លាក (Badge Icon)</label>
                        <select id="rentBadgeIcon" style="width:100%; padding:10px 13px; border:1.5px solid var(--bd); border-radius:8px; outline:none; font-family:inherit;">
                            <option value="fa-solid fa-key">🔑 Key (សោ)</option>
                            <option value="fa-solid fa-tag">🏷️ Tag (ស្លាក)</option>
                            <option value="fa-solid fa-star">⭐ Star (ផ្កាយ)</option>
                            <option value="fa-solid fa-fire">🔥 Fire (ភ្លើង)</option>
                            <option value="fa-solid fa-building">🏢 Building (អគារ)</option>
                            <option value="fa-solid fa-check-circle">✔️ Check (ធីក)</option>
                        </select>
                    </div>
                </div>

                <!-- Multilingual Tabs + AI Button -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:2px solid var(--bd); padding-bottom:0;">
                    <div class="lang-tabs" style="border-bottom:none; margin-bottom:0;">
                        <button class="lang-tab active" onclick="switchRentModalLang('en',this)"><span class="flag">🇺🇸</span> EN</button>
                        <button class="lang-tab" onclick="switchRentModalLang('kh',this)"><span class="flag">🇰🇭</span> KH</button>
                        <button class="lang-tab" onclick="switchRentModalLang('cn',this)"><span class="flag">🇨🇳</span> CN</button>
                    </div>
                    <button type="button" class="btn bw btn-sm" id="btnGenAI" onclick="window.generateRentalAI()" style="margin-bottom: 5px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> បកប្រែដោយ AI
                    </button>
                </div>

                <!-- English Fields -->
                <div class="rent-modal-lang-panel active" id="rm-tab-en" style="display:block;">
                    <div class="form-grid">
                        <div class="fg form-full"><label>Title (EN) *</label><input type="text" id="rentTitle" placeholder="e.g. Standard Factory"></div>
                        <div class="fg form-full"><label>Location (EN) *</label><input type="text" id="rentLoc" placeholder="e.g. Svay Rieng Zone A"></div>
                        <div class="fg form-full"><label>Badge Text (EN)</label><input type="text" id="rentBadgeEn" placeholder="e.g. For Rent"></div>
                        <div class="fg form-full"><label>Description (EN)</label><textarea id="rentDesc" rows="3" placeholder="Description details..."></textarea></div>
                    </div>
                </div>
                
                <!-- Khmer Fields -->
                <div class="rent-modal-lang-panel" id="rm-tab-kh" style="display:none;">
                    <div class="form-grid">
                        <div class="fg form-full"><label>ឈ្មោះអគារ (KH)</label><input type="text" id="rentTitle_kh" placeholder="ឧ. អគាររោងចក្រស្តង់ដារ"></div>
                        <div class="fg form-full"><label>ទីតាំង (KH)</label><input type="text" id="rentLoc_kh" placeholder="ឧ. តំបន់ស្វាយរៀង"></div>
                        <div class="fg form-full"><label>អក្សរលើផ្លាក (KH)</label><input type="text" id="rentBadgeKh" placeholder="ឧ. សម្រាប់ជួល"></div>
                        <div class="fg form-full"><label>ការពិពណ៌នា (KH)</label><textarea id="rentDesc_kh" rows="3" placeholder="រៀបរាប់ព័ត៌មានលម្អិត..."></textarea></div>
                    </div>
                </div>
                
                <!-- Chinese Fields -->
                <div class="rent-modal-lang-panel" id="rm-tab-cn" style="display:none;">
                    <div class="form-grid">
                        <div class="fg form-full"><label>名称 (CN)</label><input type="text" id="rentTitle_cn" placeholder="e.g. 标准工业厂房"></div>
                        <div class="fg form-full"><label>位置 (CN)</label><input type="text" id="rentLoc_cn" placeholder="e.g. 柴桢省 A 区"></div>
                        <div class="fg form-full"><label>标签文本 (CN)</label><input type="text" id="rentBadgeCn" placeholder="e.g. 出租"></div>
                        <div class="fg form-full"><label>描述 (CN)</label><textarea id="rentDesc_cn" rows="3" placeholder="描述详情..."></textarea></div>
                    </div>
                </div>

                <!-- Images & Specs -->
                <div class="form-grid" style="margin-top:20px; border-top:1px solid #edf2f7; padding-top:20px;">
                    <div class="fg form-full">
                        <label>រូបភាពចម្បង (Main Image)</label>
                        <div class="iu-area" ondragover="event.preventDefault();this.classList.add('dov')" ondragleave="this.classList.remove('dov')" ondrop="handleRentMainDrop(event)">
                            <input type="file" accept="image/*" onchange="handleRentMainImg(this)" id="rentImgFile">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <p>Drag & Drop or Click to Upload</p>
                            <img class="prev-img" id="rentImgPrev" src="" alt="">
                        </div>
                        <input type="hidden" id="rentImgSrc">
                    </div>
                    
                    <div class="fg form-full">
                        <label>រូបភាពបន្ថែម (Gallery Images)</label>
                        <div class="gal-grid" id="rentGalGrid"></div>
                    </div>

                    <div class="fg form-full">
                        <label>លក្ខណៈពិសេសអគារ (Specifications) - <span style="font-weight:normal;color:var(--mu)">អាចវាយបញ្ចូលចំណងជើងដោយខ្លួនឯង</span></label>
                        <div id="rentSpecsEd"></div>
                        <button class="add-spec" onclick="addRentSpec()" style="margin-top:8px"><i class="fa-solid fa-plus"></i> Add Spec Row</button>
                    </div>
                </div>

            </div>
            <div class="mf">
                <button onclick="closeRentalModal()" class="btn bo">បោះបង់ (Cancel)</button>
                <button onclick="saveRental()" class="btn bp" id="btnSaveRental"><i class="fa-solid fa-save"></i> រក្សាទុក (Save)</button>
            </div>
          </div>
        </div>
    `;
    
    populateRentalSettings();
    fetchRentals();
};

window.updateRentalStats = function() {
    const total = window.rentalList.length;
    let factory = 0;
    let warehouse = 0;

    window.rentalList.forEach(r => {
        const t = (r.title || '').toLowerCase() + ' ' + (r.title_kh || '');
        if(t.includes('factory') || t.includes('រោងចក្រ')) factory++;
        if(t.includes('warehouse') || t.includes('ឃ្លាំង')) warehouse++;
    });

    const elTotal = document.getElementById('rentStatTotal');
    const elFac = document.getElementById('rentStatFactory');
    const elWare = document.getElementById('rentStatWarehouse');

    if(elTotal) elTotal.textContent = total;
    if(elFac) elFac.textContent = factory;
    if(elWare) elWare.textContent = warehouse;
};

/* --- Page Settings --- */
window.switchRentalLang = function(lang, btn) {
    const area = document.getElementById('sa-rentals');
    area.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    area.querySelectorAll('.rental-lang-panel').forEach(p => p.style.display='none');
    document.getElementById('rent-set-'+lang).style.display='block';
};

window.populateRentalSettings = function() {
    let allTR = {};
    try { allTR = JSON.parse(localStorage.getItem('lm_translations') || '{}'); } catch(e) {}
    ['en','kh','cn'].forEach(lang => {
        let tr = allTR[lang] || {};
        ['rental_header','rental_sub','btn_rental','prop_intro_title','prop_intro_desc'].forEach(k => {
            const el = document.getElementById(lang+'_'+k);
            if(el) el.value = tr[k] || PAGE_DEFAULTS[lang][k] || '';
        });
        // Per-language rental background image
        const bgMap = { en:'en_rental_bg', kh:'kh_rental_bg', cn:'cn_rental_bg' };
        const imgMap = { en:'rentalBgImg', kh:'khRentalBgImg', cn:'cnRentalBgImg' };
        const phMap = { en:'rentalBgPh', kh:'khRentalBgPh', cn:'cnRentalBgPh' };
        const bg = document.getElementById(bgMap[lang]);
        const img = document.getElementById(imgMap[lang]);
        const ph = document.getElementById(phMap[lang]);
        const bgVal = tr.rental_bg || '';
        if(bg) bg.value = bgVal;
        if(img) { img.src = bgVal; img.style.display = bgVal ? 'block' : 'none'; }
        if(ph) ph.style.display = bgVal ? 'none' : 'flex';
    });
};

window.saveRentalSettings = async function() {
    if(!window.globalTranslations) window.globalTranslations = {};
    const keys = ['rental_header','rental_sub','btn_rental','prop_intro_title','prop_intro_desc'];
    
    ['en','kh','cn'].forEach(lang => {
        if(!window.globalTranslations[lang]) window.globalTranslations[lang] = {};
        keys.forEach(k => {
            const el = document.getElementById(lang+'_'+k);
            if(el) window.globalTranslations[lang][k] = el.value.trim();
        });
    });
    
    ['en','kh','cn'].forEach(lang => {
        window.globalTranslations[lang].rental_bg = document.getElementById(lang + '_rental_bg')?.value || '';
    });

    if (window.saveTranslationsToDB) {
        await window.saveTranslationsToDB();
        if(window.toast) window.toast('រក្សាទុកព័ត៌មានទំព័រជោគជ័យ!', 'success');
    }
};

/* --- Rental Data --- */
async function fetchRentals() {
    const tbody = document.getElementById('rentalTableBody');
    if (!window.firestoreDB || !window.fsCollection || !window.fsGetDocs) {
        window.rentalList = [...DEFAULT_RENTALS]; renderRentalTable(); return;
    }
    try {
        const snap = await window.fsGetDocs(window.fsCollection(window.firestoreDB, "rentals"));
        window.rentalList = [];
        snap.forEach(doc => window.rentalList.push({ id: doc.id, ...doc.data() }));
        if (window.rentalList.length === 0) window.rentalList = [...DEFAULT_RENTALS];
        renderRentalTable();
    } catch (e) {
        window.rentalList = [...DEFAULT_RENTALS]; renderRentalTable();
    }
}

function renderRentalTable() {
    const tbody = document.getElementById('rentalTableBody');
    if (window.rentalList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--mu);">គ្មានទិន្នន័យ</td></tr>`;
        window.updateRentalStats();
        return;
    }
    tbody.innerHTML = window.rentalList.map(r => `
        <tr style="border-bottom:1px solid #edf2f7;">
            <td style="padding:12px 15px;"><img src="${r.image || 'images/cabinet.jpg'}" style="width:50px; height:40px; object-fit:cover; border-radius:6px;"></td>
            <td style="padding:12px 15px; font-weight:600;">${r.title}</td>
            <td style="padding:12px 15px; color:var(--red); font-weight:bold;">${r.price}</td>
            <td style="padding:12px 15px; color:var(--mu);">${r.location}</td>
            <td style="padding:12px 15px; text-align:center;">
                <button onclick="editRental('${r.id}')" class="btn bo btn-sm btn-icon"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteRental('${r.id}')" class="btn bd2 btn-sm btn-icon"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    window.updateRentalStats();
}

/* --- Modal & Form Logic --- */
window.switchRentModalLang = function(lang, btn) {
    document.querySelectorAll('#moRental .lang-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.rent-modal-lang-panel').forEach(p => p.style.display='none');
    document.getElementById('rm-tab-'+lang).style.display='block';
};

window.openRentalModal = function() {
    document.getElementById('rentId').value = '';
    ['rentPrice','rentPriceSqm','rentTitle','rentLoc','rentDesc',
     'rentTitle_kh','rentLoc_kh','rentDesc_kh',
     'rentTitle_cn','rentLoc_cn','rentDesc_cn',
     'rentImgSrc','rentMapLink'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
    });
    
    // Default Badges
    document.getElementById('rentBadgeEn').value = 'For Rent';
    document.getElementById('rentBadgeKh').value = 'សម្រាប់ជួល';
    document.getElementById('rentBadgeCn').value = '出租';
    document.getElementById('rentBadgeColor').value = '#ff4d4d';
    document.getElementById('rentBadgeIcon').value = 'fa-solid fa-key';

    window.rentMainImgData = null; window.rentGalImgs = [];
    document.getElementById('rentImgPrev').classList.remove('show');
    document.getElementById('rentImgFile').value = '';
    
    renderRentGal(); renderRentSpecs({});
    addRentSpec('', '');
    
    document.getElementById('rentalModalTitle').textContent = 'បន្ថែមអគារថ្មី (Add Property)';
    document.getElementById('moRental').classList.add('open');
};

window.closeRentalModal = function() {
    document.getElementById('moRental').classList.remove('open');
};

window.editRental = function(id) {
    const r = window.rentalList.find(x => x.id === id); if (!r) return;
    
    document.getElementById('rentId').value = r.id;
    document.getElementById('rentPrice').value = r.price || '';
    document.getElementById('rentPriceSqm').value = r.price_sqm || '';
    document.getElementById('rentMapLink').value = r.map_link || '';
    
    document.getElementById('rentBadgeEn').value = r.badge_en || 'For Rent';
    document.getElementById('rentBadgeKh').value = r.badge_kh || 'សម្រាប់ជួល';
    document.getElementById('rentBadgeCn').value = r.badge_cn || '出租';
    document.getElementById('rentBadgeColor').value = r.badge_color || '#ff4d4d';
    document.getElementById('rentBadgeIcon').value = r.badge_icon || 'fa-solid fa-key';

    document.getElementById('rentTitle').value = r.title || '';
    document.getElementById('rentLoc').value = r.location || '';
    document.getElementById('rentDesc').value = r.description || r.desc || '';
    
    document.getElementById('rentTitle_kh').value = r.title_kh || '';
    document.getElementById('rentLoc_kh').value = r.location_kh || '';
    document.getElementById('rentDesc_kh').value = r.desc_kh || '';
    
    document.getElementById('rentTitle_cn').value = r.title_cn || '';
    document.getElementById('rentLoc_cn').value = r.location_cn || '';
    document.getElementById('rentDesc_cn').value = r.desc_cn || '';
    
    document.getElementById('rentImgSrc').value = r.image || '';
    window.rentMainImgData = r.image || null;
    
    if(r.image) {
        document.getElementById('rentImgPrev').src = r.image;
        document.getElementById('rentImgPrev').classList.add('show');
    } else {
        document.getElementById('rentImgPrev').classList.remove('show');
    }
    
    window.rentGalImgs = r.gallery ? [...r.gallery] : [];
    renderRentGal();
    
    let loadedSpecs = r.specs || {};
    if (!r.specs && (r.area || r.power)) {
        if(r.area) loadedSpecs["Total Area"] = r.area;
        if(r.power) loadedSpecs["Power"] = r.power;
    }
    renderRentSpecs(loadedSpecs);

    document.getElementById('rentalModalTitle').textContent = 'កែប្រែអគារ (Edit Property)';
    document.getElementById('moRental').classList.add('open');
};

/* --- Images Handling for Rental --- */
window.handleRentMainImg = function(input) {
  const file = input.files[0]; if(!file) return;
  if(window.compressImage) {
      window.compressImage(file, (compressed) => {
        window.rentMainImgData = compressed;
        document.getElementById('rentImgSrc').value = ''; 
        const pv = document.getElementById('rentImgPrev');
        pv.src = compressed; pv.classList.add('show');
      });
  }
};
window.handleRentMainDrop = function(e) { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('image/')) window.handleRentMainImg({files:[f]}); };

window.handleRentGalAdd = function(input) {
  const files = Array.from(input.files); let done=0;
  if(window.compressImage) {
      files.forEach(file => {
        window.compressImage(file, (compressed) => {
          window.rentGalImgs.push(compressed); done++;
          if(done===files.length) renderRentGal();
        });
      }); input.value='';
  }
};
window.renderRentGal = function() {
  const g = document.getElementById('rentGalGrid');
  const items = window.rentGalImgs.map((src,i)=>`<div class="gi"><img src="${src}" alt=""><button class="gi-del" onclick="delRentGal(${i})"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
  g.innerHTML = items + `<div class="ga"><i class="fa-solid fa-plus"></i><input type="file" accept="image/*" multiple onchange="handleRentGalAdd(this)"></div>`;
};
window.delRentGal = function(i){ window.rentGalImgs.splice(i,1); renderRentGal(); };

/* --- Dynamic Specs Handling for Rental --- */
window.renderRentSpecs = function(s){
    const ed = document.getElementById('rentSpecsEd'); ed.innerHTML='';
    Object.entries(s).forEach(([k,v]) => addRentSpec(k,v));
};
window.addRentSpec = function(k='',v=''){
    const ed = document.getElementById('rentSpecsEd');
    const r = document.createElement('div'); 
    r.className = 'spec-row';
    r.style.display = 'flex'; r.style.gap = '8px'; r.style.alignItems = 'center'; r.style.marginBottom = '8px';
    r.innerHTML = `
        <input type="text" placeholder="ចំណងជើង (ឧ. ទំហំ Area)" value="${k}" style="flex:1; padding:8px 12px; border:1.5px solid var(--bd); border-radius:8px; outline:none;">
        <input type="text" placeholder="តម្លៃ (ឧ. 2500 sqm)" value="${v}" style="flex:1; padding:8px 12px; border:1.5px solid var(--bd); border-radius:8px; outline:none;">
        <button type="button" onclick="this.parentNode.remove()" style="width:34px; height:34px; border:none; border-radius:8px; background:var(--rel); color:var(--re); cursor:pointer; flex-shrink:0;"><i class="fa-solid fa-xmark"></i></button>
    `;
    ed.appendChild(r);
};
window.collectRentSpecs = function(){
    const s = {};
    document.querySelectorAll('#rentSpecsEd .spec-row').forEach(r => {
        const ins = r.querySelectorAll('input');
        const k = ins[0].value.trim(); const v = ins[1].value.trim();
        if(k) s[k] = v;
    });
    return s;
};

/* ==========================================
   AI AUTO-TRANSLATOR (Gemini API Integration)
   ========================================== */
window.generateRentalAI = async function() {
    const titleEn = document.getElementById('rentTitle').value.trim();
    const locEn = document.getElementById('rentLoc').value.trim();
    const descEn = document.getElementById('rentDesc').value.trim();

    if (!titleEn && !descEn) {
        if(window.toast) window.toast('សូមបញ្ចូលអក្សរអង់គ្លេសខ្លះៗសិន! (Enter English text first)', 'error');
        return;
    }

    const btn = document.getElementById('btnGenAI');
    const ogHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងបកប្រែ...';
    btn.disabled = true;

    // AI API Configuration (Using Gemini as per the execution environment rules)
    const apiKey = ""; // API key is automatically injected by the environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const prompt = `You are a professional real estate translator. Translate the following property details from English to natural Khmer and Simplified Chinese. 
    Return ONLY a valid JSON object in this exact format without any markdown formatting or backticks:
    {
      "title_kh": "...",
      "loc_kh": "...",
      "desc_kh": "...",
      "title_cn": "...",
      "loc_cn": "...",
      "desc_cn": "..."
    }

    Data to translate:
    Title: ${titleEn || 'N/A'}
    Location: ${locEn || 'N/A'}
    Description: ${descEn || 'N/A'}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Always return raw JSON without markdown formatting." }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API Request Failed');

        const result = await response.json();
        let text = result.candidates[0].content.parts[0].text;
        
        // Clean up markdown block if AI accidentally included it
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const data = JSON.parse(text);

        // Fill the fields
        if(data.title_kh && data.title_kh !== 'N/A') document.getElementById('rentTitle_kh').value = data.title_kh;
        if(data.loc_kh && data.loc_kh !== 'N/A') document.getElementById('rentLoc_kh').value = data.loc_kh;
        if(data.desc_kh && data.desc_kh !== 'N/A') document.getElementById('rentDesc_kh').value = data.desc_kh;

        if(data.title_cn && data.title_cn !== 'N/A') document.getElementById('rentTitle_cn').value = data.title_cn;
        if(data.loc_cn && data.loc_cn !== 'N/A') document.getElementById('rentLoc_cn').value = data.loc_cn;
        if(data.desc_cn && data.desc_cn !== 'N/A') document.getElementById('rentDesc_cn').value = data.desc_cn;

        if(window.toast) window.toast('បកប្រែជោគជ័យ! (Translated successfully)', 'success');
        
        // Switch to Khmer tab to show user the result
        document.querySelectorAll('#moRental .lang-tab')[1].click();

    } catch (error) {
        console.error("AI Translation Error:", error);
        if(window.toast) window.toast('បរាជ័យក្នុងការបកប្រែ។ សូមសាកល្បងម្តងទៀត!', 'error');
    } finally {
        btn.innerHTML = ogHtml;
        btn.disabled = false;
    }
};

/* --- Saving to Firebase --- */
window.saveRental = async function() {
    const id = document.getElementById('rentId').value;
    const titleEn = document.getElementById('rentTitle').value.trim();
    const price = document.getElementById('rentPrice').value.trim();

    if (!titleEn || !price) {
        if(window.toast) window.toast('សូមបញ្ចូលឈ្មោះ(EN) និងតម្លៃអគារ!', 'error'); return;
    }

    const finalImg = document.getElementById('rentImgSrc').value || window.rentMainImgData || (window.rentGalImgs[0] || 'images/cabinet.jpg');
    const finalGal = window.rentGalImgs.length ? window.rentGalImgs : [finalImg];

    const data = {
        title: titleEn,
        title_kh: document.getElementById('rentTitle_kh').value.trim(),
        title_cn: document.getElementById('rentTitle_cn').value.trim(),
        
        location: document.getElementById('rentLoc').value.trim(),
        location_kh: document.getElementById('rentLoc_kh').value.trim(),
        location_cn: document.getElementById('rentLoc_cn').value.trim(),
        
        description: document.getElementById('rentDesc').value.trim(),
        desc_kh: document.getElementById('rentDesc_kh').value.trim(),
        desc_cn: document.getElementById('rentDesc_cn').value.trim(),
        
        badge_en: document.getElementById('rentBadgeEn').value.trim(),
        badge_kh: document.getElementById('rentBadgeKh').value.trim(),
        badge_cn: document.getElementById('rentBadgeCn').value.trim(),
        badge_color: document.getElementById('rentBadgeColor').value,
        badge_icon: document.getElementById('rentBadgeIcon').value,
        map_link: document.getElementById('rentMapLink').value.trim(),

        price: price,
        price_sqm: document.getElementById('rentPriceSqm').value.trim(),
        image: finalImg,
        gallery: finalGal,
        specs: collectRentSpecs(),
        updatedAt: new Date().toISOString()
    };

    const btn = document.getElementById('btnSaveRental');
    const ogText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> រក្សាទុក...'; btn.disabled = true;

    if (window.firestoreDB && window.fsCollection) {
        try {
            if (id && !id.startsWith('default_')) {
                await window.fsUpdateDoc(window.fsDoc(window.firestoreDB, "rentals", id), data);
                if (window.toast) window.toast('កែប្រែជោគជ័យ!', 'success');
            } else {
                data.createdAt = new Date().toISOString();
                await window.fsAddDoc(window.fsCollection(window.firestoreDB, "rentals"), data);
                if (window.toast) window.toast('បញ្ចូលជោគជ័យ!', 'success');
            }
            closeRentalModal();
            fetchRentals();
        } catch (e) {
            console.error("Save error:", e);
            if (window.toast) window.toast('មានបញ្ហាក្នុងការរក្សាទុក', 'error');
        }
    } else {
        if (window.toast) window.toast('No Database connection', 'error');
    }
    btn.innerHTML = ogText; btn.disabled = false;
};

window.deleteRental = async function(id) {
    if(!id) return;
    if (!confirm('តើអ្នកពិតជាចង់លុបអគារនេះមែនទេ?')) return;
    
    if (id.startsWith('default_')) {
        window.rentalList = window.rentalList.filter(r => r.id !== id);
        renderRentalTable(); return;
    }

    if (window.firestoreDB && window.fsDeleteDoc) {
        try {
            await window.fsDeleteDoc(window.fsDoc(window.firestoreDB, "rentals", id));
            if (window.toast) window.toast('លុបជោគជ័យ!', 'success');
            fetchRentals();
        } catch (e) {
            if (window.toast) window.toast('លុបមិនជោគជ័យ', 'error');
        }
    }
};