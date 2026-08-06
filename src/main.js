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

const projects = [];

function createProject(name) {
  const newProject = new Project (name);
  projects.push (newProject);

}

function deleteProject(id) {
  projects.splice (projects.findIndex(item => item.id === id), 1);
}

function renameProject (id, name) {
  projects.find(item => item.id === id).name = name;
}

function addTodo(title, description, dueDate, priority, projectId) {
  const newTodo = new Todo (title, description, dueDate, priority)
  projects.find(item => item.id === projectId).todos.push(newTodo);

}

function deleteTodo(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todoIndex = project.todos.findIndex(item => item.id === id);
  project.todos.splice (todoIndex, 1);
}

function toggleComplete(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.completed = !todo.completed;

}

function changePriority(id, projectId, priority) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.priority = priority;
}

function editTodo(id, projectId, updates) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);

  Object.assign (todo, updates);
}








