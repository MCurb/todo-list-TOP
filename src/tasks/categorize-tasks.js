import { isToday, isFuture } from "date-fns";
import { getCurrentProjects, getCurrentTasks, saveData } from "../state/state";

// --- Module state ---
const projectList = getCurrentProjects();
const activeTasks = getCurrentTasks();


// ========================
// PUBLIC API (exports)
// ========================

//Loop through each task and categorize them by completion, project type and date
export function findCorrectCategory() {
  activeTasks.forEach((task) => {
    ["checkboxStatus", "project", "date"].forEach((prop) => {
      if (prop === "checkboxStatus") {
        categorizeByCompletion(task, projectList);
      } else if (prop === "project") {
        categorizeByProject(task, projectList);
      } else if (prop === "date") {
        categorizeByDate(task, projectList);
      }
      saveData()
    });
  });
}

//Erase the given task from every project it is in
export function eraseTaskFromProjects(
  taskId,
  currentProjects = getCurrentProjects()
) {
  Object.keys(currentProjects).forEach((project) => {
    const projectArr = currentProjects[project];
    if(projectArr.length === 0) {
      return
    }

    for (let i = projectArr.length - 1; i >= 0; i--) {
      if (projectArr[i].id === taskId) {
        projectArr.splice(i, 1);
        saveData()
      }
    }
  });
}

// ========================
// PRIVATE HELPERS
// ========================

//Add completed task to the completed project
//and remove it from the other projects
function categorizeByCompletion(task, currentProjects) {
  if (task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
    currentProjects["Completed"].push(task);
  } else if (!task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
  }
}


//Move task to its project container
function categorizeByProject(task, currentProjects) {
  const key = task["project"];
  if (isTaskPresent(task, currentProjects[key]) || task["checkboxStatus"]) {
    return;
  }
  currentProjects[key].push(task);
}


//Send task to related containers according to its date
function categorizeByDate(task, currentProjects) {
  if (task["checkboxStatus"]) {
    return;
  }
  if (isToday(task["date"]) && !isTaskPresent(task, currentProjects["Today"])) {
    currentProjects["Today"].push(task);
  } else if (
    isFuture(task["date"]) &&
    !isTaskPresent(task, currentProjects["Upcomming"])
  ) {
    currentProjects["Upcomming"].push(task);
  }
}

//Helper functions:

function isTaskPresent(task, currentProject) {
  return currentProject.includes(task);
}


