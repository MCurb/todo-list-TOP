import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { eraseTaskFromEverywhere } from "./tasks";

export function newProject(projectName) {
  if(getCurrentProjects().hasOwnProperty(`${projectName}`)) {
    return false
  } else {
    getCurrentProjects()[projectName] = [];
    saveData()
    return true
  }
  
}

export function eraseProject(
  keyToRemove,
  currentProjects = getCurrentProjects()
) {
  for (let i = getCurrentTasks().length - 1; i >= 0; i--) {
    if(getCurrentTasks()[i].project === keyToRemove) {
      eraseTaskFromEverywhere(getCurrentTasks()[i].id)
    }
  }
  delete currentProjects[keyToRemove];
  saveData()
}
