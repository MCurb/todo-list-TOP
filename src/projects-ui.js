import { encodeClassName, decodeClassName } from "./utils";
import { newProject, eraseProject } from "./projects";
import { getCurrentProjects, saveData } from "./state";
import {
  getRenderedProject,
  resetRenderedProject,
  setActiveSidebarProject,
  renderActiveProjectName,
} from "./sidebar-ui";
import { renderTasks } from "./tasks-ui";

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

export function renderDefaultProjects() {
  const taskCategoryContainer = document.querySelector(".task-categories");

  Object.keys(getCurrentProjects()).forEach((project) => {
    const taskSections = ["Inbox", "Completed", "Today", "Upcomming"];
    if (!taskSections.includes(project)) {
      return;
    }
    const projectTaskContainer = createProject(project);

    const icon = createSvgIcon();
    setProjectIcon(project, icon);

    projectTaskContainer.prepend(icon);

    taskCategoryContainer.appendChild(projectTaskContainer);
  });
}

export function renderCustomProjects() {
  const projectsSection = document.querySelector(".projects");

  Object.keys(getCurrentProjects()).forEach((project) => {
    const taskSections = ["Inbox", "Completed", "Today", "Upcomming"];
    if (
      projectsSection.querySelector(`.${encodeClassName(project)}`) ||
      taskSections.includes(project)
    ) {
      return;
    }

    const projectTaskContainer = createProject(project);

    const folderIcon = createSvgIcon();
    folderIcon.textContent = "folder";

    const deleteIcon = createSvgIcon();
    deleteIcon.classList.add("delete-project");
    deleteIcon.textContent = "delete";
    deleteIcon.style.marginLeft = "auto";

    projectTaskContainer.prepend(folderIcon);
    projectTaskContainer.appendChild(deleteIcon);
    projectsSection.appendChild(projectTaskContainer);
  });
}

// ========================
// PRIVATE HELPERS
// ========================

function createProject(project) {
  const projectTaskContainer = document.createElement("div");
  projectTaskContainer.textContent = `${project}`;
  projectTaskContainer.classList.add(`${encodeClassName(project)}`, "flexbox");
  return projectTaskContainer;
}

function createSvgIcon() {
  const icon = document.createElement("span");
  icon.classList.add("material-symbols-outlined");
  return icon;
}

function setProjectIcon(project, projecIcon) {
  switch (project) {
    case "Inbox":
      projecIcon.textContent = "inbox";
      break;
    case "Completed":
      projecIcon.textContent = "check_circle";
      break;
    case "Today":
      projecIcon.textContent = "today";
      break;
    case "Upcomming":
      projecIcon.textContent = "calendar_month";
      break;

    default:
      break;
  }
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
function updateSelectInputs() {
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

//Project Event Listeners

const addProjectBtn = document.querySelector(".add-project");
const projectsSection = document.querySelector(".projects");

//Project Form
const newProjectForm = document.querySelector(".new-project-form");
const cancelProjectBtn = document.querySelector(".cancel-project-btn");

export function setupProjectListeners() {
  //Add Project
  addProjectBtn.addEventListener("click", handleAddProjectClicks);

  //Delete Project
  projectsSection.addEventListener("click", handleDeleteProjectClicks);

  //Project Form
  newProjectForm.addEventListener("submit", handleProjectFormSubmit);
  cancelProjectBtn.addEventListener("click", handleProjectFormCancel);
}

// Hanlder Functions

//Add Project
function handleAddProjectClicks(e) {
  if (e.target.matches(".material-symbols-outlined")) {
    document.querySelector(".add-project").after(newProjectForm);
    newProjectForm.style.display = "grid";
    newProjectForm.querySelector(".project-name-input").focus();
  }
}

//Delete Project
function handleDeleteProjectClicks(e) {
  if (e.target.classList.contains("delete-project")) {
    eraseProject(decodeClassName(e.target.parentElement.classList[0]));
    e.target.parentElement.remove();
    resetRenderedProject();
    renderTasks(getCurrentProjects()[getRenderedProject()]);
    setActiveSidebarProject(document.querySelector(".Inbox"));
    renderActiveProjectName("Inbox");

    updateSelectInputs();
  }
}

// Project Form

function handleProjectFormSubmit(e) {
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

function handleProjectFormCancel() {
  newProjectForm.style.display = "none";
  document.querySelector(".project-name-input").value = "";
}

function getProjectFormData() {
  const projectName = document.querySelector(".project-name-input").value;

  return {
    projectName: projectName,
  };
}
