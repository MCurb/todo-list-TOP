import { getCurrentProjects } from "./state";

import { encodeClassName } from "./utils";

import { renderTasks } from "./tasks-ui";

// --- Module state ---
let renderedProject = "Inbox";

// --- Cached DOM elements (static ones) ---
const addTaskBtnMain = document.querySelector(".add-task-btn-main");

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");
const selectProjectDialog = document.querySelector(".select-project-dialog");

const selectProjecForm = [
  selectProject,
  editSelectProject,
  selectProjectDialog,
];

// ========================
// PUBLIC API (exports)
// ========================

// Rendering
export function renderActiveProjectName(activeProject) {
  const activeProjectName = document.querySelector(".active-project-name");

  activeProjectName.textContent = activeProject;
}

// Sidebar behavior

export function setActiveSidebarProject(sidebarElem) {
  const sidebar = document.querySelector(".sidebar");

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



// ========================
// PRIVATE EVENT HANDLERS
// ========================

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

// ========================
// PRIVATE HELPERS
// ========================

function toggleAddTaskBtn(project) {
  const taskSections = ["Completed", "Today", "Upcomming"];
  if (taskSections.includes(project)) {
    addTaskBtnMain.style.display = "none";
  } else {
    addTaskBtnMain.style.display = "flex";
  }
}

// Sidebar Event Listeners

const sidebar = document.querySelector(".sidebar");

const header = document.querySelector(".header");
const body = document.querySelector("body");
const main = document.querySelector(".main");
const toggleSidebarBtn = document.querySelector(
  ".top-sidebar .material-symbols-outlined"
);
const taskCategoryContainer = document.querySelector(".task-categories");

const sidebarContainer = document.querySelector(".top-sidebar");

export function setupSidebarListeners() {
  sidebar.addEventListener("click", handleSidebarClicks);

  toggleSidebarBtn.addEventListener("click", handleSidebarToggle);
}

// Hanlder Functions

function handleSidebarClicks(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${encodeClassName(project)}`)) {
      renderedProject = project;

      renderTasks(getCurrentProjects()[project]);

      //Make the clicked project and it's svg color red and background color a softer red
      setActiveSidebarProject(e.target);

      renderActiveProjectName(renderedProject);

      toggleAddTaskBtn(project);

      //Change selected input option when user clicks another project
      updateSelectedOption();
    }
  });
}

function handleSidebarToggle() {
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
