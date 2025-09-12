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

// ========================
// DOM REFERENCES
// ========================

const taskCategoryContainer = document.querySelector(".task-categories");
const projectsSection = document.querySelector(".projects");

const addProjectBtn = document.querySelector(".add-project");
const newProjectForm = document.querySelector(".new-project-form");
const cancelProjectBtn = document.querySelector(".cancel-project-btn");
const projectNameInput = document.querySelector(".project-name-input");

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

export function renderDefaultProjects() {
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

export function setupProjectListeners() {
  //Add Project
  addProjectBtn.addEventListener("click", handleAddProjectClicks);

  //Delete Project
  projectsSection.addEventListener("click", handleDeleteProjectClicks);

  //Project Form
  newProjectForm.addEventListener("submit", handleProjectFormSubmit);
  cancelProjectBtn.addEventListener("click", handleProjectFormCancel);
}

export function loadExampleProjects() {
  const exampleProjects = ["Bug Hunt", "Rubber Duck", "TOP Project"];

  exampleProjects.forEach((project) => {
    newProject(project);
  });
}

// ========================
// EVENT HANDLERS
// ========================

//Add Project
function handleAddProjectClicks(e) {
  if (e.target.matches(".material-symbols-outlined")) {
    document.querySelector(".add-project").after(newProjectForm);
    newProjectForm.style.display = "grid";
    projectNameInput.focus();
  }
}

//Delete Project
function handleDeleteProjectClicks(e) {
  if (e.target.classList.contains("delete-project")) {
    setTimeout(() => {
      eraseProject(decodeClassName(e.target.parentElement.classList[0]));
      e.target.parentElement.remove();
      resetRenderedProject();
      renderTasks(getCurrentProjects()[getRenderedProject()]);
      setActiveSidebarProject(document.querySelector(".Inbox"));
      renderActiveProjectName("Inbox");

      updateSelectInputs();
    }, 250);
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
  projectNameInput.value = "";
  projectNameInput.focus();
  console.log(getCurrentProjects());
  renderCustomProjects();
  populateProjectSelectors();
}

function handleProjectFormCancel() {
  newProjectForm.style.display = "none";
  projectNameInput.value = "";
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

function setProjectIcon(project, projectIcon) {
  const icons = {
    Inbox: "inbox",
    Completed: "check_circle",
    Today: "today",
    Upcomming: "calendar_month",
  };
  projectIcon.textContent = icons[project] || "";
}

function getProjectFormData() {
  const projectName = projectNameInput.value;

  return {
    projectName: projectName,
  };
}

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
