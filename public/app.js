// Connect to server via Socket.io
const socket = io();

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

// Update UI with new state
function updateUI(state) {
  // Update status light
  statusLight.className = 'status-light ' + state.status;
  statusText.textContent = statusNames[state.status];

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
        <div class="queue-item-text">${task}</div>
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
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo('${todo.id}')"></div>
        <div class="todo-text">${escapeHtml(todo.text)}</div>
        <button class="todo-delete" onclick="deleteTodo('${todo.id}')">×</button>
      `;
      todoList.appendChild(item);
    });
  } else {
    emptyTodos.classList.add('visible');
  }
}

// Helper to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Todo functions
async function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  todoInput.value = '';
}

async function toggleTodo(id) {
  await fetch(`/api/todos/${id}/toggle`, { method: 'POST' });
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
}

// Event listeners
todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Listen for real-time updates
socket.on('update', (state) => {
  console.log('State updated:', state);
  updateUI(state);
});

// Initial load
fetch('/api/state')
  .then(res => res.json())
  .then(state => {
    updateUI(state);
  })
  .catch(err => {
    console.error('Failed to load state:', err);
  });
