import {
  getCurrentTasks,
  getCurrentProjects,
  findCorrectCategory,
} from "./categorize-tasks";
import { eraseTaskFromEverywhere } from "./tasks";

const tasksContainer = document.querySelector(".tasks-div");

export function renderTasks(tasksContainer, currentTasksArray) {
  tasksContainer.innerHTML = "";
  currentTasksArray.forEach((task) => {
    const taskCheckbox = document.createElement("div");
    taskCheckbox.setAttribute("data-task-id", `${task.id}`);
    taskCheckbox.classList.add("checkbox");
    if (task.checkboxStatus) {
      taskCheckbox.classList.add("checked");
    } else {
      taskCheckbox.classList.remove("checked");
    }

    const taskDelete = document.createElement("div");
    taskDelete.setAttribute("data-task-id", `${task.id}`);
    taskDelete.classList.add("task-delete");
    taskDelete.textContent = "delete";

    const taskInfo = document.createElement("div");
    const taskTitle = document.createElement("p");
    const taskDueDate = document.createElement("p");

    taskTitle.textContent = task.description;
    taskDueDate.textContent = task.date;
    taskInfo.append(taskCheckbox, taskTitle, taskDueDate, taskDelete);
    tasksContainer.append(taskInfo);
  });
}

tasksContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const taskId = e.target.dataset.taskId;
    const task = getCurrentTasks().find((task) => task.id === taskId);
    if (task) {
      task.checkboxStatus = !task.checkboxStatus;
      findCorrectCategory();
      tasksContainer.innerHTML = "";
      renderTasks(tasksContainer, getCurrentTasks());
      console.log(getCurrentTasks());
      console.log(getCurrentProjects());
    }
  } else if (e.target.classList.contains("task-delete")) {
    const taskId = e.target.dataset.taskId;
    const task = getCurrentTasks().find((task) => task.id === taskId);
    if (task) {
      eraseTaskFromEverywhere(task.id);
      tasksContainer.innerHTML = "";
      renderTasks(tasksContainer, getCurrentTasks());
      console.log(getCurrentTasks());
      console.log(getCurrentProjects());
    }
  }
});
