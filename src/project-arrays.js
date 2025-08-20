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
  };

  //function that loops through the task objects
  //then loops though each object with an inner loop looking for important properties like date, project and priority
  //then adds each task object to all the categories that match those property values
  const findCorrectCategory = () => {
    tasks.forEach((task) => {
      categorizeByProject(task, currentProjects);
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
    getCurrentProjects,
    getCurrentTasks,
  };
})();

function categorizeByProject(currentTask, currentProjects) {
  ["project"].forEach((prop) => {
    const key = currentTask[prop];
    currentProjects[key].push(currentTask);
  });
}
