import {
  findCorrectCategory,
  getCurrentTasks,
  getCurrentProjects,
} from "./categorize-tasks";

export function newTask(taskObj) {
  getCurrentTasks().push(taskObj);
  findCorrectCategory();
}

export function eraseTaskFromEverywhere(
  taskId,
  currentTasks = getCurrentTasks()
) {
  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].id === taskId) {
      currentTasks.splice(i, 1);
    }
  }
  eraseTaskFromProjects(taskId);
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
      }
    }
  });
  console.log(currentProjects);
}
