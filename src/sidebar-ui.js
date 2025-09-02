import { getCurrentProjects } from "./state";

import { renderTasks } from "./dom";

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");

const taskCategoryContainer = document.querySelector(".task-categories");
const projectsSection = document.querySelector(".projects");

let renderedProject = "Inbox";

export function renderProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const projectTaskContainer = document.createElement("div");
    projectTaskContainer.textContent = `${project}`;
    projectTaskContainer.classList.add(`${project}`, "flexbox");
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");

    if (taskCategoryContainer.querySelector(`.${project}`) || projectsSection.querySelector(`.${project}`)) {
      return;
    }

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
    } else {
      icon.textContent = "folder";
      projectsSection.appendChild(projectTaskContainer)
    }
    projectTaskContainer.prepend(icon);
  });
}

export function onProjectSidebarClick(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${project}`)) {
      const projectArr = getCurrentProjects();
      renderTasks(projectArr[project]);
      renderedProject = project;
      //Change selected input option when user clicks another project
      dynamicDefaultProject(selectProject);
      dynamicDefaultProject(editSelectProject);
      console.log(renderedProject);
    }
  });
}

//Update default select option from forms when changing projects
function dynamicDefaultProject(selectProjectForm) {
  for (const option of selectProjectForm.options) {
    if (option.value === getRenderedProject()) {
      option.selected = true;
    }
  }
}

//Add form select input options, dynamically, this should be called when adding new projects
export function dynamicProjectSelector(selectProjectForm) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (
      project !== "Today" &&
      project !== "Upcomming" &&
      project !== "Completed"
    ) {
      const newOption = document.createElement("option");
      newOption.value = `${project}`;
      newOption.textContent = `${project}`;
      selectProjectForm.append(newOption);
    }
  });
}

export function getRenderedProject() {
  return renderedProject;
}
