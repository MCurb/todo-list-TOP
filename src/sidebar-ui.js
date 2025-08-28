import { getCurrentProjects } from "./categorize-tasks";

const sidebar = document.querySelector(".sidebar");

export function renderProjects() {
    Object.keys(getCurrentProjects()).forEach((project) => {
        const projectContainer = document.createElement("div");
        projectContainer.textContent = `${project}`;
        sidebar.append(projectContainer)
    })
}