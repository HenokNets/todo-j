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
let currentProjectId = null;

function saveToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadFromStorage() {
  const saved = JSON.parse(localStorage.getItem("projects"));
  if (saved && saved.length > 0) {
    projects = saved;
  } else {
    projects = [new Project("Inbox")];
    saveToStorage();
  }
}

function createProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  saveToStorage();
  renderProjects();
}

function deleteProject(id) {
  projects.splice(projects.findIndex(item => item.id === id), 1);
  saveToStorage();
  renderProjects();
}

function renameProject(id, name) {
  projects.find(item => item.id === id).name = name;
  saveToStorage();
  renderProjects();
}

function addTodo(title, description, dueDate, priority, projectId) {
  const newTodo = new Todo(title, description, dueDate, priority);
  projects.find(item => item.id === projectId).todos.push(newTodo);
  saveToStorage();
}

function deleteTodo(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todoIndex = project.todos.findIndex(item => item.id === id);
  project.todos.splice(todoIndex, 1);
  saveToStorage();
}

function toggleComplete(id, projectId) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.completed = !todo.completed;
  saveToStorage();
}

function changePriority(id, projectId, priority) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  todo.priority = priority;
  saveToStorage();
}

function editTodo(id, projectId, updates) {
  const project = projects.find(item => item.id === projectId);
  const todo = project.todos.find(item => item.id === id);
  Object.assign(todo, updates);
  saveToStorage();
}

const projectList = document.getElementById("projects-list");
const addProjectBtn = document.getElementById("add-project");

function renderProjects() {
  projectList.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.className = `project-item ${project.id === currentProjectId ? 'active' : ''}`;
    
    const span = document.createElement('span');
    span.textContent = project.name;
    span.className = 'project-name';

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'project-actions';

    const renameBtn = document.createElement('button');
    renameBtn.textContent = '✎';
    renameBtn.className = 'rename-btn';
    renameBtn.title = 'Rename project';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete project';

    actionsDiv.append(renameBtn, deleteBtn);
    li.append(span, actionsDiv);
    projectList.appendChild(li);

    span.addEventListener('click', () => {
      currentProjectId = project.id;
      renderProjects();
      renderTodos(); 
    });

    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Enter new project name:', project.name);
      if (newName && newName.trim()) {
        renameProject(project.id, newName.trim());
      }
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete project "${project.name}" and all its todos?`)) {
        deleteProject(project.id);
        if (currentProjectId === project.id) {
          currentProjectId = projects.length > 0 ? projects[0].id : null;
        }
        renderProjects();
        renderTodos();
      }
    });
  });
}

addProjectBtn.addEventListener("click", () => {
  const userInput = prompt("Enter name for the project you want to create");
  if (userInput === null || userInput === "") return;
  createProject(userInput);
});

loadFromStorage();
if (projects.length > 0) {
  currentProjectId = projects[0].id;
}
renderProjects();
renderTodos();