import { isToday, isFuture, isPast } from "date-fns";
import { ta } from "date-fns/locale";

//factory function that handles array creation, and categorizing

export const categorize = (function () {
  //tasks array that holds all task objects
  let tasks = [];

  //projects object that holds all the array projects
  let currentProjects = {};

  //function that takes a project name argument
  //projectObject.nameArg = []
  const newProject = (projectName) => {
    currentProjects[projectName] = [];
  };

  //function that takes an object as arg
  //Push the object to the tasks array
  const newTask = (taskObj) => {
    tasks.push(taskObj);
    findCorrectCategory();
  };

  //function that loops through the task objects
  //then loops though each object with an inner loop looking for important properties like date, project and priority
  //then adds each task object to all the categories that match those property values
  const findCorrectCategory = () => {
    tasks.forEach((task) => {
      ["checkboxStatus", "project", "date"].forEach((prop) => {
        if (prop === "checkboxStatus") {
          categorizeByCompletion(task, currentProjects);
        }
        if (prop === "project") {
          categorizeByProject(task, currentProjects);
        } else if (prop === "date") {
          categorizeByDate(task, currentProjects);
        }
      });
    });
  };

  const getCurrentProjects = () => {
    return currentProjects;
  };

  const getCurrentTasks = () => {
    return tasks;
  };

  return {
    newProject,
    newTask,
    findCorrectCategory,
    eraseTaskFromEverywhere,
    getCurrentProjects,
    getCurrentTasks,
  };
})();

function categorizeByProject(task, currentProjects) {
  const key = task["project"];
  if (isTaskPresent(task, currentProjects[key]) || task["checkboxStatus"]) {
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
  } else {
    console.log("You can only plan the present and future son");
  }
}

function categorizeByCompletion(task, currentProjects) {
  if (task["checkboxStatus"]) {
    console.log(task);
    eraseTaskFromProjects(task.id);
    currentProjects["Completed"].push(task);
  }
}

export function eraseTaskFromEverywhere(
  taskId,
  currentTasks = categorize.getCurrentTasks()
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
  currentProjects = categorize.getCurrentProjects()
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

export function eraseProject(keyToRemove, currentProjects = categorize.getCurrentProjects()) {
  delete currentProjects[keyToRemove];
}

function isTaskPresent(task, currentProject) {
  return currentProject.includes(task);
}



