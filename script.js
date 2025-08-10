document.addEventListener('DOMContentLoaded', () => {
  // elementos
  const taskList = document.getElementById('taskList');
  const notifBtn = document.getElementById('notifBtn');
  const notifBadge = document.getElementById('notifBadge');
  const notificationsList = document.getElementById('notificationsList');
  const addTaskModalEl = document.getElementById('addTaskModal');
  const addTaskModal = new bootstrap.Modal(addTaskModalEl);
  const notifModal = new bootstrap.Modal(document.getElementById('notificationsModal'));
  const taskForm = document.getElementById('taskForm');
  const subjectInput = document.getElementById('subject');
  const descriptionInput = document.getElementById('description');
  const dueDateInput = document.getElementById('dueDate');
  const logoutBtn = document.getElementById('logoutBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const header = document.querySelector('header');

  // estado
  let tasks = [];
  let notifications = [];

  // utilidades
  function safeParse(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  }

  function loadTasks() {
    const data = safeParse('tasks');
    tasks = Array.isArray(data) ? data : [];
  }
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }
  function daysUntil(dateStr) {
    const today = new Date();
    const due = new Date(dateStr);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    const diff = Math.ceil((due - today) / (1000*60*60*24));
    return diff;
  }

  // user
  function loadUser() {
    const user = safeParse('currentUser');
    if (!user) {
      // si no hay usuario logueado, redirigimos al login
      window.location.href = 'index.html';
      return false;
    }
    document.getElementById('userName').textContent = (user.name || 'Usuario').split(' ')[0];
    document.getElementById('userAvatar').textContent = (user.name && user.name.charAt) ? user.name.charAt(0).toUpperCase() : 'U';
    return true;
  }

  // render + notificaciones
  function generateNotifications() {
    notifications = [];
    tasks.forEach(t => {
      if (t.completed) return;
      const left = daysUntil(t.dueDate);
      if (left < 0) notifications.push(`❌ ${t.subject}: vencida (${formatDate(t.dueDate)})`);
      else if (left <= 3) notifications.push(`⚠️ ${t.subject}: vence en ${left} día${left !== 1 ? 's' : ''}`);
    });
    notifBadge.style.display = notifications.length ? 'inline' : 'none';
    notifBadge.textContent = notifications.length;
  }

  function renderTasks() {
    taskList.innerHTML = '';
    if (!tasks.length) {
      taskList.innerHTML = '<li class="list-group-item text-center text-muted">No tienes tareas aún.</li>';
      return;
    }
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `list-group-item d-flex flex-column ${task.completed ? 'bg-success-subtle' : ''}`;
      li.dataset.id = task.id;

      const left = daysUntil(task.dueDate);
      const statusClass = left < 0 ? 'text-danger fw-bold' : left <= 3 ? 'text-warning fw-bold' : 'text-muted';
      const leftText = left < 0 ? `${Math.abs(left)} día(s) vencida` : `${left} día${left !== 1 ? 's' : ''}`;

      li.innerHTML = `
        <div class="w-100">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="mb-1">${escapeHtml(task.subject)}</h5>
            <span class="badge bg-info text-dark">${formatDate(task.dueDate)}</span>
          </div>
          <p class="mb-1 text-secondary">${escapeHtml(task.description || 'Sin descripción')}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">Quedan: <span class="${statusClass}">${leftText}</span></small>
            <div>
              <button class="btn btn-sm btn-success complete-btn" title="Completar/React.">${task.completed ? '🔄' : '✔️'}</button>
              <button class="btn btn-sm btn-warning edit-btn" title="Editar">✏️</button>
              <button class="btn btn-sm btn-danger delete-btn" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // protección contra XSS simple en strings mostradas
  function escapeHtml(str = '') {
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'", '&#39;');
  }

  // acciones sobre tareas (delegación)
  taskList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);
    const idx = tasks.findIndex(t => Number(t.id) === id);
    if (idx === -1) return;

    if (e.target.closest('.complete-btn')) {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks(); renderTasks(); generateNotifications();
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (confirm(`¿Eliminar tarea "${tasks[idx].subject}"?`)) {
        tasks.splice(idx,1);
        saveTasks(); renderTasks(); generateNotifications();
      }
      return;
    }
    if (e.target.closest('.edit-btn')) {
      const newSubject = prompt('Materia:', tasks[idx].subject);
      if (!newSubject) return;
      const newDesc = prompt('Descripción:', tasks[idx].description || '');
      const newDue = prompt('Fecha (YYYY-MM-DD):', tasks[idx].dueDate);
      if (!newDue || !/^\d{4}-\d{2}-\d{2}$/.test(newDue)) { alert('Fecha inválida'); return; }
      tasks[idx].subject = newSubject.trim();
      tasks[idx].description = (newDesc || '').trim();
      tasks[idx].dueDate = newDue;
      saveTasks(); renderTasks(); generateNotifications();
      return;
    }
  });

  // agregar tarea
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = subjectInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!subject || !dueDate) {
      alert('La materia y la fecha son obligatorias.');
      return;
    }

    const task = {
      id: Date.now(),
      subject,
      description,
      dueDate,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    generateNotifications();
    taskForm.reset();
    addTaskModal.hide();
  });

  // notificaciones (modal)
  notifBtn.addEventListener('click', () => {
    notificationsList.innerHTML = notifications.length
      ? notifications.map(n => `<p class="mb-1">${escapeHtml(n)}</p>`).join('')
      : '<p class="text-muted">No hay notificaciones.</p>';
    notifModal.show();
  });

  // modo oscuro que persiste
  function applyTheme(theme) {
    if (theme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    toggleThemeBtn.textContent = 'Modo Claro';
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    toggleThemeBtn.textContent = 'Modo Oscuro';
  }
}

  toggleThemeBtn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // cerrar sesión (aseguramos que listener exista y funcione)
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    // redirigir al index (login)
    window.location.href = 'index.html';
  });

  // Inicialización
  (function init() {
    const userOk = loadUser();
    if (!userOk) return;
    loadTasks();
    renderTasks();
    generateNotifications();
    // aplicar tema guardado
    applyTheme(localStorage.getItem('theme') || 'light');

    // si hay notificaciones, opcional: mostrar modal inmediato (comenta si no lo quieres)
    if (notifications.length) {
      // mostramos un pequeño toast o modal para avisar al entrar
      // aquí abrimos el modal para que el usuario vea las notificaciones al cargar
      notificationsList.innerHTML = notifications.map(n => `<p class="mb-1">${escapeHtml(n)}</p>`).join('');
      // abrir modal tras 300ms para no bloquear la carga
      setTimeout(() => notifModal.show(), 300);
    }
  })();
  document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

 const toggle = document.getElementById('darkModeToggle');

 toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

});


  
});
