import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { eraseTaskFromEverywhere } from "./tasks";

// --- Module state ---
const projects = getCurrentProjects();
const tasksArray = getCurrentTasks();

// ========================
// PUBLIC API (exports)
// ========================

export function newProject(projectName) {
  if(projects.hasOwnProperty(`${projectName}`)) {
    return false
  } else {
    projects[projectName] = [];
    saveData()
    return true
  }
  
}

//Erase projects and its tasks
export function eraseProject(
  projectToRemove,
  currentProjects = getCurrentProjects()
) {
  deleteTasksByProject(projectToRemove);
  delete currentProjects[projectToRemove];
  saveData()
}

// ========================
// PRIVATE HELPERS
// ========================

//Delete project tasks from everywhere
function deleteTasksByProject(projectToRemove) {
for (let i = tasksArray.length - 1; i >= 0; i--) {
    if(tasksArray[i].project === projectToRemove) {
      eraseTaskFromEverywhere(tasksArray[i].id)
    }
  }
}