import { getCurrentProjects } from "./categorize-tasks";

export function newProject(projectName) {
  getCurrentProjects()[projectName] = [];
};

export function eraseProject(
  keyToRemove,
  currentProjects = getCurrentProjects()
) {
  delete currentProjects[keyToRemove];
}
