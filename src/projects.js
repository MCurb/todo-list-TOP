import { getCurrentProjects } from "./state";

export function newProject(projectName) {
  if(getCurrentProjects().hasOwnProperty(`${projectName}`)) {
    return false
  } else {
    getCurrentProjects()[projectName] = [];
    return true
  }
  
}

export function eraseProject(
  keyToRemove,
  currentProjects = getCurrentProjects()
) {
  delete currentProjects[keyToRemove];
}
