import { getCurrentProjects } from "./state";
import { encodeClassName } from "./utils";

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

