const GIST_URL = 'https://gist.githubusercontent.com/lanceistough/a7175de1aa3a9f9dfce5f71806239bfd/raw';

// DOM elements
const statusLight = document.getElementById('status-light');
const statusText = document.getElementById('status-text');
const currentTask = document.getElementById('current-task');
const queue = document.getElementById('queue');
const emptyQueue = document.getElementById('empty-queue');
const todoInput = document.getElementById('todo-input');
const todoAddBtn = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const emptyTodos = document.getElementById('empty-todos');

// Status display names
const statusNames = {
  idle: 'IDLE',
  working: 'WORKING',
  stuck: 'STUCK'
};

// Helper to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Update UI with new state
function updateUI(state) {
  // Update status light
  statusLight.className = 'status-light ' + state.status;
  statusText.textContent = statusNames[state.status] || state.status.toUpperCase();

  // Update current task
  if (state.currentTask) {
    currentTask.textContent = state.currentTask;
  } else {
    currentTask.textContent = 'No active task';
  }

  // Update queue
  queue.innerHTML = '';

  if (state.queue && state.queue.length > 0) {
    emptyQueue.classList.remove('visible');
    state.queue.forEach((task, index) => {
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <div class="queue-item-number">#${index + 1}</div>
        <div class="queue-item-text">${escapeHtml(task)}</div>
      `;
      queue.appendChild(item);
    });
  } else {
    emptyQueue.classList.add('visible');
  }

  // Update todos
  todoList.innerHTML = '';

  if (state.todos && state.todos.length > 0) {
    emptyTodos.classList.remove('visible');
    state.todos.forEach(todo => {
      const item = document.createElement('div');
      item.className = 'todo-item' + (todo.completed ? ' completed' : '');
      item.innerHTML = `
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
        <div class="todo-text">${escapeHtml(todo.text)}</div>
      `;
      todoList.appendChild(item);
    });
  } else {
    emptyTodos.classList.add('visible');
  }
}

// Load state from Gist
async function loadState() {
  try {
    const resp = await fetch(GIST_URL + '?t=' + Date.now());
    const state = await resp.json();
    updateUI(state);
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

// Initial load
loadState();
// Refresh every 10 seconds
setInterval(loadState, 10000);
