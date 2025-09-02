import { getCurrentProjects } from "./state";

import { renderTasks } from "./dom";

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");

const taskCategories = document.querySelector(".task-categories");
const projects = document.querySelector(".projects")

let renderedProject = "Inbox";

export function renderProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.textContent = `${project}`;
    projectContainer.classList.add(`${project}`);
    const taskContainers = ["Inbox", "Completed", "Today", "Upcomming"];
      if (taskContainers.includes(project)) {
        taskCategories.appendChild(projectContainer);
      } else {
        projects.appendChild(projectContainer)
      }
    
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
