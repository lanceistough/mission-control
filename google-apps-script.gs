// Google Apps Script - Deploy at https://script.google.com
// Then copy the deployment URL into index.html above

const SHEET_URL = 'YOUR_SHEET_URL_HERE';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify(getState()))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.status) {
    setProperty('status', data.status);
  }
  if (data.currentTask) {
    setProperty('currentTask', data.currentTask);
  }
  if (data.queue) {
    setProperty('queue', JSON.stringify(data.queue));
  }
  if (data.todos) {
    setProperty('todos', JSON.stringify(data.todos));
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(getState()))
    .setMimeType(ContentService.MimeType.JSON);
}

function getState() {
  return {
    status: PropertiesService.getUserProperties().getProperty('status') || 'idle',
    currentTask: PropertiesService.getUserProperties().getProperty('currentTask') || null,
    queue: JSON.parse(PropertiesService.getUserProperties().getProperty('queue') || '[]'),
    todos: JSON.parse(PropertiesService.getUserProperties().getProperty('todos') || '[]')
  };
}

function setProperty(key, value) {
  PropertiesService.getUserProperties().setProperty(key, value);
}

// Helper function to add todos
function addTodo(text) {
  const todos = getState().todos;
  todos.push({
    id: Date.now().toString(),
    text: text,
    completed: false,
    created: new Date().toISOString()
  });
  setProperty('todos', JSON.stringify(todos));
  return todos;
}

// Helper function to toggle todos
function toggleTodo(id) {
  const todos = getState().todos.map(t => 
    t.id === id ? {...t, completed: !t.completed} : t
  );
  setProperty('todos', JSON.stringify(todos));
  return todos;
}

// Helper function to delete todos
function deleteTodo(id) {
  const todos = getState().todos.filter(t => t.id !== id);
  setProperty('todos', JSON.stringify(todos));
  return todos;
}
