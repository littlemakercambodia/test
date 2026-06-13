'use strict';

// Ensure data exists
let tasks = JSON.parse(localStorage.getItem('lm_erp_tasks') || '[]');
if (tasks.length === 0) {
    tasks = [
        { id: 1, text: "Review monthly financial report", completed: false },
        { id: 2, text: "Approve pending invoices", completed: false },
        { id: 3, text: "Interview candidates for HR role", completed: true }
    ];
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('lm_erp_tasks', JSON.stringify(tasks));
}

// ── TAB SWITCHING ──
const viewTitles = {
    'dashboard': 'Dashboard Overview',
    'hr': 'Human Resources',
    'finance': 'Finance & Invoices',
    'inventory': 'Inventory Management',
    'tasks': 'Projects & Tasks',
    'settings': 'System Settings'
};

window.switchTab = function(tabId) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Update active view
    document.querySelectorAll('.erp-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById('view-' + tabId);
    if (targetView) targetView.classList.add('active');

    // Update title
    document.getElementById('pageTitle').textContent = viewTitles[tabId] || 'ERP Module';
    
    // Auto-close sidebar on mobile
    if (window.innerWidth <= 900) {
        document.getElementById('erpSidebar').classList.add('collapsed');
    }
};

// ── TASK WIDGET LOGIC ──
function renderTasks() {
    const list = document.getElementById('dashboardTasks');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (tasks.length === 0) {
        list.innerHTML = '<li style="text-align:center; color:var(--text-muted); padding:20px;">No pending tasks.</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span>${escapeHtml(task.text)}</span>
            <button onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
        `;
        list.appendChild(li);
    });
}

window.addQuickTask = function() {
    const input = document.getElementById('newTaskInput');
    const text = input.value.trim();
    if (!text) return;
    
    tasks.unshift({
        id: Date.now(),
        text: text,
        completed: false
    });
    
    saveTasks();
    input.value = '';
    renderTasks();
};

window.toggleTask = function(index) {
    if (tasks[index]) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
};

window.deleteTask = function(index) {
    if (tasks[index]) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
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

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    
    // Auto-collapse sidebar on load for smaller screens
    if (window.innerWidth <= 900) {
        document.getElementById('erpSidebar').classList.add('collapsed');
    }
});
