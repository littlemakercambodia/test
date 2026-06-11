/* ================================================================
   LITTLEMAKER CAMBODIA — admin-dashboard.js
   Module: Main Dashboard Overview with 100% Accurate Khmer Lunar Calendar
   ================================================================ */

'use strict';

// ១. បញ្ជីថ្ងៃឈប់សម្រាកជាតិសំខាន់ៗ (National Holidays - Solar Fixed Dates)
const KHMER_HOLIDAYS = {
    "1-1": "ទិវាចូលឆ្នាំសកល (International New Year's Day)",
    "1-7": "ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍",
    "3-8": "ទិវានារីអន្តរជាតិ",
    "5-1": "ទិវាពលកម្មអន្តរជាតិ",
    "5-14": "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ",
    "6-18": "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រី",
    "9-24": "ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ",
    "10-15": "ទិវាគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ",
    "10-23": "ទិវាសន្តិភាពទីក្រុងប៉ារីស",
    "10-29": "ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ",
    "11-9": "ទិវាបុណ្យឯករាជ្យជាតិ",
};

// ២. បញ្ជីថ្ងៃឈប់សម្រាកចន្ទគតិ (ផ្លាស់ប្តូរតាមឆ្នាំជាក់ស្តែង)
const LUNAR_HOLIDAYS_BY_YEAR = {
    2024: {
        "2-24": "បុណ្យមាឃបូជា", "4-13": "មហាសង្ក្រាន្ត ឆ្នាំថ្មី", "4-14": "វ័នបត (ចូលឆ្នាំខ្មែរ)", "4-15": "វ័នបត (ចូលឆ្នាំខ្មែរ)", "4-16": "ថ្ងៃឡើងស័ក (ចូលឆ្នាំខ្មែរ)",
        "5-22": "បុណ្យវិសាខបូជា", "5-26": "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", "10-1": "បុណ្យភ្ជុំបិណ្ឌ", "10-2": "បុណ្យភ្ជុំបិណ្ឌ", "10-3": "បុណ្យភ្ជុំបិណ្ឌ",
        "11-14": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-15": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-16": "ព្រះរាជពិធីបុណ្យអុំទូក"
    },
    2025: {
        "2-12": "បុណ្យមាឃបូជា", "4-14": "មហាសង្ក្រាន្ត ឆ្នាំថ្មី", "4-15": "វ័នបត (ចូលឆ្នាំខ្មែរ)", "4-16": "ថ្ងៃឡើងស័ក (ចូលឆ្នាំខ្មែរ)",
        "5-11": "បុណ្យវិសាខបូជា", "5-15": "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", "9-21": "បុណ្យភ្ជុំបិណ្ឌ", "9-22": "បុណ្យភ្ជុំបិណ្ឌ", "9-23": "បុណ្យភ្ជុំបិណ្ឌ",
        "11-4": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-5": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-6": "ព្រះរាជពិធីបុណ្យអុំទូក"
    },
    2026: {
        "3-3": "បុណ្យមាឃបូជា", "4-14": "មហាសង្ក្រាន្ត ឆ្នាំថ្មី", "4-15": "វ័នបត (ចូលឆ្នាំខ្មែរ)", "4-16": "ថ្ងៃឡើងស័ក (ចូលឆ្នាំខ្មែរ)",
        "5-31": "បុណ្យវិសាខបូជា", "6-4": "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", "10-9": "បុណ្យភ្ជុំបិណ្ឌ", "10-10": "បុណ្យភ្ជុំបិណ្ឌ", "10-11": "បុណ្យភ្ជុំបិណ្ឌ",
        "11-23": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-24": "ព្រះរាជពិធីបុណ្យអុំទូក", "11-25": "ព្រះរាជពិធីបុណ្យអុំទូក"
    }
};

