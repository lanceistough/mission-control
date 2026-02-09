const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory state
let state = {
  status: 'idle', // idle, working, stuck
  currentTask: null,
  queue: [],
  todos: []
};

// API to update status
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get current state
app.get('/api/state', (req, res) => {
  res.json(state);
});

// Update status
app.post('/api/status', (req, res) => {
  const { status } = req.body;
  if (['idle', 'working', 'stuck'].includes(status)) {
    state.status = status;
    io.emit('update', state);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid status' });
  }
});

// Update current task
app.post('/api/current', (req, res) => {
  const { task } = req.body;
  state.currentTask = task;
  io.emit('update', state);
  res.json({ success: true });
});

// Update queue
app.post('/api/queue', (req, res) => {
  const { tasks } = req.body;
  state.queue = tasks || [];
  io.emit('update', state);
  res.json({ success: true });
});

// Add task to queue
app.post('/api/queue/add', (req, res) => {
  const { task } = req.body;
  state.queue.push(task);
  io.emit('update', state);
  res.json({ success: true });
});

// Clear queue
app.post('/api/queue/clear', (req, res) => {
  state.queue = [];
  io.emit('update', state);
  res.json({ success: true });
});

// Todos - get all
app.get('/api/todos', (req, res) => {
  res.json(state.todos);
});

// Add todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  const todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    created: new Date().toISOString()
  };
  state.todos.push(todo);
  io.emit('update', state);
  res.json({ success: true, todo });
});

// Toggle todo
app.post('/api/todos/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    io.emit('update', state);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  state.todos = state.todos.filter(t => t.id !== id);
  io.emit('update', state);
  res.json({ success: true });
});

// Clear completed todos
app.post('/api/todos/clear-completed', (req, res) => {
  state.todos = state.todos.filter(t => !t.completed);
  io.emit('update', state);
  res.json({ success: true });
});

// Socket.io connection
io.on('connection', (socket) => {
  socket.emit('update', state);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mission Control running at http://10.1.13.231:${PORT}`);
});
