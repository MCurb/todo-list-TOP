import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { findCorrectCategory } from "./categorize-tasks";
import { eraseTaskFromEverywhere } from "./tasks";
import { getRenderedProject } from "./sidebar-ui";
import { format, parseISO } from "date-fns";

const editTaskForm = document.querySelector(".edit-task-form");

const editTitle = document.querySelector(".title-edit-input");
const editDueDate = document.querySelector(".date-edit-input");
const editSelectProject = document.querySelector(".select-project-edit");
const editSelectPriority = document.querySelector(".select-priority-edit");

export function renderTasks(currentTasksArray) {
  const tasksContainer = document.querySelector(".tasks-div");

  tasksContainer.innerHTML = "";
  currentTasksArray.forEach((task) => {
    const taskContainer = createTaskContent(task);

    tasksContainer.append(taskContainer);
  });
}

//Event Listener Function Handlers

export function taskActionHandler(e) {
  if (e.target.classList.contains("checkbox")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      task.checkboxStatus = !task.checkboxStatus;
      saveData();
      findCorrectCategory();
      renderTasks(getCurrentProjects()[getRenderedProject()]);
    }
  } else if (e.target.classList.contains("task-delete")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      eraseTaskFromEverywhere(task.id);
      renderTasks(getCurrentProjects()[getRenderedProject()]);
    }
  } else if (e.target.classList.contains("task-edit-btn")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      //Make the edit form appear at the same place of the task content
      renderEditTaskForm(task);
      //Populate edit form with the values of the current task object
      populateEditForm(task);
    }
  }
}

export function editFormHandler(e) {
  e.preventDefault();
  updateTaskObj();
  editTaskForm.style.display = "none";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
}

//Helper Functions

export function getProjectFormData() {
  const projectName = document.querySelector(".project-name-input").value;

  return {
    projectName: projectName,
  };
}

export function getDialogFormData() {
  const taskTitle = document.querySelector(".title-input-dialog").value;
  const dueDate = document.querySelector(".date-input-dialog").value;
  const selectProject = document.querySelector(".select-project-dialog").value;
  const selectPriority = document.querySelector(
    ".select-priority-dialog"
  ).value;

  return {
    title: taskTitle,
    dueDate: parseISO(dueDate),
    project: selectProject,
    priority: selectPriority,
    id: crypto.randomUUID(),
  };
}

export function getTaskFormData() {
  const taskTitle = document.querySelector(".title-input").value;
  const dueDate = document.querySelector(".date-input").value;
  const selectProject = document.querySelector(".select-project").value;
  const selectPriority = document.querySelector(".select-priority").value;

  return {
    title: taskTitle,
    dueDate: parseISO(dueDate),
    project: selectProject,
    priority: selectPriority,
    id: crypto.randomUUID(),
  };
}

function populateEditForm(task) {
  editTitle.value = task.description;
  editDueDate.value = format(task.date, "yyyy-MM-dd");
  editSelectProject.value = task.project;
  editSelectPriority.value = task.priority;
}

function updateTaskObj() {
  const task = getTaskByElementId(editTaskForm, "taskFormId");
  if (task) {
    task.description = editTitle.value;
    task.date = parseISO(editDueDate.value);
    task.project = editSelectProject.value;
    task.priority = editSelectPriority.value;
    findCorrectCategory();
    saveData();
  }
}

function renderEditTaskForm(task) {
  document
    .querySelector(`[data-task-content-id="${task.id}"]`)
    .insertAdjacentElement("afterend", editTaskForm);
  editTaskForm.setAttribute("data-task-form-id", `${task.id}`);
  editTaskForm.style.display = "grid";
  //Remove the task content
  document.querySelector(`[data-task-content-id="${task.id}"]`).remove();
}

//Find the task with the same id of the DOM element
function getTaskByElementId(element, key) {
  const taskId = element.dataset[key];

  return getCurrentTasks().find((task) => task.id === taskId);
}

//Create task content and append to container

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
