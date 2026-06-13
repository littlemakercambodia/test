'use strict';

window.initERP = function() {
  const container = document.getElementById('sa-erp');
  if (!container) return;

  container.innerHTML = `
    <div class="tc" style="margin-bottom: 20px;">
      <div class="tc-head" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="tc-title"><i class="fa-solid fa-toolbox" style="color:var(--or); margin-right:8px;"></i>Company ERP & Tools</div>
      </div>
      
      <!-- ERP Sub Navigation -->
      <div style="padding: 0 24px; border-bottom: 1px solid var(--bd); background: #f8fafc;">
        <div style="display:flex; gap:20px; overflow-x:auto;">
          <button class="erp-tab active" onclick="switchERPTab('dashboard', this)" style="padding:14px 0; border:none; background:transparent; font-weight:700; color:var(--blue); border-bottom:3px solid var(--blue); cursor:pointer;"><i class="fa-solid fa-chart-pie"></i> Dashboard</button>
          <button class="erp-tab" onclick="switchERPTab('invoices', this)" style="padding:14px 0; border:none; background:transparent; font-weight:600; color:var(--mu); cursor:pointer;"><i class="fa-solid fa-file-invoice-dollar"></i> Invoices</button>
          <button class="erp-tab" onclick="switchERPTab('quotes', this)" style="padding:14px 0; border:none; background:transparent; font-weight:600; color:var(--mu); cursor:pointer;"><i class="fa-solid fa-file-contract"></i> Quotations</button>
          <button class="erp-tab" onclick="switchERPTab('finance', this)" style="padding:14px 0; border:none; background:transparent; font-weight:600; color:var(--mu); cursor:pointer;"><i class="fa-solid fa-chart-line"></i> Finance</button>
          <button class="erp-tab" onclick="switchERPTab('inventory', this)" style="padding:14px 0; border:none; background:transparent; font-weight:600; color:var(--mu); cursor:pointer;"><i class="fa-solid fa-boxes-stacked"></i> Inventory</button>
        </div>
      </div>

      <!-- Tab Contents -->
      <div id="erp-dashboard" class="erp-panel active" style="padding: 24px;">
        <p style="color:var(--mu); font-size:0.9rem; margin-bottom:20px;">Welcome to the Company ERP Dashboard. Access quick tools and track tasks.</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <!-- CALCULATOR WIDGET -->
          <div class="tc" style="border:1px solid var(--bd); border-radius:12px; overflow:hidden;">
            <div class="tc-head" style="background:var(--bg); border-bottom:1px solid var(--bd);">
              <div class="tc-title" style="font-size:0.85rem;"><i class="fa-solid fa-calculator" style="color:var(--blue); margin-right:6px;"></i> Quick Calculator</div>
            </div>
            <div style="padding:16px;">
              <input type="text" id="calcDisplay" readonly style="width:100%; text-align:right; font-size:1.5rem; font-weight:700; padding:10px; border:1px solid var(--bd); border-radius:8px; margin-bottom:10px; font-family:monospace; background:#f8fafc; color:var(--dk);">
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;">
                <button class="calc-btn btn bo" onclick="calcInput('7')">7</button>
                <button class="calc-btn btn bo" onclick="calcInput('8')">8</button>
                <button class="calc-btn btn bo" onclick="calcInput('9')">9</button>
                <button class="calc-btn btn bp" onclick="calcOp('/')">÷</button>
                
                <button class="calc-btn btn bo" onclick="calcInput('4')">4</button>
                <button class="calc-btn btn bo" onclick="calcInput('5')">5</button>
                <button class="calc-btn btn bo" onclick="calcInput('6')">6</button>
                <button class="calc-btn btn bp" onclick="calcOp('*')">×</button>
                
                <button class="calc-btn btn bo" onclick="calcInput('1')">1</button>
                <button class="calc-btn btn bo" onclick="calcInput('2')">2</button>
                <button class="calc-btn btn bo" onclick="calcInput('3')">3</button>
                <button class="calc-btn btn bp" onclick="calcOp('-')">-</button>
                
                <button class="calc-btn btn bo" onclick="calcInput('0')">0</button>
                <button class="calc-btn btn bo" onclick="calcInput('.')">.</button>
                <button class="calc-btn btn bs" onclick="calcResult()">=</button>
                <button class="calc-btn btn bp" onclick="calcOp('+')">+</button>
                
                <button class="calc-btn btn bd2" style="grid-column:1/-1" onclick="calcClear()">Clear</button>
              </div>
            </div>
          </div>

          <!-- TO-DO WIDGET -->
          <div class="tc" style="border:1px solid var(--bd); border-radius:12px; overflow:hidden;">
            <div class="tc-head" style="background:var(--bg); border-bottom:1px solid var(--bd);">
              <div class="tc-title" style="font-size:0.85rem;"><i class="fa-solid fa-list-check" style="color:var(--gr); margin-right:6px;"></i> Daily Tasks (To-Do)</div>
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; height:320px;">
              <div style="display:flex; gap:8px; margin-bottom:12px;">
                <input type="text" id="todoInput" placeholder="Add a new task..." style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:8px; outline:none; font-size:0.85rem;" onkeydown="if(event.key==='Enter') window.addTodo()">
                <button class="btn bp" onclick="window.addTodo()"><i class="fa-solid fa-plus"></i></button>
              </div>
              <div id="todoList" style="flex:1; overflow-y:auto; padding-right:4px; display:flex; flex-direction:column; gap:6px;">
                <!-- Todos go here -->
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- INVOICES PANEL -->
      <div id="erp-invoices" class="erp-panel" style="display:none; padding: 24px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
            <h3 style="margin:0; color:var(--blue);"><i class="fa-solid fa-file-invoice-dollar"></i> Invoice Management</h3>
            <button class="btn bp" onclick="openInvoiceModal()"><i class="fa-solid fa-plus"></i> Create New Invoice</button>
        </div>
        <div id="erp-invoices-list" style="display:grid; gap:12px;">
            <!-- Invoice List Rendered Here -->
        </div>
      </div>

      <!-- QUOTES PANEL -->
      <div id="erp-quotes" class="erp-panel" style="display:none; padding: 24px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
            <h3 style="margin:0; color:var(--blue);"><i class="fa-solid fa-file-contract"></i> Quotation Management</h3>
            <button class="btn bp" onclick="openQuoteModal()"><i class="fa-solid fa-plus"></i> Create New Quote</button>
        </div>
        <div id="erp-quotes-list" style="display:grid; gap:12px;">
            <!-- Quote List Rendered Here -->
        </div>
      </div>

      <!-- FINANCE PANEL -->
      <div id="erp-finance" class="erp-panel" style="display:none; padding: 24px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
            <h3 style="margin:0; color:var(--blue);"><i class="fa-solid fa-chart-line"></i> Financial Tracker</h3>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--bd); text-align:center;">
                <span style="display:block; color:var(--mu); font-size:0.85rem; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Total Income</span>
                <strong id="fin-total-income" style="font-size:1.8rem; color:var(--gr);">$0.00</strong>
            </div>
            <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--bd); text-align:center;">
                <span style="display:block; color:var(--mu); font-size:0.85rem; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Total Expenses</span>
                <strong id="fin-total-expense" style="font-size:1.8rem; color:var(--re);">$0.00</strong>
            </div>
            <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid var(--bd); text-align:center;">
                <span style="display:block; color:var(--mu); font-size:0.85rem; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Net Profit</span>
                <strong id="fin-net-profit" style="font-size:1.8rem; color:var(--blue);">$0.00</strong>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 2fr; gap: 24px;">
            <!-- ADD RECORD FORM -->
            <div class="tc" style="background:#fff; padding:20px; border:1px solid var(--bd); border-radius:12px; height:fit-content;">
                <strong style="display:block; margin-bottom:16px; color:var(--blue);">Add Transaction</strong>
                
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Type</label>
                    <select id="fin-type" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Date</label>
                    <input type="date" id="fin-date" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Description</label>
                    <input type="text" id="fin-desc" placeholder="e.g. Sold Cabinet / Paid Electricity" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Amount ($)</label>
                    <input type="number" id="fin-amount" min="0" step="0.01" placeholder="0.00" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                
                <button class="btn bp" style="width:100%; justify-content:center;" onclick="saveFinanceRecord()"><i class="fa-solid fa-plus"></i> Add Record</button>
            </div>

            <!-- RECORDS LIST -->
            <div class="tc" style="background:#fff; padding:20px; border:1px solid var(--bd); border-radius:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <strong style="color:var(--blue);">Recent Transactions</strong>
                    <div style="display:flex; gap:8px;">
                        <button class="btn bo" onclick="filterFinance('all')" style="padding:4px 8px; font-size:0.8rem;">All</button>
                        <button class="btn bo" onclick="filterFinance('income')" style="padding:4px 8px; font-size:0.8rem;">Income</button>
                        <button class="btn bo" onclick="filterFinance('expense')" style="padding:4px 8px; font-size:0.8rem;">Expense</button>
                    </div>
                </div>
                
                <div id="erp-finance-list" style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto; padding-right:6px;">
                    <!-- Records Rendered Here -->
                </div>
            </div>
        </div>
      </div>

      <!-- INVENTORY PANEL -->
      <div id="erp-inventory" class="erp-panel" style="display:none; padding: 24px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
            <h3 style="margin:0; color:var(--blue);"><i class="fa-solid fa-boxes-stacked"></i> Inventory Management</h3>
            <button class="btn bp" onclick="document.getElementById('mo-inv-item').classList.add('open')"><i class="fa-solid fa-plus"></i> Add New Item</button>
        </div>

        <div class="tc" style="background:#fff; padding:20px; border:1px solid var(--bd); border-radius:12px;">
            <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead>
                    <tr style="border-bottom:2px solid var(--bd);">
                        <th style="padding:12px 8px; font-weight:600; color:var(--mu);">SKU / ID</th>
                        <th style="padding:12px 8px; font-weight:600; color:var(--mu);">Product Name</th>
                        <th style="padding:12px 8px; font-weight:600; color:var(--mu);">Category</th>
                        <th style="padding:12px 8px; font-weight:600; color:var(--mu);">Stock Qty</th>
                        <th style="padding:12px 8px; font-weight:600; color:var(--mu);">Status</th>
                        <th style="padding:12px 8px; width:80px;"></th>
                    </tr>
                </thead>
                <tbody id="erp-inv-list">
                    <!-- Inventory items rendered here -->
                </tbody>
            </table>
        </div>
      </div>

    </div>
    
    <!-- ADD INVENTORY ITEM MODAL -->
    <div class="mo" id="mo-inv-item">
      <div class="md" style="max-width:500px;">
        <div class="mh">
          <h3><i class="fa-solid fa-box-open"></i> Add/Edit Inventory Item</h3>
          <button class="close-btn" onclick="document.getElementById('mo-inv-item').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mc" style="background:#f8fafc; padding:20px;">
            <input type="hidden" id="inv-item-id">
            
            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">SKU / Product Code</label>
                <input type="text" id="inv-item-sku" placeholder="e.g. CAB-001" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
            </div>
            
            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Product Name</label>
                <input type="text" id="inv-item-name" placeholder="e.g. 7-Drawer Tool Cabinet" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
            </div>
            
            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Category</label>
                <select id="inv-item-cat" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    <option value="Tools & Cabinets">Tools & Cabinets</option>
                    <option value="BBQ Grills">BBQ Grills</option>
                    <option value="Office Furniture">Office Furniture</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            
            <div style="display:flex; gap:16px; margin-bottom:20px;">
                <div style="flex:1;">
                    <label style="display:block; font-size:0.8rem; color:var(--mu); font-weight:700; margin-bottom:4px;">Current Stock</label>
                    <input type="number" id="inv-item-qty" min="0" value="0" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-size:0.8rem; color:var(--re); font-weight:700; margin-bottom:4px;">Low Stock Alert At</label>
                    <input type="number" id="inv-item-min" min="0" value="5" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
            </div>
            
            <button class="btn bp" style="width:100%; justify-content:center;" onclick="saveInventoryItem()"><i class="fa-solid fa-save"></i> Save Item</button>
        </div>
      </div>
    </div>
    
    <!-- QUOTATION BUILDER MODAL -->
    <div class="mo" id="mo-quote-builder">
      <div class="md" style="max-width:900px;">
        <div class="mh">
          <h3 id="quo-modal-title"><i class="fa-solid fa-file-contract"></i> Create Quotation</h3>
          <button class="close-btn" onclick="document.getElementById('mo-quote-builder').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mc" style="background:#f8fafc; padding:20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
                <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                    <strong style="display:block; margin-bottom:10px; color:var(--blue);">Prepared For (Client Info)</strong>
                    <input type="text" id="quo-client-name" placeholder="Client Name / Company" style="width:100%; padding:8px 12px; margin-bottom:8px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    <textarea id="quo-client-address" placeholder="Address" rows="2" style="width:100%; padding:8px 12px; margin-bottom:8px; border:1px solid var(--bd); border-radius:6px; outline:none; resize:vertical;"></textarea>
                    <input type="text" id="quo-client-phone" placeholder="Phone / Email" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                    <strong style="display:block; margin-bottom:10px; color:var(--blue);">Quotation Details</strong>
                    <div style="display:flex; gap:10px; margin-bottom:8px;">
                        <input type="text" id="quo-number" placeholder="Quote # (e.g. QUO-2026-001)" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom:8px;">
                        <input type="date" id="quo-date" title="Quote Date" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                        <input type="text" id="quo-validity" placeholder="Valid for (e.g., 30 Days)" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    </div>
                </div>
            </div>

            <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                <strong style="display:block; margin-bottom:10px; color:var(--blue);">Scope of Work / Items</strong>
                <table style="width:100%; border-collapse:collapse; margin-bottom:12px; text-align:left;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--bd);">
                            <th style="padding:8px; font-weight:600; color:var(--mu);">Description</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:80px;">Qty</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:120px;">Price ($)</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:120px; text-align:right;">Total</th>
                            <th style="width:40px;"></th>
                        </tr>
                    </thead>
                    <tbody id="quo-items-body">
                        <!-- Items rendered here -->
                    </tbody>
                </table>
                <button class="btn bo" onclick="addQuoteItem()"><i class="fa-solid fa-plus"></i> Add Item</button>
                
                <div style="margin-top:20px; border-top:1px solid var(--bd); padding-top:16px; display:flex; justify-content:space-between;">
                    <div style="flex:1; margin-right:40px;">
                        <strong style="display:block; margin-bottom:5px; color:var(--mu); font-size:0.8rem;">Terms & Conditions</strong>
                        <textarea id="quo-terms" placeholder="Enter terms and conditions here..." style="width:100%; height:80px; padding:8px; border:1px solid var(--bd); border-radius:6px; resize:vertical; font-size:0.85rem; color:var(--mu);">Prices are valid for the stated period. 50% deposit required to commence work.</textarea>
                    </div>
                    <div style="width:300px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--mu);"><span>Subtotal:</span> <strong id="quo-subtotal">$0.00</strong></div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--mu); align-items:center;">
                            <span>Discount:</span> 
                            <input type="number" id="quo-discount" value="0" min="0" step="1" oninput="calcQuoteTotal()" style="width:80px; padding:4px 8px; border:1px solid var(--bd); border-radius:4px; text-align:right;">
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:1.2rem; color:var(--dk);"><span>Total:</span> <strong id="quo-total" style="color:var(--gr);">$0.00</strong></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mf">
            <button class="btn bo" onclick="printQuote()"><i class="fa-solid fa-print"></i> Print PDF</button>
            <button class="btn bp" onclick="saveQuote()"><i class="fa-solid fa-save"></i> Save Quotation</button>
        </div>
      </div>
    </div>
    
    <!-- INVOICE BUILDER MODAL -->
    <div class="mo" id="mo-invoice-builder">
      <div class="md" style="max-width:900px;">
        <div class="mh">
          <h3 id="inv-modal-title"><i class="fa-solid fa-file-invoice"></i> Create Invoice</h3>
          <button class="close-btn" onclick="document.getElementById('mo-invoice-builder').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="mc" style="background:#f8fafc; padding:20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
                <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                    <strong style="display:block; margin-bottom:10px; color:var(--blue);">Bill To (Client Info)</strong>
                    <input type="text" id="inv-client-name" placeholder="Client Name / Company" style="width:100%; padding:8px 12px; margin-bottom:8px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    <textarea id="inv-client-address" placeholder="Address" rows="2" style="width:100%; padding:8px 12px; margin-bottom:8px; border:1px solid var(--bd); border-radius:6px; outline:none; resize:vertical;"></textarea>
                    <input type="text" id="inv-client-phone" placeholder="Phone / Email" style="width:100%; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                </div>
                <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                    <strong style="display:block; margin-bottom:10px; color:var(--blue);">Invoice Details</strong>
                    <div style="display:flex; gap:10px; margin-bottom:8px;">
                        <input type="text" id="inv-number" placeholder="Invoice # (e.g. INV-2026-001)" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom:8px;">
                        <input type="date" id="inv-date" title="Invoice Date" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                        <input type="date" id="inv-due-date" title="Due Date" style="flex:1; padding:8px 12px; border:1px solid var(--bd); border-radius:6px; outline:none;">
                    </div>
                </div>
            </div>

            <div class="tc" style="background:#fff; padding:16px; border:1px solid var(--bd); border-radius:12px;">
                <strong style="display:block; margin-bottom:10px; color:var(--blue);">Items</strong>
                <table style="width:100%; border-collapse:collapse; margin-bottom:12px; text-align:left;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--bd);">
                            <th style="padding:8px; font-weight:600; color:var(--mu);">Description</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:80px;">Qty</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:120px;">Price ($)</th>
                            <th style="padding:8px; font-weight:600; color:var(--mu); width:120px; text-align:right;">Total</th>
                            <th style="width:40px;"></th>
                        </tr>
                    </thead>
                    <tbody id="inv-items-body">
                        <!-- Items rendered here -->
                    </tbody>
                </table>
                <button class="btn bo" onclick="addInvoiceItem()"><i class="fa-solid fa-plus"></i> Add Item</button>
                
                <div style="margin-top:20px; border-top:1px solid var(--bd); padding-top:16px; display:flex; justify-content:flex-end;">
                    <div style="width:300px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--mu);"><span>Subtotal:</span> <strong id="inv-subtotal">$0.00</strong></div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--mu); align-items:center;">
                            <span>Discount:</span> 
                            <input type="number" id="inv-discount" value="0" min="0" step="1" oninput="calcInvoiceTotal()" style="width:80px; padding:4px 8px; border:1px solid var(--bd); border-radius:4px; text-align:right;">
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:1.2rem; color:var(--dk);"><span>Total:</span> <strong id="inv-total" style="color:var(--gr);">$0.00</strong></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mf">
            <button class="btn bo" onclick="printInvoice()"><i class="fa-solid fa-print"></i> Print PDF</button>
            <button class="btn bp" onclick="saveInvoice()"><i class="fa-solid fa-save"></i> Save Invoice</button>
        </div>
      </div>
    </div>
  `;

  // Render initial todos
  renderTodos();
  
  // Render initial ERP lists
  loadInvoices();
  loadQuotes();
  loadFinanceRecords();
  loadInventory();
};

