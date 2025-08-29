import { getCurrentProjects } from "./categorize-tasks";

import { renderTasks } from "./dom";

const sidebar = document.querySelector(".sidebar");

let renderedProject = "Inbox"

export function renderProjects() {
  Object.keys(getCurrentProjects()).forEach((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.textContent = `${project}`;
    projectContainer.classList.add(`${project}`);
    sidebar.append(projectContainer);
  });
}

sidebar.addEventListener("click", onProjectSidebarClick);

function onProjectSidebarClick(e) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (e.target.classList.contains(`${project}`)) {
      const projectArr = getCurrentProjects();
      renderTasks(projectArr[project])
      renderedProject = project;
      console.log(renderedProject)
    }
  });
}

export function getRenderedProject() {
    return renderedProject
}