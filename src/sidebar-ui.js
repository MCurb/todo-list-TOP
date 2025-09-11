import { getCurrentProjects } from "./state";

import { encodeClassName } from "./utils";

import { renderTasks } from "./dom";

const addTaskBtnMain = document.querySelector(".add-task-btn-main");

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");
const selectProjectDialog = document.querySelector(".select-project-dialog");

const selectProjecForm = [
  selectProject,
  editSelectProject,
  selectProjectDialog,
];

const sidebar = document.querySelector(".sidebar");
const taskCategoryContainer = document.querySelector(".task-categories");
const projectsSection = document.querySelector(".projects");

const activeProjectName = document.querySelector(".active-project-name");

let renderedProject = "Inbox";

//Render default projects function:
//this one is going to be called at the init, and render just the default projects

export function renderDefaultProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const projectTaskContainer = createProject(project);

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    projectTaskContainer.prepend(icon);

    const taskSections = ["Inbox", "Completed", "Today", "Upcomming"];
    if (taskSections.includes(project)) {
      switch (project) {
        case "Inbox":
          icon.textContent = "inbox";
          break;
        case "Completed":
          icon.textContent = "check_circle";
          break;
        case "Today":
          icon.textContent = "today";
          break;
        case "Upcomming":
          icon.textContent = "calendar_month";
          break;

        default:
          break;
      }
      taskCategoryContainer.appendChild(projectTaskContainer);
    }
  });
}

//Render new projects function:
//this one is going to be called every time a new project is added and it's just going to add the new projects

export function renderNewProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const taskSections = ["Inbox", "Completed", "Today", "Upcomming"];
    if (
      projectsSection.querySelector(`.${encodeClassName(project)}`) ||
      taskSections.includes(project)
    ) {
      return;
    }

    const projectTaskContainer = createProject(project);

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "folder";

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined", "delete-project");
    deleteIcon.textContent = "delete";
    deleteIcon.style.marginLeft = "auto";

    projectTaskContainer.prepend(icon);
    projectTaskContainer.appendChild(deleteIcon);
    projectsSection.appendChild(projectTaskContainer);
  });
}

function createProject(project) {
  const projectTaskContainer = document.createElement("div");
  projectTaskContainer.textContent = `${project}`;
  projectTaskContainer.classList.add(`${encodeClassName(project)}`, "flexbox");
  return projectTaskContainer;
}

export function onProjectSidebarClick(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${encodeClassName(project)}`)) {
      const projectArr = getCurrentProjects();
      renderTasks(projectArr[project]);
      renderedProject = project;

      //Make the clicked project and it's svg color red and background color a softer red
      if (sidebar.querySelector(".active-sidebar-project")) {
        sidebar
          .querySelector(".active-sidebar-project")
          .classList.remove("active-sidebar-project");
      }
      e.target.classList.add("active-sidebar-project");
      renderActiveProjectName(renderedProject);

      const taskSections = ["Completed", "Today", "Upcomming"];
      if (taskSections.includes(project)) {
        addTaskBtnMain.style.display = "none";
      } else {
        addTaskBtnMain.style.display = "flex";
      }

      //Change selected input option when user clicks another project
      updateSelectedOption();
    }
  });
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

//Add form select input options, dynamically, this should be called when adding new projects
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

//Modify and use the renderedProject variable

export function renderActiveProjectName(activeProject) {
  activeProjectName.textContent = activeProject;
}

export function resetRenderedProject() {
  renderedProject = "Inbox";
}

export function getRenderedProject() {
  return renderedProject;
}
