import { getCurrentProjects } from "../state/state";

import { encodeClassName } from "../utils/utils";

import { renderTasks } from "../tasks/tasks-ui";
import { resetFormValues } from "../tasks/tasks-listeners";

// ========================
// MODULE STATE
// ========================
let renderedProject = "Inbox";

// ========================
// DOM REFERENCES (static)
// ========================
const body = document.querySelector("body");
const header = document.querySelector(".header");
const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const sidebarToggleContainer = document.querySelector(".top-sidebar");
const toggleSidebarBtn = document.querySelector(
  ".top-sidebar .material-symbols-outlined"
);
const taskCategoryContainer = document.querySelector(".task-categories");

const addTaskBtnMain = document.querySelector(".add-task-btn-main");
const taskForm = document.querySelector(".task-form");
const newProjectForm = document.querySelector(".new-project-form");

const selectProject = document.querySelector(".select-project");
const editSelectProject = document.querySelector(".select-project-edit");
const selectProjectDialog = document.querySelector(".select-project-dialog");

const selectProjecForm = [
  selectProject,
  editSelectProject,
  selectProjectDialog,
];

// ========================
// PUBLIC API (exports)
// ========================
export function renderActiveProjectName(activeProject) {
  const activeProjectName = document.querySelector(".active-project-name");

  activeProjectName.textContent = activeProject;
}

export function setActiveSidebarProject(sidebarElem) {
  if (sidebar.querySelector(".active-sidebar-project")) {
    sidebar
      .querySelector(".active-sidebar-project")
      .classList.remove("active-sidebar-project");
  }
  sidebarElem.classList.add("active-sidebar-project");
}

// State

export function resetRenderedProject() {
  renderedProject = "Inbox";
}

export function getRenderedProject() {
  return renderedProject;
}

export function setupSidebarListeners() {
  sidebar.addEventListener("click", handleSidebarClicks);

  toggleSidebarBtn.addEventListener("click", handleSidebarToggle);
}

// ========================
// EVENT HANDLERS
// ========================

function handleSidebarClicks(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${encodeClassName(project)}`)) {
      renderedProject = project;

      renderTasks(getCurrentProjects()[project]);

      //Make the clicked project and it's svg color red and background color a softer red
      setActiveSidebarProject(e.target);

      renderActiveProjectName(renderedProject);

      toggleAddTaskBtn(project);
      newProjectForm.style.display = "none";
      //Change selected input option when user clicks another project
      updateSelectedOption();
    }
  });
}

function handleSidebarToggle() {
  body.classList.toggle("collapse-grid");
  sidebar.classList.toggle("collapse-sidebar");
  if (!header.querySelector(".top-sidebar")) {
    header.appendChild(sidebarToggleContainer);
    main.style.marginLeft = "20vw";
  } else {
    sidebar.insertBefore(sidebarToggleContainer, taskCategoryContainer);
    main.style.marginLeft = "10vw";
  }
}

// ========================
// PRIVATE HELPERS
// ========================

function toggleAddTaskBtn(project) {
  const taskSections = ["Completed", "Today", "Upcomming"];
  if (taskSections.includes(project)) {
    addTaskBtnMain.style.display = "none";
    taskForm.style.display = "none"
  } else {
    addTaskBtnMain.style.display = "flex";
    taskForm.style.display = "none"
    resetFormValues()
  }
}

//Update input project selected option when changing projects
function updateSelectedOption() {
  selectProjecForm.forEach((selectInput) => {
    for (const option of selectInput.options) {
      if (option.value === getRenderedProject()) {
        option.selected = true;
      }
    }
  });
}