// ==========================================
// ERP TABS LOGIC
// ==========================================
window.switchERPTab = function(tabId, btn) {
    document.querySelectorAll('.erp-tab').forEach(b => {
        b.classList.remove('active');
        b.style.color = 'var(--mu)';
        b.style.borderBottom = 'none';
        b.style.fontWeight = '600';
    });
    btn.classList.add('active');
    btn.style.color = 'var(--blue)';
    btn.style.borderBottom = '3px solid var(--blue)';
    btn.style.fontWeight = '700';

    document.querySelectorAll('.erp-panel').forEach(p => p.style.display = 'none');
    document.getElementById('erp-' + tabId).style.display = 'block';
};

// ==========================================
// INVOICE LOGIC
// ==========================================
let invoices = [];
let invItems = [];

window.openInvoiceModal = function() {
    document.getElementById('mo-invoice-builder').classList.add('open');
    invItems = [{ desc: '', qty: 1, price: 0 }];
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inv-date').value = today;
    document.getElementById('inv-due-date').value = today;
    document.getElementById('inv-number').value = 'INV-' + Date.now().toString().slice(-6);
    document.getElementById('inv-client-name').value = '';
    document.getElementById('inv-client-address').value = '';
    document.getElementById('inv-client-phone').value = '';
    document.getElementById('inv-discount').value = 0;
    
    renderInvoiceItems();
};

