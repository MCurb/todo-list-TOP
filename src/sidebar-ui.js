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

export function onProjectSidebarClick(e) {
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


// Project select inputs

//Add form select input options, this should be called when adding new projects
export function populateProjectSelectors() {
  selectProjecForm.forEach((selectInput) => {
    Object.keys(getCurrentProjects()).forEach((project) => {
      const defaultProjects = ["Today", "Upcomming", "Completed"];
      if (
        defaultProjects.includes(project) ||
        selectInput.querySelector(`[value="${project}"]`)
      ) {
        return;
      }
      const newOption = document.createElement("option");
      newOption.value = `${project}`;
      newOption.textContent = `${project}`;
      selectInput.append(newOption);
    });
  });
}

//Delete unexisting projects
export function updateSelectInputs() {
  selectProjecForm.forEach((selectInput) => {
    const projects = Object.keys(getCurrentProjects());
    //Update the select input options to match the current projects
    for (let i = selectInput.children.length - 1; i >= 0; i--) {
      const option = selectInput.children[i];
      if (!projects.includes(option.value)) {
        option.remove();
      }
    }
  });
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



