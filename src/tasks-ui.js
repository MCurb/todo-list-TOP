import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { findCorrectCategory } from "./categorize-tasks";
import { eraseTaskFromEverywhere } from "./tasks";
import { getRenderedProject } from "./sidebar-ui";
import { format, parseISO } from "date-fns";

// ========================
// PUBLIC API (exports)
// ========================

// Rendering

export function renderTasks(currentTasksArray) {
  const tasksContainer = document.querySelector(".tasks-div");

  tasksContainer.innerHTML = "";
  currentTasksArray.forEach((task) => {
    const taskContainer = createTaskContent(task);

    tasksContainer.append(taskContainer);
  });
}


// ========================
// PRIVATE HELPERS
// ========================

//Create the task content and append it to container

function createTaskContent(task) {
  const taskCheckbox = createTaskCheckbox(task);
  updateUiCheckbox(task, taskCheckbox);

  const taskDate = createTaskDate(task);

  const taskTitle = createTaskTitle(task);

  const taskEditBtn = createEditTaskBtn(task);

  const taskDelete = createTaskDeleteBtn(task);

  const taskContainer = createTaskContainer(task);

  taskContainer.append(
    taskCheckbox,
    taskDate,
    taskTitle,
    taskEditBtn,
    taskDelete
  );

  return taskContainer;
}

function createTaskCheckbox(task) {
  const taskCheckbox = document.createElement("div");
  taskCheckbox.setAttribute("data-task-id", `${task.id}`);
  taskCheckbox.classList.add("checkbox");
  return taskCheckbox;
}

function updateUiCheckbox(task, taskCheckbox) {
  if (task.checkboxStatus) {
    taskCheckbox.classList.add("checked");
  } else {
    taskCheckbox.classList.remove("checked");
  }
}

function createTaskDate(task) {
  const taskDueDate = document.createElement("p");
  taskDueDate.classList.add("task-date");
  taskDueDate.textContent = `Due: ${format(task.date, "MMM d")}`;
  return taskDueDate;
}

function createTaskTitle(task) {
  const taskTitle = document.createElement("p");
  taskTitle.classList.add("task-title");
  taskTitle.textContent = task.description;
  return taskTitle;
}

function createTaskDeleteBtn(task) {
  const taskDelete = document.createElement("span");
  taskDelete.setAttribute("data-task-id", `${task.id}`);
  taskDelete.classList.add("task-delete", "material-symbols-outlined");
  taskDelete.textContent = "delete";
  return taskDelete;
}

function createEditTaskBtn(task) {
  const taskEditBtn = document.createElement("span");
  taskEditBtn.setAttribute("data-task-id", `${task.id}`);
  taskEditBtn.classList.add("task-edit-btn", "material-symbols-outlined");
  taskEditBtn.textContent = "edit";
  return taskEditBtn;
}

function createTaskContainer(task) {
  const taskContent = document.createElement("div");
  taskContent.setAttribute("data-task-content-id", `${task.id}`);
  taskContent.classList.add("task-details-container");
  return taskContent;
}