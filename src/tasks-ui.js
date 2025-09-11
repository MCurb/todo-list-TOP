import { eraseTaskFromEverywhere, newTask } from "./tasks";
import { format, parseISO } from "date-fns";
import { Task } from "./task-object";

import {
  getRenderedProject,
  populateProjectSelectors,
  updateSelectInputs,
  renderActiveProjectName,
  resetRenderedProject,
  setActiveSidebarProject,
  setupSidebarListeners,
} from "./sidebar-ui";

import { decodeClassName } from "./utils";

//Not so important now:
import {
  getCurrentProjects,
  getCurrentTasks,
  loadData,
  saveData,
} from "./state";
import { findCorrectCategory } from "./categorize-tasks";

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

// Task Event Listeners

const formDialogContainer = document.querySelector(
  ".task-form-dialog-container"
);
const addTaskSidebar = document.querySelector(".add-task-btn-sidebar");
const addTaskBtnMain = document.querySelector(".add-task-btn-main");

//Task Content
const tasksContainer = document.querySelector(".tasks-div");

// Dialog Form
const taskDialogForm = document.querySelector(".task-form-dialog");
const cancelDialogBtn = document.querySelector(".cancel-btn-dialog");

// Main Form
const taskForm = document.querySelector(".task-form");
const cancelBtn = document.querySelector(".cancel-btn");

// Edit Form
const editTaskForm = document.querySelector(".edit-task-form");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");

const editTitle = document.querySelector(".title-edit-input");
const editDueDate = document.querySelector(".date-edit-input");
const editSelectProject = document.querySelector(".select-project-edit");
const editSelectPriority = document.querySelector(".select-priority-edit");

export function setupTaskListeners() {
  formDialogContainer.addEventListener("click", handleDialogClicks);

  addTaskSidebar.addEventListener("click", handleAddTaskSidebarBtn);
  addTaskBtnMain.addEventListener("click", handleAddTaskMainBtn);

  //Task Content
  tasksContainer.addEventListener("click", handleTaskActionClicks);

  //Dialog Form
  taskDialogForm.addEventListener("submit", handleDialogFormSubmit);
  cancelDialogBtn.addEventListener("click", handleDialogFormCancel);

  //Main Form
  taskForm.addEventListener("submit", handleMainFormSubmit);
  cancelBtn.addEventListener("click", handleMainFormCancel);

  //Edit Form
  editTaskForm.addEventListener("submit", handleEditFormSubmit);
  cancelEditBtn.addEventListener("click", handleEditFormCancel);
}

//Handler functions

function handleDialogClicks(e) {
  if (e.target.classList.contains("task-form-dialog-container")) {
    formDialogContainer.close();
    taskDialogForm.style.display = "none";
    formDialogContainer.style.display = "none";
    taskDialogForm.querySelector(".select-priority-dialog").value = "Medium";
    taskDialogForm.querySelector(".title-input-dialog").value = "";
  }
}

function handleAddTaskSidebarBtn() {
  taskDialogForm.style.display = "grid";
  formDialogContainer.style.display = "flex";
  formDialogContainer.showModal();
  taskDialogForm.querySelector(".title-input-dialog").focus();
}

function handleAddTaskMainBtn() {
  addTaskBtnMain.insertAdjacentElement("afterend", taskForm);
  taskForm.style.display = "grid";
  addTaskBtnMain.style.display = "none";
  taskForm.querySelector(".title-input").focus();
}

//Task Content
function handleTaskActionClicks(e) {
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

//Helpers

function populateEditForm(task) {
  editTitle.value = task.description;
  editDueDate.value = format(task.date, "yyyy-MM-dd");
  editSelectProject.value = task.project;
  editSelectPriority.value = task.priority;
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

// Dialog Form
function handleDialogFormSubmit(e) {
  e.preventDefault();
  const taskData = getDialogFormData();
  newTask(
    new Task(
      false,
      taskData.dueDate,
      taskData.title,
      taskData.project,
      taskData.priority,
      taskData.id
    )
  );
  saveData();
  formDialogContainer.close();
  taskDialogForm.style.display = "none";
  formDialogContainer.style.display = "none";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  taskDialogForm.querySelector(".title-input-dialog").value = "";
  taskDialogForm.querySelector(".select-priority-dialog").value = "Medium";
}

function handleDialogFormCancel() {
  formDialogContainer.close();
  taskDialogForm.style.display = "none";
  formDialogContainer.style.display = "none";
  taskDialogForm.querySelector(".select-priority-dialog").value = "Medium";
  taskDialogForm.querySelector(".title-input-dialog").value = "";
}

function getDialogFormData() {
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

//Main Form
function handleMainFormSubmit(e) {
  e.preventDefault();
  const taskData = getTaskFormData();
  newTask(
    new Task(
      false,
      taskData.dueDate,
      taskData.title,
      taskData.project,
      taskData.priority,
      taskData.id
    )
  );
  saveData();
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  taskForm.querySelector(".title-input").value = "";
  taskForm.querySelector(".select-priority").value = "Medium";
  taskForm.querySelector(".title-input").focus();
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}

function handleMainFormCancel() {
  taskForm.style.display = "none";
  addTaskBtnMain.style.display = "flex";

  // Reset form values
  taskForm.querySelector(".title-input").value = "";
  taskForm.querySelector(".date-input").value = "";
  taskForm.querySelector(".select-priority").value = "Medium";
}

//Helper

function getTaskFormData() {
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

//Edit Form
function handleEditFormSubmit(e) {
  e.preventDefault();
  updateTaskObj();
  editTaskForm.style.display = "none";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
}

function handleEditFormCancel() {
  editTaskForm.style.display = "none";
  tasksContainer.innerHTML = "";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
}

//Helper

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
