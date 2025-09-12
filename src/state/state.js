import { parseISO } from "date-fns";
import { Task } from "../tasks/task-object";

// --- Module state ---

//tasks array that holds all task objects
let tasks = [];

//projects object that holds all the array projects
let currentProjects = {
  Inbox: [],
  Today: [],
  Upcomming: [],
  Completed: [],
};

// ========================
// PUBLIC API (exports)
// ========================

export function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("projects", JSON.stringify(currentProjects));
}

export function loadData() {
  const storedTasks = localStorage.getItem("tasks");
  const storedProjects = localStorage.getItem("projects");

  if (storedTasks) {
    let savedTasks = JSON.parse(storedTasks);
    tasks.length = 0; // clear existing array
    tasks.push(
      ...savedTasks.map(
        (taskObj) =>
          new Task(
            taskObj.checkboxStatus,
            parseISO(taskObj.date),
            taskObj.description,
            taskObj.project,
            taskObj.priority,
            taskObj.id
          )
      )
    );
  }
  if (storedProjects) {
    const parsedProjects = JSON.parse(storedProjects);

    // Reset currentProjects completely
    for (const key in currentProjects) {
      // Important for safety
      if (Object.prototype.hasOwnProperty.call(currentProjects, key)) {
        delete currentProjects[key];
      }
    }

    // Rebuild from parsedProjects
    for (let projectName in parsedProjects) {
      currentProjects[projectName] = parsedProjects[projectName].map(
        (taskObj) =>
          new Task(
            taskObj.checkboxStatus,
            parseISO(taskObj.date),
            taskObj.description,
            taskObj.project,
            taskObj.priority,
            taskObj.id
          )
      );
    }
  }
}

export function getCurrentProjects() {
  return currentProjects;
}

export function getCurrentTasks() {
  return tasks;
}