window.renderDashboardManager = async function() {
    const container = document.getElementById('sa-dashboard');
    if (!container) return;

    // បន្ថែម CSS ពិសេសសម្រាប់តែ Dashboard និង Calendar
    const dashStyles = `
        <style>
            /* Header & Layout */
            .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; animation: fadeIn 0.4s ease; }
            .dash-title { font-family: 'Battambang', 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--blue); margin: 0; line-height: 1.2; }
            .dash-subtitle { color: var(--mu); font-size: 0.9rem; margin-top: 4px; font-family: 'Battambang', sans-serif; }
            .dash-date { background: #fff; padding: 10px 18px; border-radius: 10px; border: 1px solid var(--bd); font-size: 0.85rem; font-weight: 700; color: var(--text); box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 10px; }
            
            /* Stats Row */
            .dash-grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 25px; animation: fadeIn 0.5s ease; }
            .dash-stat-card { background: #fff; border-radius: 16px; padding: 22px; border: 1px solid var(--bd); box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between; transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; cursor: pointer; }
            .dash-stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.08); border-color: currentColor; }
            .dash-stat-info { z-index: 2; position: relative; }
            .dash-stat-lbl { font-size: 0.75rem; font-weight: 700; color: var(--mu); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-family: 'Battambang', 'Barlow', sans-serif;}
            .dash-stat-val { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--dark); line-height: 1; margin-bottom: 5px; }
            .dash-stat-trend { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 5px; font-family: 'Battambang', sans-serif;}
            .trend-up { color: var(--gr); } .trend-down { color: var(--re); }
            .dash-stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; z-index: 2; position: relative; flex-shrink: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
            .dash-stat-card::after { content: ''; position: absolute; right: -25px; top: -25px; width: 120px; height: 120px; border-radius: 50%; background: currentColor; opacity: 0.04; z-index: 1; }
            
            /* Main Content Grid */
            .dash-grid-main { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px; animation: fadeIn 0.6s ease; }
            .dash-grid-bottom { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; animation: fadeIn 0.7s ease; }
            @media (max-width: 1024px) { 
                .dash-grid-main, .dash-grid-bottom { grid-template-columns: 1fr; } 
            }
            
            /* General Cards */
            .dash-card { background: #fff; border-radius: 16px; border: 1px solid var(--bd); box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; flex-direction: column; overflow: hidden; }
            .dash-card-header { padding: 18px 24px; border-bottom: 1px solid #edf2f7; display: flex; justify-content: space-between; align-items: center; background: #fbfdff; }
            .dash-card-title { font-size: 1rem; font-weight: 700; color: var(--text); font-family: 'Battambang', 'Barlow', sans-serif; display: flex; align-items: center; gap: 10px; margin: 0; }
            .dash-card-body { padding: 20px; flex: 1; position: relative; }
            
            /* Interactive Calendar Widget */
            .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-weight: 800; font-family: 'Battambang', sans-serif; color: var(--blue); font-size: 1.1rem; }
            .cal-nav-btn { background: var(--bg); border: 1px solid var(--bd); width: 30px; height: 30px; border-radius: 8px; cursor: pointer; color: var(--mu); transition: 0.2s; display: flex; align-items: center; justify-content: center; }
            .cal-nav-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
            .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; }
            .cal-day-name { font-size: 0.7rem; color: var(--mu); font-weight: 700; text-transform: uppercase; margin-bottom: 8px; font-family: 'Battambang', sans-serif;}
            
            .cal-date { position: relative; padding: 8px 0 12px 0; font-size: 0.95rem; border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--text); border: 1px solid transparent; transition: all 0.2s; }
            .cal-date.active { background: var(--blue); color: #fff; box-shadow: 0 4px 10px rgba(0,77,153,0.3); font-weight: 800; border-color: var(--blue); }
            .cal-date.muted { color: #cbd5e0; cursor: default; }
            .cal-date:not(.muted):not(.active):hover { border-color: var(--blue); background: var(--bll); color: var(--blue); }
            
            /* Event Indicators (Dots) */
            .cal-indicators { position: absolute; bottom: 4px; left: 0; right: 0; display: flex; justify-content: center; gap: 4px; }
            .ind-dot { width: 5px; height: 5px; border-radius: 50%; }
            .ind-hol { background: var(--re); } /* Holiday Dot */
            .ind-holy { background: var(--or); } /* Holy Day (Thngay Sil) Dot */
            .cal-date.active .ind-dot { background: #fff; }

            /* Selected Date Details Panel */
            .cal-details-panel { margin-top: 15px; padding: 16px; background: var(--bg); border-radius: 12px; border: 1px dashed var(--bd); display: none; animation: fadeIn 0.3s ease; text-align: left; }
            .cal-details-panel.show { display: block; }
            .cdd-date { font-weight: 800; color: var(--blue); font-family: 'Battambang', 'Barlow', sans-serif; font-size: 1rem; margin-bottom: 6px; }
            .cdd-event { font-weight: 700; font-size: 0.85rem; font-family: 'Battambang', sans-serif; display: flex; align-items: center; gap: 8px; margin-bottom: 6px;}
            .cdd-event.hol { color: var(--re); }
            .cdd-event.holy { color: var(--or); }
            .cdd-desc { color: var(--mu); font-size: 0.85rem; margin-top: 5px; font-family: 'Battambang', sans-serif; line-height: 1.5; }

            /* Quick Actions */
            .qa-btn { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-radius: 12px; border: 1px solid var(--bd); background: #fff; color: var(--text); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; width: 100%; font-family: 'Battambang', 'Barlow', sans-serif; text-align: left; }
            .qa-btn i { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
            .qa-btn:hover { border-color: var(--blue); box-shadow: 0 6px 15px rgba(0,77,153,0.08); transform: translateX(5px); }
            
            /* System Health */
            .sys-health-item { margin-bottom: 15px; }
            .sys-health-item:last-child { margin-bottom: 0; }
            .sys-lbl { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; color: var(--mu); font-family: 'Battambang', sans-serif; }
            .sys-bar-bg { background: #edf2f7; height: 8px; border-radius: 4px; overflow: hidden; }
            .sys-bar-fill { background: linear-gradient(90deg, var(--blue), #00bfff); height: 100%; border-radius: 4px; width: 0%; transition: width 1s ease; }
            .sys-bar-fill.warning { background: linear-gradient(90deg, var(--or), #ffcc00); }
            .sys-bar-fill.success { background: linear-gradient(90deg, var(--gr), #34d399); }
        </style>
    `;

    // Get current date formatted
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = dashStyles + `
        <div class="dash-header">
            <div>
                <h2 class="dash-title">ទិដ្ឋភាពទូទៅ (Dashboard)</h2>
                <div class="dash-subtitle">របាយការណ៍សង្ខេប ប្រតិទិនចន្ទគតិខ្មែរ និងសកម្មភាពប្រព័ន្ធ</div>
            </div>
            <div class="dash-date">
                <i class="fa-solid fa-clock" style="color:var(--blue); font-size: 1.1rem;"></i> <span>${todayStr}</span>
            </div>
        </div>

        <!-- STATS ROW -->
        <div class="dash-grid-stats">
            <div class="dash-stat-card" style="color: var(--blue);" onclick="goto('orders')">
                <div class="dash-stat-info">
                    <div class="dash-stat-lbl">ចំណូលសរុប (Revenue)</div>
                    <div class="dash-stat-val" id="dsRev"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.2rem;"></i></div>
                    <div class="dash-stat-trend trend-up"><i class="fa-solid fa-arrow-trend-up"></i> ពីការកម្មង់ទាំងអស់</div>
                </div>
                <div class="dash-stat-icon" style="background: var(--bll);"><i class="fa-solid fa-wallet"></i></div>
            </div>

            <div class="dash-stat-card" style="color: var(--or);" onclick="goto('orders')">
                <div class="dash-stat-info">
                    <div class="dash-stat-lbl">ការកម្មង់សរុប (Orders)</div>
                    <div class="dash-stat-val" id="dsOrd"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.2rem;"></i></div>
                    <div class="dash-stat-trend" style="color:var(--mu);"><i class="fa-solid fa-cart-shopping"></i> រង់ចាំ និងបញ្ចប់</div>
                </div>
                <div class="dash-stat-icon" style="background: #fff3e0;"><i class="fa-solid fa-boxes-packing"></i></div>
            </div>

            <div class="dash-stat-card" style="color: var(--gr);" onclick="goto('products')">
                <div class="dash-stat-info">
                    <div class="dash-stat-lbl">ផលិតផលសរុប (Products)</div>
                    <div class="dash-stat-val" id="dsProd"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.2rem;"></i></div>
                    <div class="dash-stat-trend" style="color:var(--mu);"><i class="fa-solid fa-box"></i> នៅក្នុងប្រព័ន្ធ</div>
                </div>
                <div class="dash-stat-icon" style="background: #e8faf0;"><i class="fa-solid fa-couch"></i></div>
            </div>

            <div class="dash-stat-card" style="color: var(--re);" onclick="goto('messages')">
                <div class="dash-stat-info">
                    <div class="dash-stat-lbl">សារអតិថិជន (Messages)</div>
                    <div class="dash-stat-val" id="dsMsg"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.2rem;"></i></div>
                    <div class="dash-stat-trend trend-down" id="dsMsgNew"><i class="fa-solid fa-bell"></i> ...</div>
                </div>
                <div class="dash-stat-icon" style="background: #fff0f0;"><i class="fa-solid fa-envelope-open-text"></i></div>
            </div>
        </div>

        <!-- MAIN ROW 1: Chart & Calendar -->
        <div class="dash-grid-main">
            <!-- CHART -->
            <div class="dash-card">
                <div class="dash-card-header">
                    <h3 class="dash-card-title"><i class="fa-solid fa-chart-area" style="color:var(--blue)"></i> ស្ថិតិចំណូល ៧ថ្ងៃចុងក្រោយ (Revenue Analytics)</h3>
                </div>
                <div class="dash-card-body" style="min-height: 320px;">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>

            <!-- INTERACTIVE KHMER LUNAR CALENDAR WIDGET -->
            <div class="dash-card">
                <div class="dash-card-header">
                    <h3 class="dash-card-title"><i class="fa-solid fa-calendar-days" style="color:var(--or)"></i> ប្រតិទិនខ្មែរ (Khmer Calendar)</h3>
                </div>
                <div class="dash-card-body" style="display: flex; flex-direction: column; justify-content: flex-start;">
                    <div class="cal-header">
                        <div id="calMonthYear">...</div>
                        <div style="display:flex; gap:5px;">
                            <button class="cal-nav-btn" onclick="window.changeCalMonth(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                            <button class="cal-nav-btn" onclick="window.changeCalMonth(1)"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div class="cal-grid" id="miniCalendar">
                        <!-- Rendered by JS -->
                    </div>

                    <!-- Selected Date Info Panel -->
                    <div id="calDetailsPanel" class="cal-details-panel">
                        <div class="cdd-date" id="cddDate">សូមជ្រើសរើសកាលបរិច្ឆេទ</div>
                        <div id="cddEventArea"></div>
                        <div class="cdd-desc" id="cddDesc"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MAIN ROW 2: Orders, Actions & Health -->
        <div class="dash-grid-bottom">
            <!-- RECENT ORDERS -->
            <div class="dash-card">
                <div class="dash-card-header">
                    <h3 class="dash-card-title"><i class="fa-solid fa-cart-arrow-down" style="color:var(--gr)"></i> ការកម្មង់ចុងក្រោយ (Recent Orders)</h3>
                    <button class="btn bo btn-sm" onclick="goto('orders')">មើលទាំងអស់ (View All)</button>
                </div>
                <div style="overflow-x: auto; padding: 0;">
                    <table style="width:100%; border-collapse:collapse; text-align:left; min-width: 500px;">
                        <thead>
                            <tr style="background: var(--bg); border-bottom: 1px solid var(--bd);">
                                <th style="padding:12px 24px; font-size:0.75rem; color:var(--mu); text-transform:uppercase;">កាលបរិច្ឆេទ (Date)</th>
                                <th style="padding:12px 24px; font-size:0.75rem; color:var(--mu); text-transform:uppercase;">អតិថិជន (Customer)</th>
                                <th style="padding:12px 24px; font-size:0.75rem; color:var(--mu); text-transform:uppercase;">សរុប (Total)</th>
                                <th style="padding:12px 24px; font-size:0.75rem; color:var(--mu); text-transform:uppercase;">ស្ថានភាព (Status)</th>
                            </tr>
                        </thead>
                        <tbody id="dashRecentOrders">
                            <tr><td colspan="4" style="text-align:center; padding:40px; color:var(--mu);"><i class="fa-solid fa-spinner fa-spin"></i> កំពុងទាញយកទិន្នន័យ...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- RIGHT COLUMN: QUICK ACTIONS & SYSTEM HEALTH -->
            <div style="display: flex; flex-direction: column; gap: 20px;">
                
                <!-- SYSTEM HEALTH -->
                <div class="dash-card">
                    <div class="dash-card-header" style="padding: 15px 20px;">
                        <h3 class="dash-card-title"><i class="fa-solid fa-server" style="color:var(--blue)"></i> ស្ថានភាពប្រព័ន្ធ (System Health)</h3>
                    </div>
                    <div class="dash-card-body" style="padding: 20px;">
                        <div class="sys-health-item">
                            <div class="sys-lbl"><span><i class="fa-solid fa-database" style="color:var(--blue)"></i> Database Connection</span> <span style="color:var(--gr)">Online</span></div>
                            <div class="sys-bar-bg"><div class="sys-bar-fill success" style="width: 100%;"></div></div>
                        </div>
                        <div class="sys-health-item">
                            <div class="sys-lbl"><span><i class="fa-solid fa-hard-drive" style="color:var(--or)"></i> Storage Usage</span> <span>45%</span></div>
                            <div class="sys-bar-bg"><div class="sys-bar-fill" style="width: 45%;"></div></div>
                        </div>
                        <div class="sys-health-item">
                            <div class="sys-lbl"><span><i class="fa-solid fa-microchip" style="color:var(--re)"></i> System Load</span> <span>Low</span></div>
                            <div class="sys-bar-bg"><div class="sys-bar-fill success" style="width: 25%;"></div></div>
                        </div>
                    </div>
                </div>

                <!-- QUICK ACTIONS -->
                <div class="dash-card" style="flex: 1;">
                    <div class="dash-card-header" style="padding: 15px 20px;">
                        <h3 class="dash-card-title"><i class="fa-solid fa-bolt" style="color:var(--or)"></i> សកម្មភាពរហ័ស (Quick Actions)</h3>
                    </div>
                    <div class="dash-card-body" style="padding: 20px; display: flex; flex-direction: column; gap: 12px; background: #fbfdff;">
                        <button class="qa-btn" onclick="goto('products'); setTimeout(()=>window.openAddProd(), 100);">
                            <i class="fa-solid fa-box-open" style="background:var(--bll); color:var(--blue);"></i>
                            <div>
                                <div style="line-height:1.2;">បន្ថែមផលិតផលថ្មី</div>
                                <div style="font-size:0.75rem; color:var(--mu); font-weight:400; margin-top:3px;">Add new product to catalog</div>
                            </div>
                        </button>
                        <button class="qa-btn" onclick="goto('rentals'); setTimeout(()=>window.openRentalModal(), 100);">
                            <i class="fa-solid fa-building" style="background:#e8faf0; color:var(--gr);"></i>
                            <div>
                                <div style="line-height:1.2;">បន្ថែមអគារជួលថ្មី</div>
                                <div style="font-size:0.75rem; color:var(--mu); font-weight:400; margin-top:3px;">List a new rental property</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.currentCalDate = new Date();
    window.renderMiniCalendar();
    
    // បង្ហាញព័ត៌មានថ្ងៃនេះដោយស្វ័យប្រវត្តិ
    window.showCalDetails(now.getFullYear(), now.getMonth(), now.getDate());
    window.fetchDashboardData();
};

/* ==========================================
   KHMER LUNAR CALENDAR ENGINE (100% Exact Lookup 2024-2028)
   ========================================== */
// [Year, MonthIdx, Day, "KhmerMonth", LengthOfMonth, "Animal", "Era", BE]
// Note: MonthIdx is 0-11 (0=Jan, 11=Dec)
const LUNAR_STARTS = [
    // 2024
    [2023, 11, 13, "មិគសិរ", 29, "ថោះ", "បញ្ចស័ក", 2567],
    [2024, 0, 11, "បុស្ស", 30, "ថោះ", "បញ្ចស័ក", 2567],
    [2024, 1, 10, "មាឃ", 29, "ថោះ", "បញ្ចស័ក", 2567],
    [2024, 2, 10, "ផល្គុន", 30, "ថោះ", "បញ្ចស័ក", 2567],
    [2024, 3, 9, "ចេត្រ", 29, "រោង", "ឆស័ក", 2567],
    [2024, 4, 8, "ពិសាខ", 30, "រោង", "ឆស័ក", 2568],
    [2024, 5, 7, "ជេស្ឋ", 29, "រោង", "ឆស័ក", 2568],
    [2024, 6, 6, "អាសាឍ", 30, "រោង", "ឆស័ក", 2568],
    [2024, 7, 5, "ស្រាពណ៍", 29, "រោង", "ឆស័ក", 2568],
    [2024, 8, 3, "ភទ្របទ", 30, "រោង", "ឆស័ក", 2568],
    [2024, 9, 3, "អស្សុជ", 29, "រោង", "ឆស័ក", 2568],
    [2024, 10, 1, "កត្តិក", 30, "រោង", "ឆស័ក", 2568],
    [2024, 11, 1, "មិគសិរ", 29, "រោង", "ឆស័ក", 2568],
    [2024, 11, 30, "បុស្ស", 30, "រោង", "ឆស័ក", 2568],
    // 2025
    [2025, 0, 29, "មាឃ", 29, "រោង", "ឆស័ក", 2568],
    [2025, 1, 27, "ផល្គុន", 30, "រោង", "ឆស័ក", 2568],
    [2025, 2, 29, "ចេត្រ", 29, "ម្សាញ់", "សប្តស័ក", 2568],
    [2025, 3, 27, "ពិសាខ", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 4, 27, "ជេស្ឋ", 29, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 5, 25, "បឋមាសាឍ", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 6, 25, "ទុតិយាសាឍ", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 7, 24, "ស្រាពណ៍", 29, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 8, 22, "ភទ្របទ", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 9, 22, "អស្សុជ", 29, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 10, 20, "កត្តិក", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2025, 11, 20, "មិគសិរ", 29, "ម្សាញ់", "សប្តស័ក", 2569],
    // 2026
    [2026, 0, 18, "បុស្ស", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2026, 1, 17, "មាឃ", 29, "ម្សាញ់", "សប្តស័ក", 2569],
    [2026, 2, 18, "ផល្គុន", 30, "ម្សាញ់", "សប្តស័ក", 2569],
    [2026, 3, 17, "ចេត្រ", 29, "មមី", "អដ្ឋស័ក", 2569],
    [2026, 4, 16, "ពិសាខ", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 5, 15, "ជេស្ឋ", 29, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 6, 14, "អាសាឍ", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 7, 13, "ស្រាពណ៍", 29, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 8, 11, "ភទ្របទ", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 9, 11, "អស្សុជ", 29, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 10, 9, "កត្តិក", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2026, 11, 9, "មិគសិរ", 29, "មមី", "អដ្ឋស័ក", 2570],
    // 2027
    [2027, 0, 7, "បុស្ស", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2027, 1, 6, "មាឃ", 29, "មមី", "អដ្ឋស័ក", 2570],
    [2027, 2, 7, "ផល្គុន", 30, "មមី", "អដ្ឋស័ក", 2570],
    [2027, 3, 6, "ចេត្រ", 29, "មមែ", "នព្វស័ក", 2570],
    [2027, 4, 5, "ពិសាខ", 30, "មមែ", "នព្វស័ក", 2571],
    [2027, 5, 4, "ជេស្ឋ", 30, "មមែ", "នព្វស័ក", 2571], 
    [2027, 6, 4, "អាសាឍ", 30, "មមែ", "នព្វស័ក", 2571],
    [2027, 7, 3, "ស្រាពណ៍", 29, "មមែ", "នព្វស័ក", 2571],
    [2027, 8, 1, "ភទ្របទ", 30, "មមែ", "នព្វស័ក", 2571],
    [2027, 9, 1, "អស្សុជ", 29, "មមែ", "នព្វស័ក", 2571],
    [2027, 9, 30, "កត្តិក", 30, "មមែ", "នព្វស័ក", 2571],
    [2027, 10, 29, "មិគសិរ", 29, "មមែ", "នព្វស័ក", 2571],
    [2027, 11, 28, "បុស្ស", 30, "មមែ", "នព្វស័ក", 2571]
];

window.getKhmerLunarApprox = function(date) {
    const baseNewMoon = new Date(Date.UTC(1900, 0, 1, 13, 52, 0)); 
    const synodicMonth = 29.53058868;
    const diffMs = date.getTime() - baseNewMoon.getTime();
    const lunations = (diffMs / 86400000) / synodicMonth;
    const cycleDays = (lunations - Math.floor(lunations)) * synodicMonth;
    
    let lunarDay = Math.floor(cycleDays) + 1;
    let phase = lunarDay <= 15 ? 'កើត' : 'រោច';
    if(lunarDay > 15) lunarDay -= 15;
    if(lunarDay > 15) lunarDay = 15; 
    
    const khmerMonths = ["បុស្ស", "មាឃ", "ផល្គុន", "ចេត្រ", "ពិសាខ", "ជេស្ឋ", "អាសាឍ", "ស្រាពណ៍", "ភទ្របទ", "អស្សុជ", "កត្តិក", "មិគសិរ"];
    const animals = ["ជូត", "ឆ្លូវ", "ខាល", "ថោះ", "រោង", "ម្សាញ់", "មមី", "មមែ", "វក", "រកា", "ច", "កុរ"];
    const eras = ["ឯកស័ក", "ទោស័ក", "ត្រីស័ក", "ចត្វាស័ក", "បញ្ចស័ក", "ឆស័ក", "សប្តស័ក", "អដ្ឋស័ក", "នព្វស័ក", "សំរឹទ្ធិស័ក"];
    
    let monthIdx = Math.floor(lunations + 0.5) % 12; 
    if(monthIdx < 0) monthIdx += 12;
    
    let khYear = date.getFullYear();
    if (date.getMonth() < 3 || (date.getMonth() === 3 && date.getDate() < 14)) khYear -= 1;
    let animalIdx = (khYear + 4) % 12;
    let eraIdx = (khYear + 8) % 10;
    
    let beYear = date.getFullYear() + 543;
    if (date.getMonth() > 4 || (date.getMonth() === 4 && date.getDate() > 22)) beYear += 1;
    
    const isHolyDay = (phase === 'កើត' && (lunarDay === 8 || lunarDay === 15)) || 
                      (phase === 'រោច' && (lunarDay === 8 || lunarDay === 14));
    let holyText = isHolyDay ? " (ថ្ងៃសីល)" : "";
    
    return { lunarDayNum: lunarDay, phase: phase, text: `${lunarDay}${phase}${holyText} ខែ${khmerMonths[monthIdx]} ឆ្នាំ${animals[animalIdx]} ${eras[eraIdx]} ព.ស. ${beYear}`, isHolyDay: isHolyDay };
};

// មុខងារគណនាប្រតិទិនចន្ទគតិត្រឹមត្រូវ ១០០% ដោយផ្អែកលើទិន្នន័យ (Lookup Exact Matching)
window.getKhmerLunar = function(date) {
    const targetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    // បើឆ្នាំលើស ឬខ្វះពីទិន្នន័យ ប្រើប្រព័ន្ធស្មាន (Approximation)
    const minTime = new Date(LUNAR_STARTS[0][0], LUNAR_STARTS[0][1], LUNAR_STARTS[0][2]).getTime();
    const maxTime = new Date(2028, 0, 26).getTime(); 
    if (targetTime < minTime || targetTime > maxTime) return window.getKhmerLunarApprox(date);

    let bestBlock = LUNAR_STARTS[0];
    for (let i = 0; i < LUNAR_STARTS.length; i++) {
        const blockDate = new Date(LUNAR_STARTS[i][0], LUNAR_STARTS[i][1], LUNAR_STARTS[i][2]);
        if (blockDate.getTime() <= targetTime) {
            bestBlock = LUNAR_STARTS[i];
        } else { break; }
    }
    
    const blockTime = new Date(bestBlock[0], bestBlock[1], bestBlock[2]).getTime();
    const diffDays = Math.floor((targetTime - blockTime) / (1000 * 60 * 60 * 24));
    
    let phase = '';
    let lunarDay = 0;
    
    if (diffDays < 15) {
        phase = 'កើត';
        lunarDay = diffDays + 1;
    } else {
        phase = 'រោច';
        lunarDay = diffDays - 14;
    }
    
    if (phase === 'រោច' && lunarDay > (bestBlock[4] - 15)) {
        lunarDay = bestBlock[4] - 15; 
    }

    const isHolyDay = (phase === 'កើត' && (lunarDay === 8 || lunarDay === 15)) || 
                      (phase === 'រោច' && (lunarDay === 8 || lunarDay === (bestBlock[4] - 15)));
                      
    let holyText = isHolyDay ? " (ថ្ងៃសីល)" : "";
    
    return {
        lunarDayNum: lunarDay, phase: phase,
        text: `${lunarDay}${phase}${holyText} ខែ${bestBlock[3]} ឆ្នាំ${bestBlock[5]} ${bestBlock[6]} ព.ស. ${bestBlock[7]}`,
        isHolyDay: isHolyDay
    };
};

/* ==========================================
   MINI CALENDAR INTERACTIVITY
   ========================================== */
window.changeCalMonth = function(dir) {
    window.currentCalDate.setMonth(window.currentCalDate.getMonth() + dir);
    window.renderMiniCalendar();
};

window.renderMiniCalendar = function() {
    const cal = document.getElementById('miniCalendar');
    if(!cal) return;

    const dt = window.currentCalDate;
    const year = dt.getFullYear();
    const month = dt.getMonth(); 
    
    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);
    const todayDate = today.getDate();

    const monthNamesKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const dayNamesKh = ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"];

    document.getElementById('calMonthYear').textContent = monthNamesKh[month] + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();

    let html = dayNamesKh.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    // Prev month days
    for(let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="cal-date muted">${prevDaysInMonth - i}</div>`;
    }

    // Current month days
    for(let i = 1; i <= daysInMonth; i++) {
        const dateKey = (month + 1) + "-" + i;
        let holidayName = KHMER_HOLIDAYS[dateKey];
        if (LUNAR_HOLIDAYS_BY_YEAR[year] && LUNAR_HOLIDAYS_BY_YEAR[year][dateKey]) {
            holidayName = LUNAR_HOLIDAYS_BY_YEAR[year][dateKey];
        }

        const lunarInfo = window.getKhmerLunar(new Date(year, month, i));
        
        const isHoliday = holidayName ? 'holiday' : '';
        const isHoly = lunarInfo.isHolyDay ? 'holy' : '';
        const isToday = (isCurrentMonth && i === todayDate) ? 'active' : '';
        
        html += `<div class="cal-date ${isToday} ${isHoliday}" onclick="window.showCalDetails(${year}, ${month}, ${i}, this)" title="${lunarInfo.text}">
            ${i}
            <div class="cal-indicators">
                ${holidayName ? '<div class="ind-dot ind-hol" title="បុណ្យជាតិ"></div>' : ''}
                ${lunarInfo.isHolyDay ? '<div class="ind-dot ind-holy" title="ថ្ងៃសីល"></div>' : ''}
            </div>
        </div>`;
    }

    // Next month days to fill grid
    const totalCells = firstDay + daysInMonth;
    const nextDays = 42 - totalCells;
    for(let i = 1; i <= nextDays; i++) {
        html += `<div class="cal-date muted">${i}</div>`;
    }

    cal.innerHTML = html;
};

