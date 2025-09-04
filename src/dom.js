import { findCorrectCategory } from "./categorize-tasks";

import { getCurrentProjects, getCurrentTasks } from "./state";

import { eraseTaskFromEverywhere } from "./tasks";
import { getRenderedProject } from "./sidebar-ui";
import { format, parseISO } from "date-fns";

const tasksContainer = document.querySelector(".tasks-div");

const editTaskForm = document.querySelector(".edit-task-form");

const editTitle = document.querySelector(".title-edit-input");
const editDueDate = document.querySelector(".date-edit-input");
const editSelectProject = document.querySelector(".select-project-edit");
const editSelectPriority = document.querySelector(".select-priority-edit");

export function renderTasks(currentTasksArray) {
  tasksContainer.innerHTML = "";
  currentTasksArray.forEach((task) => {
    const taskCheckbox = createTaskCheckbox(task);
    updateUiCheckbox(task, taskCheckbox);

    const taskDelete = createTaskDeleteBtn(task);

    const taskEditBtn = createEditTaskBtn(task);

    const taskTitle = document.createElement("p");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.description;

    const taskDueDate = document.createElement("p");
    taskDueDate.classList.add("task-date")
    taskDueDate.textContent = `Due: ${format(task.date, "MMM d")}`;

    const taskContent = document.createElement("div");
    taskContent.setAttribute("data-task-content-id", `${task.id}`);
    taskContent.classList.add("task-details-container")
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

//Event Listener Function Handlers

export function taskActionHandler(e) {
  if (e.target.classList.contains("checkbox")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      task.checkboxStatus = !task.checkboxStatus;
      findCorrectCategory();
      tasksContainer.innerHTML = "";
      renderTasks(getCurrentProjects()[getRenderedProject()]);

      console.log(getCurrentTasks());
      console.log(getCurrentProjects());
    }
  } else if (e.target.classList.contains("task-delete")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      eraseTaskFromEverywhere(task.id);
      tasksContainer.innerHTML = "";
      renderTasks(getCurrentProjects()[getRenderedProject()]);

      console.log(getCurrentTasks());
      console.log(getCurrentProjects());
    }
  } else if (e.target.classList.contains("task-edit-btn")) {
    const task = getTaskByElementId(e.target, "taskId");
    if (task) {
      //Make a form appear at the same place the task content was
      document
        .querySelector(`[data-task-content-id="${task.id}"]`)
        .insertAdjacentElement("afterend", editTaskForm);
      editTaskForm.setAttribute("data-task-form-id", `${task.id}`);
      editTaskForm.style.display = "block";
      //Make the task content disappear
      document.querySelector(`[data-task-content-id="${task.id}"]`).remove();

      //The form inputs, should contain the values that the current task object has
      populateEditForm(task);
    }
  }
}

export function editFormHandler(e) {
  e.preventDefault();
  updateTaskObj();
  editTaskForm.style.display = "none";
  tasksContainer.innerHTML = "";
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  console.log(getCurrentTasks());
  console.log(getCurrentProjects());
}

//Helper Functions

export function getProjectFormData() {
  const projectName = document.querySelector(".project-name-input").value;

  return {
    projectName: projectName,
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

function updateUiCheckbox(task, taskCheckbox) {
  if (task.checkboxStatus) {
    taskCheckbox.classList.add("checked");
  } else {
    taskCheckbox.classList.remove("checked");
  }
}

function createTaskDeleteBtn(task) {
  const taskDelete = document.createElement("span");
  taskDelete.setAttribute("data-task-id", `${task.id}`);
  taskDelete.classList.add("task-delete", "material-symbols-outlined");
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
  const taskEditBtn = document.createElement("span");
  taskEditBtn.setAttribute("data-task-id", `${task.id}`);
  taskEditBtn.classList.add("task-edit-btn", "material-symbols-outlined");
  taskEditBtn.textContent = "edit";
  return taskEditBtn;
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
  }
}

//Find the task with the same id of the DOM element
function getTaskByElementId(element, key) {
  const taskId = element.dataset[key];

  return getCurrentTasks().find((task) => task.id === taskId);
}
