import { findCorrectCategory, eraseTaskFromProjects } from "./categorize-tasks";

import { getCurrentTasks, saveData } from "./state";

import { isToday, isPast } from "date-fns";

// ========================
// PUBLIC API (exports)
// ========================

export function newTask(task) {
  if (actuallyPast(task)) {
    return;
  }
  getCurrentTasks().push(task);
  findCorrectCategory();
  saveData();
}

export function eraseTaskFromEverywhere(
  taskId,
  currentTasks = getCurrentTasks()
) {
  for (let i = currentTasks.length - 1; i >= 0; i--) {
    if (currentTasks[i].id === taskId) {
      currentTasks.splice(i, 1);
    }
  }
  eraseTaskFromProjects(taskId);
  saveData();
}

// ========================
// PRIVATE HELPERS
// ========================

function actuallyPast(task) {
  if (!isToday(task["date"]) && isPast(task["date"])) {
    return true;
  } else {
    return false;
  }
}