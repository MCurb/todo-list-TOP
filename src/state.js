import { parseISO } from "date-fns";
import { Task } from "./task-object";

//tasks array that holds all task objects
let tasks = [];

//projects object that holds all the array projects
let currentProjects = {
  Inbox: [],
  Today: [],
  Upcomming: [],
  Completed: [],
  Work: [],
  Home: [],
};

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
    for (let projectName in currentProjects) {
      currentProjects[projectName].length = 0; // clear each project array
      const loadedTasks = JSON.parse(storedProjects)[projectName];
      currentProjects[projectName].push(
        ...loadedTasks.map(
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
  }
}

export function getCurrentProjects() {
  return currentProjects;
}

export function getCurrentTasks() {
  return tasks;
}
