import { format, parseISO } from "date-fns";
import { Task } from "./task-object";
import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { findCorrectCategory } from "./categorize-tasks";
import { eraseTaskFromEverywhere, newTask } from "./tasks";
import { renderTasks } from "./tasks-ui";
import { getRenderedProject } from "./sidebar-ui";

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
