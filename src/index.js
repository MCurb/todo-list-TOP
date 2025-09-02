import "./styles.css";

import { Task } from "./task-object";

import { newProject } from "./projects";

import { newTask } from "./tasks";

import {
  renderTasks,
  getTaskFormData,
  getProjectFormData,
  taskActionHandler,
  editFormHandler,
} from "./dom";

import {
  renderProjects,
  getRenderedProject,
  onProjectSidebarClick,
  dynamicProjectSelector,
} from "./sidebar-ui";

//Not so important now:
import { getCurrentProjects, getCurrentTasks } from "./state";

newProject("Home");
newProject("Work");

// Init
renderProjects();
renderTasks(getCurrentProjects()[getRenderedProject()]);

const sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("click", onProjectSidebarClick);

const taskForm = document.querySelector(".task-form");

taskForm.addEventListener("submit", taskFormHandler);
function taskFormHandler(e) {
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
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}

const editTaskForm = document.querySelector(".edit-task-form");
editTaskForm.addEventListener("submit", editFormHandler);

const tasksContainer = document.querySelector(".tasks-div");
tasksContainer.addEventListener("click", taskActionHandler);

const addProjectBtn = document.querySelector(".add-project");
const newProjectForm = document.querySelector(".new-project-form");
addProjectBtn.addEventListener("click", eventHandler);
function eventHandler(e) {
  if (e.target.matches(".material-symbols-outlined")) {
    document.querySelector(".add-project").after(newProjectForm);
    newProjectForm.style.display = "block";
  }
}

newProjectForm.addEventListener("submit", newProjectFormData);
function newProjectFormData(e) {
  e.preventDefault();
  const newProjectData = getProjectFormData();
  newProject(newProjectData.projectName);
  newProjectForm.style.display = "none";
  renderProjects();
}

const editSelectProject = document.querySelector(".select-project-edit");
const selectProject = document.querySelector(".select-project");
dynamicProjectSelector(selectProject);
dynamicProjectSelector(editSelectProject);