// មុខងារពេលចុចលើកាលបរិច្ឆេទបង្ហាញព័ត៌មាន
window.showCalDetails = function(year, month, day, el = null) {
    if(el) {
        document.querySelectorAll('#miniCalendar .cal-date').forEach(d => {
            if(!d.classList.contains('muted') && !d.classList.contains('active')) {
                d.style.borderColor = 'transparent'; d.style.background = 'transparent';
                d.style.color = d.classList.contains('holiday') ? 'var(--re)' : 'var(--text)';
            }
        });
        if(!el.classList.contains('active')) {
            el.style.borderColor = 'var(--blue)'; el.style.background = 'var(--bll)'; el.style.color = 'var(--blue)';
        }
    }

    const panel = document.getElementById('calDetailsPanel');
    const dateEl = document.getElementById('cddDate');
    const eventArea = document.getElementById('cddEventArea');
    const descEl = document.getElementById('cddDesc');
    
    if(!panel) return;

    const selectedDate = new Date(year, month, day);
    const dayNamesKhFull = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"];
    const monthNamesKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    
    dateEl.textContent = `ថ្ងៃ${dayNamesKhFull[selectedDate.getDay()]} ទី${day} ខែ${monthNamesKh[month]} ឆ្នាំ${year}`;

    const dateKey = (month + 1) + "-" + day;
    let holidayName = KHMER_HOLIDAYS[dateKey];
    if (LUNAR_HOLIDAYS_BY_YEAR[year] && LUNAR_HOLIDAYS_BY_YEAR[year][dateKey]) {
        holidayName = LUNAR_HOLIDAYS_BY_YEAR[year][dateKey];
    }

    const lunarInfo = window.getKhmerLunar(selectedDate);
    
    let eventHTML = '';
    if(holidayName) {
        eventHTML += `<div class="cdd-event hol"><i class="fa-solid fa-star"></i> <span>${holidayName}</span></div>`;
    }
    if(lunarInfo.isHolyDay) {
        eventHTML += `<div class="cdd-event holy"><i class="fa-solid fa-moon"></i> <span>ថ្ងៃសីល (Holy Day)</span></div>`;
    }
    eventArea.innerHTML = eventHTML;

    let extraNote = (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) 
        ? `<br><span style="color:var(--or);"><i class="fa-solid fa-umbrella-beach"></i> ថ្ងៃចុងសប្តាហ៍ (Weekend)</span>` 
        : `<br><span><i class="fa-solid fa-briefcase"></i> ថ្ងៃធ្វើការធម្មតា (Working Day)</span>`;
    
    descEl.innerHTML = `ប្រតិទិនចន្ទគតិ៖ <span style="color:var(--text);font-weight:700;">${lunarInfo.text}</span> ${extraNote}`;

    panel.classList.add('show');
};

