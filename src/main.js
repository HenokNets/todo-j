class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = Date.now().toString(36);
    
  }
}

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.id = Date.now().toString(36);
    this.completed = false;
  }
}

let projects = [];

function loadFromStorage() {
  let saved = JSON.parse(localStorage.getItem("projects"));
  if (saved) {
    projects = saved;
  } else {
    projects = [new Project("Default")];
    saveToStorage();
  }
}

function createProject(name) {
  const newProject = new Project (name);
  projects.push (newProject);
  saveToStorage()
}

function deleteProject(id) {
  projects.splice (projects.findIndex(item => item.id === id), 1);
  saveToStorage()
}

function renameProject (id, name) {
  projects.find(item => item.id === id).name = name;
  saveToStorage()
}

function addTodo(title, description, dueDate, priority, projectId) {
  const newTodo = new Todo (title, description, dueDate, priority)
  projects.find(item => item.id === projectId).todos.push(newTodo);
  saveToStorage()
}

function deleteTodo(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todoIndex = project.todos.findIndex(item => item.id === id);
  project.todos.splice (todoIndex, 1);
  saveToStorage()
}

function toggleComplete(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.completed = !todo.completed;
  saveToStorage()
}

function changePriority(id, projectId, priority) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.priority = priority;
  saveToStorage()
}

function editTodo(id, projectId, updates) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);

  Object.assign (todo, updates);
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem ("projects", JSON.stringify(projects));
}

createProject("Work")
addTodo("Buy milk", "2%", "2026-08-07", "high", projects[0].id)
console.log(projects)

loadFromStorage();


