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

// DOM Elements
const projectList = document.getElementById("projects-list");
const addProjectBtn = document.getElementById("add-project");
const addTodoBtn = document.getElementById("add-todo");
const todoContainer = document.getElementById("todo-container");
const projectTitle = document.getElementById("project-title");
const todoModal = document.getElementById("todo-modal");
const todoForm = document.getElementById("todo-form");
const modalTitle = document.getElementById("modal-title");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.getElementById("cancel-todo");

// Form Inputs
const titleInput = document.getElementById("todo-title");
const descriptionInput = document.getElementById("todo-description");
const dueDateInput = document.getElementById("todo-due-date");
const prioritySelect = document.getElementById("todo-priority");
const titleError = document.getElementById("title-error");
const submitBtn = todoForm.querySelector(".btn-submit");

// Track if we're editing or adding
let editingTodoId = null;

function refreshUI() {
  renderProjects();
  renderTodos();
}

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
      refreshUI();
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
        refreshUI();
      }
    });
  });
}

function renderTodos() {
  if (!todoContainer || !projectTitle) return;
  
  todoContainer.innerHTML = '';
  
  if (!currentProjectId) {
    projectTitle.innerHTML = 'Select a Project';
    todoContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Select a project to view its todos</p>';
    return;
  }

  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;

  const completedCount = project.todos.filter(t => t.completed).length;
  const totalCount = project.todos.length;
  
  projectTitle.innerHTML = `${project.name} <span class="todo-count">${completedCount}/${totalCount} completed</span>`;

  if (project.todos.length === 0) {
    todoContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No todos yet. Click "Add Todo" to create one!</p>';
    return;
  }

  project.todos.forEach(todo => {
    const todoDiv = document.createElement('div');
    todoDiv.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
    
    todoDiv.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} class="todo-checkbox">
        <div class="todo-info">
          <h4>${escapeHtml(todo.title)}</h4>
          ${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ''}
          ${todo.dueDate ? `<small>Due: ${todo.dueDate}</small>` : ''}
          <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    todoDiv.querySelector('.todo-checkbox').addEventListener('change', () => {
      toggleComplete(todo.id, currentProjectId);
      refreshUI();
    });

    todoDiv.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this todo?')) {
        deleteTodo(todo.id, currentProjectId);
        refreshUI();
      }
    });

    todoDiv.querySelector('.edit-btn').addEventListener('click', () => {
      openEditForm(todo);
    });

    todoContainer.appendChild(todoDiv);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Modal Functions
function openModal() {
  editingTodoId = null;
  modalTitle.textContent = 'Add New Todo';
  submitBtn.textContent = 'Add Todo';
  resetForm();
  todoModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function openEditForm(todo) {
  editingTodoId = todo.id;
  modalTitle.textContent = 'Edit Todo';
  submitBtn.textContent = 'Save Changes';
  
  // Pre-fill form values
  titleInput.value = todo.title;
  descriptionInput.value = todo.description || '';
  dueDateInput.value = todo.dueDate || '';
  prioritySelect.value = todo.priority;
  
  // Clear any errors
  titleError.classList.remove('show');
  titleInput.classList.remove('error');
  
  todoModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  todoModal.classList.remove('show');
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  todoForm.reset();
  titleError.classList.remove('show');
  titleInput.classList.remove('error');
  prioritySelect.value = 'medium';
  editingTodoId = null;
}

function validateForm() {
  let isValid = true;
  const trimmedTitle = titleInput.value.trim();
  
  // Title validation
  if (!trimmedTitle) {
    titleError.textContent = 'Title is required';
    titleError.classList.add('show');
    titleInput.classList.add('error');
    isValid = false;
  } else if (trimmedTitle.length < 3) {
    titleError.textContent = 'Title must be at least 3 characters';
    titleError.classList.add('show');
    titleInput.classList.add('error');
    isValid = false;
  } else {
    titleError.classList.remove('show');
    titleInput.classList.remove('error');
  }

  return isValid;
}

// Event Listeners
addProjectBtn.addEventListener("click", () => {
  const userInput = prompt("Enter name for the project you want to create");
  if (userInput === null || userInput === "") return;
  createProject(userInput);
});

addTodoBtn.addEventListener('click', () => {
  if (!currentProjectId) {
    alert('Please select a project first!');
    return;
  }
  openModal();
});

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
todoModal.addEventListener('click', (e) => {
  if (e.target === todoModal) {
    closeModal();
  }
});

// Form submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (editingTodoId) {
    editTodo(editingTodoId, currentProjectId, {
      title,
      description,
      dueDate,
      priority
    });
  } else {
    // Add new todo
    addTodo(title, description, dueDate, priority, currentProjectId);
  }

  refreshUI();
  closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && todoModal.classList.contains('show')) {
    closeModal();
  }
});

// Initialize app
loadFromStorage();
if (projects.length > 0) {
  currentProjectId = projects[0].id;
}
refreshUI();