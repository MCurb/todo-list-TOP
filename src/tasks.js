import { findCorrectCategory, eraseTaskFromProjects } from "./categorize-tasks";

import { getCurrentTasks } from "./state";

import { isToday, isPast } from "date-fns";

export function newTask(task) {
  if (actuallyPast(task)) {
    return;
  }
  getCurrentTasks().push(task);
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

function actuallyPast(task) {
  if (!isToday(task["date"]) && isPast(task["date"])) {
    return true;
  } else {
    return false;
  }
}