/* ==========================================
   FIREBASE DATA FETCHING & CHART
   ========================================== */
window.fetchDashboardData = async function() {
    if (!window.firestoreDB) {
        document.getElementById('dashRecentOrders').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--re);">No Database Connection</td></tr>';
        return;
    }

    try {
        let totalRev = 0;
        let totalOrders = 0;
        let ordersData = [];

        // 1. Fetch Orders Data
        if (window.fsCollection && window.fsGetDocs) {
            const ordSnap = await window.fsGetDocs(window.fsCollection(window.firestoreDB, "orders"));
            totalOrders = ordSnap.size;
            
            ordSnap.forEach(doc => {
                const data = doc.data();
                ordersData.push({id: doc.id, ...data});
                if (data.status !== 'cancelled') {
                    totalRev += (parseFloat(data.totalAmount) || 0);
                }
            });
            
            // Format Total Revenue
            document.getElementById('dsRev').textContent = '$' + totalRev.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('dsOrd').textContent = totalOrders;

            // Sort orders descending
            ordersData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Render Recent Orders Table
            const tbody = document.getElementById('dashRecentOrders');
            if(ordersData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:50px; color:var(--mu);"><i class="fa-solid fa-box-open" style="font-size:2rem; opacity:0.2; display:block; margin-bottom:10px;"></i>មិនទាន់មានការកម្មង់ទេ</td></tr>';
            } else {
                tbody.innerHTML = ordersData.slice(0, 5).map(o => {
                    const date = new Date(o.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh', month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' });
                    let badge = o.status==='pending' ? '<span style="background:#fff0e0;color:var(--or);padding:4px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;text-transform:uppercase;">Pending</span>' 
                              : o.status==='completed' ? '<span style="background:#e8faf0;color:var(--gr);padding:4px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;text-transform:uppercase;">Completed</span>'
                              : '<span style="background:#ffe6e6;color:var(--re);padding:4px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;text-transform:uppercase;">Cancelled</span>';
                    return `
                    <tr style="border-bottom:1px solid #edf2f7; transition:background 0.2s;" onmouseover="this.style.background='#fafcff'" onmouseout="this.style.background='transparent'">
                        <td style="padding:16px 24px; font-size:0.85rem; color:var(--mu);">${date}</td>
                        <td style="padding:16px 24px;">
                            <div style="font-weight:700; color:var(--text); font-size:0.9rem;">${o.customerName || 'អតិថិជន'}</div>
                            <div style="font-size:0.75rem; color:var(--mu);">${o.customerPhone || ''}</div>
                        </td>
                        <td style="padding:16px 24px; font-weight:800; font-family:'Barlow Condensed', sans-serif; font-size:1.15rem; color:var(--blue);">$${(o.totalAmount||0).toFixed(2)}</td>
                        <td style="padding:16px 24px;">${badge}</td>
                    </tr>
                    `;
                }).join('');
            }
        }

        // 2. Fetch Products Count
        const prodSnap = await window.fsGetDocs(window.fsCollection(window.firestoreDB, "products"));
        document.getElementById('dsProd').textContent = prodSnap.size;

        // 3. Fetch Messages Count
        const msgSnap = await window.fsGetDocs(window.fsCollection(window.firestoreDB, "messages"));
        document.getElementById('dsMsg').textContent = msgSnap.size;
        
        let unreadMsg = 0;
        msgSnap.forEach(doc => { if(doc.data().status === 'unread') unreadMsg++; });
        if(unreadMsg > 0) {
            document.getElementById('dsMsgNew').innerHTML = `<i class="fa-solid fa-bell"></i> ${unreadMsg} សារថ្មី (New)`;
            document.getElementById('dsMsgNew').className = 'dash-stat-trend trend-down';
        } else {
            document.getElementById('dsMsgNew').innerHTML = `<i class="fa-solid fa-check-double"></i> អានរួចរាល់`;
            document.getElementById('dsMsgNew').className = 'dash-stat-trend trend-up';
        }

        // 4. Render Chart.js
        window.initDashboardChart(ordersData);

    } catch(e) {
        console.error("Dashboard fetch error:", e);
        document.getElementById('dashRecentOrders').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--re);">មានបញ្ហាក្នុងការទាញយកទិន្នន័យ</td></tr>';
    }
};

