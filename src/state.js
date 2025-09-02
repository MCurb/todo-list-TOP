//tasks array that holds all task objects
let tasks = [];

//projects object that holds all the array projects
let currentProjects = {
  Inbox: [],
  Today: [],
  Upcomming: [],
  Completed: [],
};

export function getCurrentProjects() {
  return currentProjects;
}

export function getCurrentTasks() {
  return tasks;
}
