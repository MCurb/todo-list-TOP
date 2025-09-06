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
document.querySelector(".Inbox").classList.add("active-sidebar-project");

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
  taskForm.querySelector(".title-input").value = "";
  dynamicProjectSelector(selectProject);
  taskForm.querySelector(".select-priority").value = "Medium";
  taskForm.querySelector(".title-input").focus();
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}

const cancelBtn = document.querySelector(".cancel-btn");
cancelBtn.addEventListener("click", () => {
  taskForm.style.display = "none";
  addTaskBtnMain.style.display = "flex";

  // Reset form values
  taskForm.querySelector(".title-input").value = "";
  taskForm.querySelector(".date-input").value = "";
  dynamicProjectSelector(selectProject);
  taskForm.querySelector(".select-priority").value = "Medium";
});

const editTaskForm = document.querySelector(".edit-task-form");
editTaskForm.addEventListener("submit", editFormHandler);

const cancelEditBtn = document.querySelector(".cancel-edit-btn");
cancelEditBtn.addEventListener("click", () => {
  editTaskForm.style.display = "none";
  tasksContainer.innerHTML = "";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
});

const tasksContainer = document.querySelector(".tasks-div");
tasksContainer.addEventListener("click", taskActionHandler);

const addTaskBtnMain = document.querySelector(".add-task-btn-main");
addTaskBtnMain.addEventListener("click", () => {
  addTaskBtnMain.insertAdjacentElement("afterend", taskForm);
  taskForm.style.display = "grid";
  addTaskBtnMain.style.display = "none";
  taskForm.querySelector(".title-input").focus();
});

const addProjectBtn = document.querySelector(".add-project");
const newProjectForm = document.querySelector(".new-project-form");
addProjectBtn.addEventListener("click", eventHandler);
function eventHandler(e) {
  if (e.target.matches(".material-symbols-outlined")) {
    document.querySelector(".add-project").after(newProjectForm);
    newProjectForm.style.display = "grid";
    newProjectForm.querySelector(".project-name-input").focus();
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
  document.querySelector(".project-name-input").value = "";
  document.querySelector(".project-name-input").focus();
  console.log(getCurrentProjects());
  renderNewProjects();
  dynamicProjectSelector(selectProject);
  dynamicProjectSelector(editSelectProject);
}

const cancelProjectBtn = document.querySelector(".cancel-project-btn");
cancelProjectBtn.addEventListener("click", () => {
  newProjectForm.style.display = "none";
  document.querySelector(".project-name-input").value = "";
});

const header = document.querySelector(".header");
const body = document.querySelector("body");
const main = document.querySelector(".main");
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
    main.style.marginLeft = "20vw";
  } else {
    sidebar.insertBefore(sidebarContainer, taskCategoryContainer);
    main.style.marginLeft = "10vw";
  }
}

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");
dynamicProjectSelector(selectProject);
dynamicProjectSelector(editSelectProject);