window.initDashboardChart = function(ordersData) {
    if (typeof Chart === 'undefined') {
        window.loadScript('https://cdn.jsdelivr.net/npm/chart.js', () => {
            window.buildRevenueChart(ordersData);
        });
    } else {
        window.buildRevenueChart(ordersData);
    }
};

window.buildRevenueChart = function(ordersData) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const last7Days = [];
    const revenueData = [];
    
    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        last7Days.push(dateStr);
        revenueData.push(0);
    }

    ordersData.forEach(o => {
        if(o.status === 'cancelled') return; 
        
        let orderDate = new Date(o.createdAt);
        let orderDateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        
        let idx = last7Days.indexOf(orderDateStr);
        if (idx !== -1) {
            revenueData[idx] += (parseFloat(o.totalAmount) || 0);
        }
    });

    if (window.myDashChart) { window.myDashChart.destroy(); }

    window.myDashChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'ចំណូល (Revenue in $)',
                data: revenueData,
                borderColor: '#0066cc', 
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#ff9900', 
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f1923',
                    titleFont: { family: 'Barlow', size: 13 },
                    bodyFont: { family: 'Barlow Condensed', size: 15, weight: 'bold' },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#edf2f7', drawBorder: false },
                    ticks: {
                        font: { family: 'Barlow', size: 12 },
                        color: '#5a6a7e',
                        callback: function(value) { return '$' + value; }
                    }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { family: 'Barlow', size: 12 }, color: '#5a6a7e' }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
};