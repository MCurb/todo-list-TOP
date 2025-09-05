import "./styles.css";

import { Task } from "./task-object";

import { newProject } from "./projects";

import { newTask } from "./tasks";

import {
  renderTasks,
  getTaskFormData,
  getProjectFormData,
  taskActionHandler,
  editFormHandler,
} from "./dom";

import {
  getRenderedProject,
  onProjectSidebarClick,
  dynamicProjectSelector,
  renderNewProjects,
  renderDefaultProjects,
} from "./sidebar-ui";

//Not so important now:
import { getCurrentProjects, getCurrentTasks } from "./state";

newProject("Home");
newProject("Work");

// Init
renderDefaultProjects();
renderNewProjects();
renderTasks(getCurrentProjects()[getRenderedProject()]);
document.querySelector(".Inbox").classList.add("active-sidebar-project")

const sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("click", onProjectSidebarClick);

const taskForm = document.querySelector(".task-form");

taskForm.addEventListener("submit", taskFormHandler);
function taskFormHandler(e) {
  e.preventDefault();
  const taskData = getTaskFormData();
  newTask(
    new Task(
      false,
      taskData.dueDate,
      taskData.title,
      taskData.project,
      taskData.priority,
      taskData.id
    )
  );
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}

const editTaskForm = document.querySelector(".edit-task-form");
editTaskForm.addEventListener("submit", editFormHandler);

const tasksContainer = document.querySelector(".tasks-div");
tasksContainer.addEventListener("click", taskActionHandler);

const addProjectBtn = document.querySelector(".add-project");
const newProjectForm = document.querySelector(".new-project-form");
addProjectBtn.addEventListener("click", eventHandler);
function eventHandler(e) {
  if (e.target.matches(".material-symbols-outlined")) {
    document.querySelector(".add-project").after(newProjectForm);
    newProjectForm.style.display = "grid";
  }
}

newProjectForm.addEventListener("submit", projectFormHandler);
function projectFormHandler(e) {
  e.preventDefault();
  const newProjectData = getProjectFormData();
  if (!newProject(newProjectData.projectName.trim().replace(/\s+/g, " "))) {
    alert("Project already exists");
    return;
  }
  newProjectForm.style.display = "none";
  console.log(getCurrentProjects());
  renderNewProjects();
  dynamicProjectSelector(selectProject);
  dynamicProjectSelector(editSelectProject);
}

const header = document.querySelector(".header");
const body = document.querySelector("body");
const toggleSidebarBtn = document.querySelector(
  ".top-sidebar .material-symbols-outlined"
);
const taskCategoryContainer = document.querySelector(".task-categories");

const sidebarContainer = document.querySelector(".top-sidebar");
toggleSidebarBtn.addEventListener("click", toggleSidebar);
function toggleSidebar() {
  body.classList.toggle("collapse-grid");
  sidebar.classList.toggle("collapse-sidebar");
  if (!header.querySelector(".top-sidebar")) {
    header.appendChild(sidebarContainer);
  } else {
    sidebar.insertBefore(sidebarContainer, taskCategoryContainer )
  }
}

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");
dynamicProjectSelector(selectProject);
dynamicProjectSelector(editSelectProject);
