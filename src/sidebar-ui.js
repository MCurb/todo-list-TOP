import { getCurrentProjects } from "./state";

import { renderTasks } from "./dom";

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");

const taskCategoryContainer = document.querySelector(".task-categories");
const projectsSection = document.querySelector(".projects");

let renderedProject = "Inbox";

//Render default projects function:
//this one is going to be called at the init, and render just the default projects

export function renderDefaultProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const projectTaskContainer = createTaskContainer(project);

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
      projectsSection.querySelector(`.${project}`) ||
      taskSections.includes(project)
    ) {
      return;
    }

    const projectTaskContainer = createTaskContainer(project);

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "folder";

    projectTaskContainer.prepend(icon);
    projectsSection.appendChild(projectTaskContainer);
  });
}

function createTaskContainer(project) {
  const projectTaskContainer = document.createElement("div");
  projectTaskContainer.textContent = `${project}`;
  projectTaskContainer.classList.add(
    `${project.replace(/ /g, "-")}`,
    "flexbox"
  );
  return projectTaskContainer;
}

export function onProjectSidebarClick(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${project.replace(/ /g, "-")}`)) {
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
    const defaultProjects = ["Today", "Upcomming", "Completed"];
    if (
      defaultProjects.includes(project) ||
      selectProjectForm.querySelector(`[value="${project}"]`)
    ) {
      return;
    }
    const newOption = document.createElement("option");
    newOption.value = `${project}`;
    newOption.textContent = `${project}`;
    selectProjectForm.append(newOption);
  });
}

export function getRenderedProject() {
  return renderedProject;
}
