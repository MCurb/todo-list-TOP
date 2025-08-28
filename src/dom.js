import {
  getCurrentTasks,
  getCurrentProjects,
  findCorrectCategory,
} from "./categorize-tasks";

import { eraseTaskFromEverywhere } from "./tasks";
import { format } from "date-fns";

const tasksContainer = document.querySelector(".tasks-div");

const editTitle = document.querySelector(".title-edit-input");
const editDueDate = document.querySelector(".date-edit-input");
const editSelectProject = document.querySelector(".select-project-edit");
const editSelectPriority = document.querySelector(".select-priority-edit");
const editFormBtn = document.querySelector(".edit-task-form");

export function renderTasks(tasksContainer, currentTasksArray) {
  tasksContainer.innerHTML = "";
  currentTasksArray.forEach((task) => {
    const taskCheckbox = createTaskCheckbox(task);
    updateUiCheckbox(task, taskCheckbox);

    const taskDelete = createTaskDeleteBtn(task);

    const taskEditBtn = createEditTaskBtn(task);

    const taskTitle = document.createElement("p");
    taskTitle.textContent = task.description;

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = task.date;

    const taskContent = document.createElement("div");
    taskContent.setAttribute("data-task-id", `${task.id}`);
    taskContent.append(
      taskCheckbox,
      taskTitle,
      taskDueDate,
      taskEditBtn,
      taskDelete
    );

    tasksContainer.append(taskContent);
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
  } else if (e.target.classList.contains("task-edit-btn")) {
    const taskId = e.target.dataset.taskId;
    const task = getCurrentTasks().find((task) => task.id === taskId);
    if (task) {
      //Make a form appear at the same place the task content was
      document
        .querySelector(`[data-task-id="${taskId}"]`)
        .insertAdjacentElement("afterend", editFormBtn);
      editFormBtn.style.display = "block";

      //Make the task content disappear
      document.querySelector(`[data-task-id="${taskId}"]`).remove();

      //The form inputs, should contain the values that the current task object has
      refillEditForm(task);
    }
  }
});

function updateUiCheckbox(task, taskCheckbox) {
  if (task.checkboxStatus) {
    taskCheckbox.classList.add("checked");
  } else {
    taskCheckbox.classList.remove("checked");
  }
}

function createTaskDeleteBtn(task) {
  const taskDelete = document.createElement("div");
  taskDelete.setAttribute("data-task-id", `${task.id}`);
  taskDelete.classList.add("task-delete");
  taskDelete.textContent = "delete";
  return taskDelete;
}

function createTaskCheckbox(task) {
  const taskCheckbox = document.createElement("div");
  taskCheckbox.setAttribute("data-task-id", `${task.id}`);
  taskCheckbox.classList.add("checkbox");
  return taskCheckbox;
}

function createEditTaskBtn(task) {
  const taskEditBtn = document.createElement("div");
  taskEditBtn.setAttribute("data-task-id", `${task.id}`);
  taskEditBtn.classList.add("task-edit-btn");
  taskEditBtn.textContent = "Edit Task";
  return taskEditBtn;
}

function refillEditForm(task) {
  editTitle.value = task.description;
  editDueDate.value = format(task.date, "yyyy-MM-dd");
  editSelectProject.value = task.project;
  editSelectPriority.value = task.priority;
}

