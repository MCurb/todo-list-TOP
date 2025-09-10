import { isToday, isFuture } from "date-fns";
import { getCurrentProjects, getCurrentTasks, saveData } from "./state";

const projectList = getCurrentProjects();
const activeTasks = getCurrentTasks();

//function that loops through the task objects
//then loops though each object with an inner loop looking for important properties like date, project and priority
//then adds each task object to all the categories that match those property values
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
    });
  });
}

function categorizeByCompletion(task, currentProjects) {
  if (task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
    currentProjects["Completed"].push(task);
    saveData()
  } else if (!task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
  }
}

function categorizeByProject(task, currentProjects) {
  const key = task["project"];
  if (isTaskPresent(task, currentProjects[key]) || task["checkboxStatus"]) {
    return;
  }
  currentProjects[key].push(task);
  saveData()
}

function categorizeByDate(task, currentProjects) {
  if (task["checkboxStatus"]) {
    return;
  }
  if (isToday(task["date"]) && !isTaskPresent(task, currentProjects["Today"])) {
    currentProjects["Today"].push(task);
    saveData()
  } else if (
    isFuture(task["date"]) &&
    !isTaskPresent(task, currentProjects["Upcomming"])
  ) {
    currentProjects["Upcomming"].push(task);
    saveData()
  }
}

// If the project of the task is an unexisting project, it will throw an error
function isTaskPresent(task, currentProject) {
  return currentProject.includes(task);
}

export function eraseTaskFromProjects(
  taskId,
  currentProjects = getCurrentProjects()
) {
  console.log(taskId);
  Object.keys(currentProjects).forEach((project) => {
    const projectArr = currentProjects[project];

    for (let i = projectArr.length - 1; i >= 0; i--) {
      if (projectArr[i].id === taskId) {
        projectArr.splice(i, 1);
        saveData()
      }
    }
  });
  console.log(currentProjects);
}
