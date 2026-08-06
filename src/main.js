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
  projects [projects.findIndex (item => item.id === id)].name = name;
}