window.addInvoiceItem = function() {
    invItems.push({ desc: '', qty: 1, price: 0 });
    renderInvoiceItems();
};

window.removeInvoiceItem = function(index) {
    invItems.splice(index, 1);
    renderInvoiceItems();
};

window.updateInvoiceItem = function(index, field, value) {
    invItems[index][field] = value;
    calcInvoiceTotal();
};

window.renderInvoiceItems = function() {
    const tbody = document.getElementById('inv-items-body');
    tbody.innerHTML = '';
    invItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:4px;"><input type="text" placeholder="Item description" value="\${item.desc}" oninput="updateInvoiceItem(\${index}, 'desc', this.value)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px;"><input type="number" min="1" value="\${item.qty}" oninput="updateInvoiceItem(\${index}, 'qty', parseFloat(this.value)||0)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px;"><input type="number" min="0" step="0.01" value="\${item.price}" oninput="updateInvoiceItem(\${index}, 'price', parseFloat(this.value)||0)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px; text-align:right; font-weight:600;">$\${(item.qty * item.price).toFixed(2)}</td>
            <td style="padding:4px; text-align:center;"><button onclick="removeInvoiceItem(\${index})" style="background:transparent; border:none; color:var(--re); cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
    calcInvoiceTotal();
};

window.calcInvoiceTotal = function() {
    let subtotal = invItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const discount = parseFloat(document.getElementById('inv-discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('inv-subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('inv-total').innerText = '$' + total.toFixed(2);
};

window.saveInvoice = async function() {
    // Collect data
    const data = {
        id: document.getElementById('inv-number').value,
        client: document.getElementById('inv-client-name').value,
        address: document.getElementById('inv-client-address').value,
        phone: document.getElementById('inv-client-phone').value,
        date: document.getElementById('inv-date').value,
        dueDate: document.getElementById('inv-due-date').value,
        items: invItems,
        discount: parseFloat(document.getElementById('inv-discount').value) || 0,
        subtotal: invItems.reduce((sum, item) => sum + (item.qty * item.price), 0),
        total: Math.max(0, invItems.reduce((sum, item) => sum + (item.qty * item.price), 0) - (parseFloat(document.getElementById('inv-discount').value) || 0)),
        createdAt: Date.now()
    };
    
    if(!data.client || !data.id) {
        toast('Client Name and Invoice Number are required!', 'error');
        return;
    }
    
    try {
        await db.collection('lm_invoices').doc(data.id).set(data);
        toast('Invoice saved successfully!', 'success');
        document.getElementById('mo-invoice-builder').classList.remove('open');
        loadInvoices();
    } catch(err) {
        toast('Error saving invoice.', 'error');
        console.error(err);
    }
};

window.loadInvoices = async function() {
    const list = document.getElementById('erp-invoices-list');
    if(!list) return;
    
    try {
        const snap = await db.collection('lm_invoices').orderBy('createdAt', 'desc').get();
        invoices = snap.docs.map(d => d.data());
        
        if(invoices.length === 0) {
            list.innerHTML = '<div style="padding:20px; text-align:center; color:var(--mu); background:#f8fafc; border-radius:8px; border:1px dashed var(--bd);">No invoices created yet.</div>';
            return;
        }
        
        list.innerHTML = '';
        invoices.forEach(inv => {
            const item = document.createElement('div');
            item.style.cssText = 'padding:14px 18px; border:1px solid var(--bd); border-radius:10px; display:flex; justify-content:space-between; align-items:center; background:#fff;';
            item.innerHTML = `
                <div>
                    <strong style="display:block; font-size:1rem; color:var(--blue); margin-bottom:4px;">\${inv.id} - \${inv.client}</strong>
                    <span style="font-size:0.8rem; color:var(--mu); margin-right:12px;"><i class="fa-regular fa-calendar"></i> \${inv.date}</span>
                    <strong style="font-size:0.9rem; color:var(--gr);"><i class="fa-solid fa-dollar-sign"></i> \${inv.total.toFixed(2)}</strong>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn bo" onclick="printInvoiceData('\${inv.id}')"><i class="fa-solid fa-print"></i></button>
                    <button class="btn bo" style="color:var(--re); border-color:var(--re);" onclick="deleteInvoice('\${inv.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            list.appendChild(item);
        });
    } catch(err) {
        console.error("Error loading invoices", err);
    }
};

window.deleteInvoice = async function(id) {
    if(confirm('Are you sure you want to delete invoice ' + id + '?')) {
        try {
            await db.collection('lm_invoices').doc(id).delete();
            toast('Invoice deleted.', 'success');
            loadInvoices();
        } catch(err) {
            toast('Error deleting invoice.', 'error');
        }
    }
};

window.printInvoiceData = function(id) {
    const inv = invoices.find(i => i.id === id);
    if(inv) {
        // Load data into modal and print
        document.getElementById('inv-number').value = inv.id;
        document.getElementById('inv-client-name').value = inv.client;
        document.getElementById('inv-client-address').value = inv.address;
        document.getElementById('inv-client-phone').value = inv.phone;
        document.getElementById('inv-date').value = inv.date;
        document.getElementById('inv-due-date').value = inv.dueDate;
        document.getElementById('inv-discount').value = inv.discount;
        invItems = JSON.parse(JSON.stringify(inv.items));
        renderInvoiceItems();
        printInvoice();
    }
};

window.printInvoice = function() {
    // A simple print view by opening a new window
    const w = window.open('', '_blank');
    
    // Get values
    const num = document.getElementById('inv-number').value;
    const client = document.getElementById('inv-client-name').value;
    const address = document.getElementById('inv-client-address').value;
    const phone = document.getElementById('inv-client-phone').value;
    const date = document.getElementById('inv-date').value;
    const due = document.getElementById('inv-due-date').value;
    const subtotal = document.getElementById('inv-subtotal').innerText;
    const discount = document.getElementById('inv-discount').value;
    const total = document.getElementById('inv-total').innerText;
    
    let itemsHtml = '';
    invItems.forEach(item => {
        itemsHtml += `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #ddd;">\${item.desc}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:center;">\${item.qty}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">$\${item.price.toFixed(2)}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">$\${(item.qty * item.price).toFixed(2)}</td>
            </tr>
        `;
    });

    w.document.write(`
        <html>
        <head>
            <title>Invoice - \${num}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; padding: 40px; margin: 0 auto; max-width: 800px; }
                h1 { color: #004d99; margin:0 0 10px 0; }
                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #004d99; padding-bottom: 20px; margin-bottom: 30px; }
                .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; color:#555;}
                .totals { width: 300px; margin-left: auto; border-top: 2px solid #ddd; padding-top: 20px; }
                .totals-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .grand-total { font-size: 1.3em; font-weight: bold; color: #004d99; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>LITTLEMAKER CAMBODIA</h1>
                    <p style="margin:0; color:#666;">National Road 1, Svay Rieng, Cambodia</p>
                    <p style="margin:0; color:#666;">Phone: +855 12 345 678 | Email: info@littlemaker.com</p>
                </div>
                <div style="text-align:right;">
                    <h2 style="margin:0; color:#555; font-size:2em;">INVOICE</h2>
                    <p style="margin:5px 0 0 0;"><strong>Invoice #:</strong> \${num}</p>
                    <p style="margin:0;"><strong>Date:</strong> \${date}</p>
                    <p style="margin:0;"><strong>Due Date:</strong> \${due}</p>
                </div>
            </div>
            
            <div class="details">
                <div>
                    <h3 style="margin-top:0; color:#555; border-bottom:1px solid #ddd; padding-bottom:5px;">Bill To</h3>
                    <strong style="font-size:1.1em;">\${client}</strong>
                    <p style="margin:5px 0; white-space:pre-wrap;">\${address}</p>
                    <p style="margin:0;">\${phone}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align:center;">Qty</th>
                        <th style="text-align:right;">Unit Price</th>
                        <th style="text-align:right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    \${itemsHtml}
                </tbody>
            </table>
            
            <div class="totals">
                <div class="totals-row"><span>Subtotal:</span> <strong>\${subtotal}</strong></div>
                <div class="totals-row"><span>Discount:</span> <strong>$\${parseFloat(discount).toFixed(2)}</strong></div>
                <div class="totals-row grand-total" style="border-top:1px solid #ddd; padding-top:10px; margin-top:10px;">
                    <span>Total Due:</span> <span>\${total}</span>
                </div>
            </div>
            
            <div style="margin-top:60px; text-align:center; color:#888; font-size:0.9em; border-top:1px solid #eee; padding-top:20px;">
                Thank you for your business!
            </div>
        </body>
        </html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
};

// ==========================================
// CALCULATOR LOGIC
// ==========================================
let calcVal1 = '';
let calcVal2 = '';
let currentOp = null;
let resetDisp = false;

window.calcInput = function(num) {
  const disp = document.getElementById('calcDisplay');
  if (resetDisp) { disp.value = ''; resetDisp = false; }
  if (disp.value === '0' && num !== '.') disp.value = '';
  disp.value += num;
};

window.calcOp = function(op) {
  const disp = document.getElementById('calcDisplay');
  if (currentOp !== null) {
    calcResult();
  }
  calcVal1 = disp.value;
  currentOp = op;
  resetDisp = true;
};

window.calcResult = function() {
  const disp = document.getElementById('calcDisplay');
  calcVal2 = disp.value;
  if (!calcVal1 || !calcVal2 || !currentOp) return;
  
  let res = 0;
  const n1 = parseFloat(calcVal1);
  const n2 = parseFloat(calcVal2);
  
  switch(currentOp) {
    case '+': res = n1 + n2; break;
    case '-': res = n1 - n2; break;
    case '*': res = n1 * n2; break;
    case '/': res = n2 !== 0 ? n1 / n2 : 'Error'; break;
  }
  
  // Format to avoid long decimals
  if (typeof res === 'number') {
    res = Math.round(res * 100000000) / 100000000;
  }
  
  disp.value = res;
  calcVal1 = res;
  currentOp = null;
  resetDisp = true;
};

window.calcClear = function() {
  calcVal1 = ''; calcVal2 = ''; currentOp = null;
  document.getElementById('calcDisplay').value = '';
};


// ==========================================
// TO-DO LIST LOGIC
// ==========================================
let todos = JSON.parse(localStorage.getItem('lm_erp_todos') || '[]');

function saveTodos() {
  localStorage.setItem('lm_erp_todos', JSON.stringify(todos));
}

window.renderTodos = function() {
  const list = document.getElementById('todoList');
  if (!list) return;
  
  list.innerHTML = '';
  if (todos.length === 0) {
    list.innerHTML = '<div style="text-align:center; color:var(--mu); padding:20px; font-size:0.8rem;">No tasks added yet.</div>';
    return;
  }

  todos.forEach((task, index) => {
    const isDone = task.done;
    const item = document.createElement('div');
    item.style.cssText = `display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:${isDone ? '#f8fafc' : '#fff'}; border:1px solid var(--bd); border-radius:8px; transition:all 0.2s;`;
    
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; flex:1; overflow:hidden;">
        <input type="checkbox" \${isDone ? 'checked' : ''} onchange="window.toggleTodo(\${index})" style="cursor:pointer; width:16px; height:16px; flex-shrink:0;">
        <span style="font-size:0.85rem; color:\${isDone ? 'var(--mu)' : 'var(--text)'}; text-decoration:\${isDone ? 'line-through' : 'none'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${escapeHtml(task.text)}</span>
      </div>
      <button onclick="window.deleteTodo(\${index})" style="background:transparent; border:none; color:var(--re); cursor:pointer; padding:4px; font-size:0.8rem; opacity:0.6; transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6"><i class="fa-solid fa-trash"></i></button>
    `;
    list.appendChild(item);
  });
};

window.addTodo = function() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;
  
  todos.unshift({ text, done: false });
  saveTodos();
  input.value = '';
  renderTodos();
};

window.toggleTodo = function(index) {
  if (todos[index]) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
  }
};

window.deleteTodo = function(index) {
  if (todos[index]) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
};

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// ==========================================
// QUOTATION LOGIC
// ==========================================
let quotes = [];
let quoItems = [];

window.openQuoteModal = function() {
    document.getElementById('mo-quote-builder').classList.add('open');
    quoItems = [{ desc: '', qty: 1, price: 0 }];
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quo-date').value = today;
    document.getElementById('quo-validity').value = '30 Days';
    document.getElementById('quo-number').value = 'QUO-' + Date.now().toString().slice(-6);
    document.getElementById('quo-client-name').value = '';
    document.getElementById('quo-client-address').value = '';
    document.getElementById('quo-client-phone').value = '';
    document.getElementById('quo-discount').value = 0;
    
    renderQuoteItems();
};

window.addQuoteItem = function() {
    quoItems.push({ desc: '', qty: 1, price: 0 });
    renderQuoteItems();
};

window.removeQuoteItem = function(index) {
    quoItems.splice(index, 1);
    renderQuoteItems();
};

window.updateQuoteItem = function(index, field, value) {
    quoItems[index][field] = value;
    calcQuoteTotal();
};

window.renderQuoteItems = function() {
    const tbody = document.getElementById('quo-items-body');
    tbody.innerHTML = '';
    quoItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding:4px;"><input type="text" placeholder="Item description" value="\${item.desc}" oninput="updateQuoteItem(\${index}, 'desc', this.value)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px;"><input type="number" min="1" value="\${item.qty}" oninput="updateQuoteItem(\${index}, 'qty', parseFloat(this.value)||0)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px;"><input type="number" min="0" step="0.01" value="\${item.price}" oninput="updateQuoteItem(\${index}, 'price', parseFloat(this.value)||0)" style="width:100%; padding:6px; border:1px solid var(--bd); border-radius:4px; outline:none;"></td>
            <td style="padding:4px; text-align:right; font-weight:600;">$\${(item.qty * item.price).toFixed(2)}</td>
            <td style="padding:4px; text-align:center;"><button onclick="removeQuoteItem(\${index})" style="background:transparent; border:none; color:var(--re); cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
    calcQuoteTotal();
};

window.calcQuoteTotal = function() {
    let subtotal = quoItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const discount = parseFloat(document.getElementById('quo-discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('quo-subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('quo-total').innerText = '$' + total.toFixed(2);
};

window.saveQuote = async function() {
    // Collect data
    const data = {
        id: document.getElementById('quo-number').value,
        client: document.getElementById('quo-client-name').value,
        address: document.getElementById('quo-client-address').value,
        phone: document.getElementById('quo-client-phone').value,
        date: document.getElementById('quo-date').value,
        validity: document.getElementById('quo-validity').value,
        terms: document.getElementById('quo-terms').value,
        items: quoItems,
        discount: parseFloat(document.getElementById('quo-discount').value) || 0,
        subtotal: quoItems.reduce((sum, item) => sum + (item.qty * item.price), 0),
        total: Math.max(0, quoItems.reduce((sum, item) => sum + (item.qty * item.price), 0) - (parseFloat(document.getElementById('quo-discount').value) || 0)),
        createdAt: Date.now()
    };
    
    if(!data.client || !data.id) {
        toast('Client Name and Quote Number are required!', 'error');
        return;
    }
    
    try {
        await db.collection('lm_quotes').doc(data.id).set(data);
        toast('Quotation saved successfully!', 'success');
        document.getElementById('mo-quote-builder').classList.remove('open');
        loadQuotes();
    } catch(err) {
        toast('Error saving quotation.', 'error');
        console.error(err);
    }
};

window.loadQuotes = async function() {
    const list = document.getElementById('erp-quotes-list');
    if(!list) return;
    
    try {
        const snap = await db.collection('lm_quotes').orderBy('createdAt', 'desc').get();
        quotes = snap.docs.map(d => d.data());
        
        if(quotes.length === 0) {
            list.innerHTML = '<div style="padding:20px; text-align:center; color:var(--mu); background:#f8fafc; border-radius:8px; border:1px dashed var(--bd);">No quotations created yet.</div>';
            return;
        }
        
        list.innerHTML = '';
        quotes.forEach(quo => {
            const item = document.createElement('div');
            item.style.cssText = 'padding:14px 18px; border:1px solid var(--bd); border-radius:10px; display:flex; justify-content:space-between; align-items:center; background:#fff;';
            item.innerHTML = `
                <div>
                    <strong style="display:block; font-size:1rem; color:var(--blue); margin-bottom:4px;">\${quo.id} - \${quo.client}</strong>
                    <span style="font-size:0.8rem; color:var(--mu); margin-right:12px;"><i class="fa-regular fa-calendar"></i> \${quo.date}</span>
                    <strong style="font-size:0.9rem; color:var(--or);"><i class="fa-solid fa-dollar-sign"></i> \${quo.total.toFixed(2)}</strong>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn bo" onclick="printQuoteData('\${quo.id}')"><i class="fa-solid fa-print"></i></button>
                    <button class="btn bo" style="color:var(--re); border-color:var(--re);" onclick="deleteQuote('\${quo.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            list.appendChild(item);
        });
    } catch(err) {
        console.error("Error loading quotes", err);
    }
};

window.deleteQuote = async function(id) {
    if(confirm('Are you sure you want to delete quote ' + id + '?')) {
        try {
            await db.collection('lm_quotes').doc(id).delete();
            toast('Quote deleted.', 'success');
            loadQuotes();
        } catch(err) {
            toast('Error deleting quote.', 'error');
        }
    }
};

window.printQuoteData = function(id) {
    const quo = quotes.find(q => q.id === id);
    if(quo) {
        // Load data into modal and print
        document.getElementById('quo-number').value = quo.id;
        document.getElementById('quo-client-name').value = quo.client;
        document.getElementById('quo-client-address').value = quo.address;
        document.getElementById('quo-client-phone').value = quo.phone;
        document.getElementById('quo-date').value = quo.date;
        document.getElementById('quo-validity').value = quo.validity || '30 Days';
        document.getElementById('quo-terms').value = quo.terms || '';
        document.getElementById('quo-discount').value = quo.discount;
        quoItems = JSON.parse(JSON.stringify(quo.items));
        renderQuoteItems();
        printQuote();
    }
};

window.printQuote = function() {
    const w = window.open('', '_blank');
    
    // Get values
    const num = document.getElementById('quo-number').value;
    const client = document.getElementById('quo-client-name').value;
    const address = document.getElementById('quo-client-address').value;
    const phone = document.getElementById('quo-client-phone').value;
    const date = document.getElementById('quo-date').value;
    const validity = document.getElementById('quo-validity').value;
    const terms = document.getElementById('quo-terms').value;
    const subtotal = document.getElementById('quo-subtotal').innerText;
    const discount = document.getElementById('quo-discount').value;
    const total = document.getElementById('quo-total').innerText;
    
    let itemsHtml = '';
    quoItems.forEach(item => {
        itemsHtml += `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #ddd;">\${item.desc}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:center;">\${item.qty}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">$\${item.price.toFixed(2)}</td>
                <td style="padding:10px; border-bottom:1px solid #ddd; text-align:right;">$\${(item.qty * item.price).toFixed(2)}</td>
            </tr>
        `;
    });

    w.document.write(`
        <html>
        <head>
            <title>Quotation - \${num}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; padding: 40px; margin: 0 auto; max-width: 800px; }
                h1 { color: #004d99; margin:0 0 10px 0; }
                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #004d99; padding-bottom: 20px; margin-bottom: 30px; }
                .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; color:#555;}
                .totals { width: 300px; margin-left: auto; border-top: 2px solid #ddd; padding-top: 20px; }
                .totals-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .grand-total { font-size: 1.3em; font-weight: bold; color: #004d99; }
                .terms { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #ddd; font-size: 0.9em; margin-top: 40px; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>LITTLEMAKER CAMBODIA</h1>
                    <p style="margin:0; color:#666;">National Road 1, Svay Rieng, Cambodia</p>
                    <p style="margin:0; color:#666;">Phone: +855 12 345 678 | Email: info@littlemaker.com</p>
                </div>
                <div style="text-align:right;">
                    <h2 style="margin:0; color:#555; font-size:2em;">QUOTATION</h2>
                    <p style="margin:5px 0 0 0;"><strong>Quote #:</strong> \${num}</p>
                    <p style="margin:0;"><strong>Date:</strong> \${date}</p>
                    <p style="margin:0;"><strong>Validity:</strong> \${validity}</p>
                </div>
            </div>
            
            <div class="details">
                <div>
                    <h3 style="margin-top:0; color:#555; border-bottom:1px solid #ddd; padding-bottom:5px;">Prepared For</h3>
                    <strong style="font-size:1.1em;">\${client}</strong>
                    <p style="margin:5px 0; white-space:pre-wrap;">\${address}</p>
                    <p style="margin:0;">\${phone}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align:center;">Qty</th>
                        <th style="text-align:right;">Unit Price</th>
                        <th style="text-align:right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    \${itemsHtml}
                </tbody>
            </table>
            
            <div class="totals">
                <div class="totals-row"><span>Subtotal:</span> <strong>\${subtotal}</strong></div>
                <div class="totals-row"><span>Discount:</span> <strong>$\${parseFloat(discount).toFixed(2)}</strong></div>
                <div class="totals-row grand-total" style="border-top:1px solid #ddd; padding-top:10px; margin-top:10px;">
                    <span>Total:</span> <span>\${total}</span>
                </div>
            </div>
            
            <div class="terms">
                <strong style="color:#555;">Terms & Conditions:</strong>
                <p style="margin:5px 0 0 0; white-space:pre-wrap;">\${terms}</p>
            </div>
            
            <div style="margin-top:40px; text-align:center; color:#888; font-size:0.9em; border-top:1px solid #eee; padding-top:20px;">
                We look forward to working with you!
            </div>
        </body>
        </html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
};

// ==========================================
// FINANCE LOGIC
// ==========================================
let financeRecords = [];
let currentFinFilter = 'all';

window.saveFinanceRecord = async function() {
    const type = document.getElementById('fin-type').value;
    const date = document.getElementById('fin-date').value;
    const desc = document.getElementById('fin-desc').value.trim();
    const amount = parseFloat(document.getElementById('fin-amount').value);
    
    if(!desc || isNaN(amount) || amount <= 0) {
        toast('Please enter a valid description and amount.', 'error');
        return;
    }
    
    const record = {
        id: 'FIN-' + Date.now().toString(),
        type,
        date,
        desc,
        amount,
        createdAt: Date.now()
    };
    
    try {
        await db.collection('lm_finance').doc(record.id).set(record);
        toast('Transaction added!', 'success');
        
        // Reset form
        document.getElementById('fin-desc').value = '';
        document.getElementById('fin-amount').value = '';
        
        loadFinanceRecords();
    } catch(err) {
        toast('Error saving transaction.', 'error');
        console.error(err);
    }
};

window.loadFinanceRecords = async function() {
    const list = document.getElementById('erp-finance-list');
    if(!list) return;
    
    // Set default date if empty
    if(!document.getElementById('fin-date').value) {
        document.getElementById('fin-date').value = new Date().toISOString().split('T')[0];
    }
    
    try {
        const snap = await db.collection('lm_finance').orderBy('date', 'desc').orderBy('createdAt', 'desc').get();
        financeRecords = snap.docs.map(d => d.data());
        
        renderFinanceRecords();
    } catch(err) {
        console.error("Error loading finance records", err);
    }
};

window.filterFinance = function(filter) {
    currentFinFilter = filter;
    renderFinanceRecords();
};

window.renderFinanceRecords = function() {
    const list = document.getElementById('erp-finance-list');
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Calculate totals across ALL records
    financeRecords.forEach(r => {
        if(r.type === 'income') totalIncome += r.amount;
        else if(r.type === 'expense') totalExpense += r.amount;
    });
    
    // Update Dashboard UI
    document.getElementById('fin-total-income').innerText = '$' + totalIncome.toFixed(2);
    document.getElementById('fin-total-expense').innerText = '$' + totalExpense.toFixed(2);
    document.getElementById('fin-net-profit').innerText = '$' + (totalIncome - totalExpense).toFixed(2);
    
    // Filter records for display
    const filtered = currentFinFilter === 'all' 
        ? financeRecords 
        : financeRecords.filter(r => r.type === currentFinFilter);
        
    if(filtered.length === 0) {
        list.innerHTML = '<div style="padding:20px; text-align:center; color:var(--mu); background:#f8fafc; border-radius:8px; border:1px dashed var(--bd);">No transactions found.</div>';
        return;
    }
    
    list.innerHTML = '';
    filtered.forEach(r => {
        const item = document.createElement('div');
        const isIncome = r.type === 'income';
        item.style.cssText = 'padding:12px; border:1px solid var(--bd); border-radius:8px; display:flex; justify-content:space-between; align-items:center; background:#fff;';
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:50%; background:\${isIncome ? '#e8faf0' : '#ffe8e8'}; color:\${isIncome ? 'var(--gr)' : 'var(--re)'}; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
                    <i class="fa-solid \${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                </div>
                <div>
                    <strong style="display:block; font-size:0.9rem; color:var(--dk); margin-bottom:2px;">\${r.desc}</strong>
                    <span style="font-size:0.75rem; color:var(--mu);"><i class="fa-regular fa-calendar"></i> \${r.date}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <strong style="font-size:1rem; color:\${isIncome ? 'var(--gr)' : 'var(--re)'};">\${isIncome ? '+' : '-'}$\${r.amount.toFixed(2)}</strong>
                <button onclick="deleteFinanceRecord('\${r.id}')" style="background:transparent; border:none; color:var(--mu); cursor:pointer; padding:4px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(item);
    });
};

window.deleteFinanceRecord = async function(id) {
    if(confirm('Delete this transaction?')) {
        try {
            await db.collection('lm_finance').doc(id).delete();
            loadFinanceRecords();
        } catch(err) {
            toast('Error deleting transaction.', 'error');
        }
    }
};

// ==========================================
// INVENTORY LOGIC
// ==========================================
let inventoryItems = [];

window.saveInventoryItem = async function() {
    const idField = document.getElementById('inv-item-id').value;
    const sku = document.getElementById('inv-item-sku').value.trim();
    const name = document.getElementById('inv-item-name').value.trim();
    const cat = document.getElementById('inv-item-cat').value;
    const qty = parseInt(document.getElementById('inv-item-qty').value) || 0;
    const minQty = parseInt(document.getElementById('inv-item-min').value) || 0;
    
    if(!sku || !name) {
        toast('SKU and Product Name are required!', 'error');
        return;
    }
    
    const itemData = {
        sku,
        name,
        category: cat,
        quantity: qty,
        minQuantity: minQty,
        updatedAt: Date.now()
    };
    
    // If no ID, it's a new item
    const docId = idField ? idField : 'ITEM-' + Date.now().toString();
    if(!idField) itemData.createdAt = Date.now();
    
    try {
        await db.collection('lm_inventory').doc(docId).set(itemData, { merge: true });
        toast('Inventory item saved!', 'success');
        
        document.getElementById('mo-inv-item').classList.remove('open');
        loadInventory();
        
        // Reset form
        document.getElementById('inv-item-id').value = '';
        document.getElementById('inv-item-sku').value = '';
        document.getElementById('inv-item-name').value = '';
        document.getElementById('inv-item-qty').value = '0';
        document.getElementById('inv-item-min').value = '5';
    } catch(err) {
        toast('Error saving inventory item.', 'error');
        console.error(err);
    }
};

window.loadInventory = async function() {
    const list = document.getElementById('erp-inv-list');
    if(!list) return;
    
    try {
        const snap = await db.collection('lm_inventory').orderBy('name', 'asc').get();
        inventoryItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        if(inventoryItems.length === 0) {
            list.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:var(--mu);">No inventory items found.</td></tr>';
            return;
        }
        
        list.innerHTML = '';
        inventoryItems.forEach(item => {
            const isLow = item.quantity <= item.minQuantity;
            const statusHtml = isLow 
                ? '<span style="background:#ffe8e8; color:var(--re); padding:4px 8px; border-radius:99px; font-size:0.75rem; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock</span>'
                : '<span style="background:#e8faf0; color:var(--gr); padding:4px 8px; border-radius:99px; font-size:0.75rem; font-weight:700;"><i class="fa-solid fa-check"></i> In Stock</span>';
                
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--bd)';
            tr.innerHTML = `
                <td style="padding:12px 8px; font-weight:600; color:var(--blue);">\${item.sku}</td>
                <td style="padding:12px 8px; font-weight:600; color:var(--dk);">\${item.name}</td>
                <td style="padding:12px 8px; color:var(--mu); font-size:0.85rem;">\${item.category}</td>
                <td style="padding:12px 8px; font-weight:700; font-size:1.1rem; color:\${isLow ? 'var(--re)' : 'var(--dk)'};">\${item.quantity}</td>
                <td style="padding:12px 8px;">\${statusHtml}</td>
                <td style="padding:12px 8px; text-align:right;">
                    <button class="btn bo" onclick="editInventoryItem('\${item.id}')" style="padding:6px; margin-right:4px;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn bo" onclick="deleteInventoryItem('\${item.id}')" style="padding:6px; color:var(--re); border-color:var(--re);"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            list.appendChild(tr);
        });
    } catch(err) {
        console.error("Error loading inventory", err);
    }
};

window.editInventoryItem = function(id) {
    const item = inventoryItems.find(i => i.id === id);
    if(item) {
        document.getElementById('inv-item-id').value = item.id;
        document.getElementById('inv-item-sku').value = item.sku;
        document.getElementById('inv-item-name').value = item.name;
        document.getElementById('inv-item-cat').value = item.category;
        document.getElementById('inv-item-qty').value = item.quantity;
        document.getElementById('inv-item-min').value = item.minQuantity || 5;
        
        document.getElementById('mo-inv-item').classList.add('open');
    }
};

window.deleteInventoryItem = async function(id) {
    if(confirm('Are you sure you want to delete this inventory item?')) {
        try {
            await db.collection('lm_inventory').doc(id).delete();
            toast('Item deleted.', 'success');
            loadInventory();
        } catch(err) {
            toast('Error deleting item.', 'error');
        }
    }
};

// Hook into the main rendering loop
document.addEventListener('DOMContentLoaded', () => {
  // Ensure initERP is called when navigating to 'erp'
  const origGoto = window.goto;
  if (origGoto) {
    window.goto = function(id) {
      origGoto(id);
      if (id === 'erp' && document.getElementById('sa-erp').innerHTML.trim() === '') {
        window.initERP();
      }
    };
  }
});
