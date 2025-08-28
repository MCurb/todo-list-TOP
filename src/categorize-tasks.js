import { isToday, isFuture, isPast } from "date-fns";
import { eraseTaskFromProjects } from "./tasks";

//tasks array that holds all task objects
let tasks = [];

//projects object that holds all the array projects
let currentProjects = {
  "Completed": [],
  "Today": [],
  "Upcomming": [],
};

//function that loops through the task objects
//then loops though each object with an inner loop looking for important properties like date, project and priority
//then adds each task object to all the categories that match those property values
export function findCorrectCategory() {
  tasks.forEach((task) => {
    ["checkboxStatus", "project", "date"].forEach((prop) => {
      if (prop === "checkboxStatus") {
        categorizeByCompletion(task, currentProjects);
      } else if (prop === "project") {
        categorizeByProject(task, currentProjects);
      } else if (prop === "date") {
        categorizeByDate(task, currentProjects);
      }
    });
  });
}

function categorizeByProject(task, currentProjects) {
  const key = task["project"];
  if (
    isTaskPresent(task, currentProjects[key]) ||
    task["checkboxStatus"] ||
    actuallyPast(task)
  ) {
    return;
  }
  currentProjects[key].push(task);
}

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
  } else if (actuallyPast(task)) {
    console.log("You can only plan the present and future son");
  }
}

function categorizeByCompletion(task, currentProjects) {
  if (task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
    currentProjects["Completed"].push(task);
  } else if (!task["checkboxStatus"]) {
    eraseTaskFromProjects(task.id);
  }
}

function isTaskPresent(task, currentProject) {
  return currentProject.includes(task);
}

export function getCurrentProjects() {
  return currentProjects;
}

export function getCurrentTasks() {
  return tasks;
}

export function actuallyPast(task) {
  if (!isToday(task["date"]) && isPast(task["date"])) {
    return true;
  } else {
    return false;
  }
}
