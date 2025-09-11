import "./styles.css";

import { Task } from "./task-object";

import { eraseProject, newProject } from "./projects";

import {
  renderDefaultProjects,
  renderCustomProjects,
  setupProjectListeners,
} from "./projects-ui";

import { newTask } from "./tasks";

import { renderTasks, setupTaskListeners } from "./tasks-ui";

import {
  getTaskFormData,
  getProjectFormData,
  taskActionHandler,
  editFormHandler,
  getDialogFormData,
} from "./dom";

import {
  getRenderedProject,
  populateProjectSelectors,
  updateSelectInputs,
  renderActiveProjectName,
  resetRenderedProject,
  setActiveSidebarProject,
  setupSidebarListeners,
} from "./sidebar-ui";

import { decodeClassName } from "./utils";

//Not so important now:
import {
  getCurrentProjects,
  getCurrentTasks,
  loadData,
  saveData,
} from "./state";
import { findCorrectCategory } from "./categorize-tasks";

function initApp() {
  // Load & render
  loadData();
  findCorrectCategory();
  renderDefaultProjects();
  renderCustomProjects();
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  setActiveSidebarProject(document.querySelector(".Inbox"));

  // Setup listeners
  setupSidebarListeners();
  setupTaskListeners();
  setupProjectListeners();
}

initApp();



const tasksContainer = document.querySelector(".tasks-div");
tasksContainer.addEventListener("click", taskActionHandler);

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

const projectsSection = document.querySelector(".projects");
projectsSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-project")) {
    eraseProject(decodeClassName(e.target.parentElement.classList[0]));
    e.target.parentElement.remove();
    resetRenderedProject();
    renderTasks(getCurrentProjects()[getRenderedProject()]);
    setActiveSidebarProject(document.querySelector(".Inbox"));
    renderActiveProjectName("Inbox");

    updateSelectInputs();
  }
});

newProjectForm.addEventListener("submit", projectFormHandler);
function projectFormHandler(e) {
  e.preventDefault();
  const newProjectData = getProjectFormData();
  if (!newProject(newProjectData.projectName.trim().replace(/\s+/g, " "))) {
    alert("Project already exists");
    return;
  }
  saveData();
  document.querySelector(".project-name-input").value = "";
  document.querySelector(".project-name-input").focus();
  console.log(getCurrentProjects());
  renderCustomProjects();
  populateProjectSelectors();
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

populateProjectSelectors();
