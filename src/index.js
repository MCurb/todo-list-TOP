import "./styles.css";

import { Task } from "./task-object";

import { newProject, eraseProject } from "./projects";

import { newTask, eraseTaskFromEverywhere } from "./tasks";

import { renderTasks } from "./dom";

import { renderProjects, getRenderedProject } from "./sidebar-ui";

import { parseISO } from "date-fns";

//Not so important now:
import { getCurrentProjects, getCurrentTasks } from "./categorize-tasks";

newProject("Home");
newProject("Work");


// Init
renderProjects();

const editSelectProject = document.querySelector(".select-project-edit");


const taskTitle = document.querySelector(".title-input");
const dueDate = document.querySelector(".date-input");
const selectProject = document.querySelector(".select-project");
const selectPriority = document.querySelector(".select-priority");
const taskForm = document.querySelector(".task-form");

const tasksContainer = document.querySelector(".tasks-div");

taskForm.addEventListener("submit", handleFormData);

function handleFormData(e) {
  e.preventDefault();
  newTask(
    new Task(
      false,
      parseISO(dueDate.value),
      taskTitle.value,
      selectProject.value,
      selectPriority.value,
      crypto.randomUUID()
    )
  );

  renderTasks(getCurrentProjects()[getRenderedProject()]);
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}

function dynamicProjectSelector(selectProjectForm) {
  Object.keys(getCurrentProjects()).forEach((project) => {
    if (
      project !== "Today" &&
      project !== "Upcomming" &&
      project !== "Completed"
    ) {
      const newOption = document.createElement("option");
      newOption.value = `${project}`;
      newOption.textContent = `${project}`;
      selectProjectForm.append(newOption);
    }
  });
}
dynamicProjectSelector(selectProject);
dynamicProjectSelector(editSelectProject)

export function dynamicDefaultProject(selectProjectForm) {
  for (const option of selectProjectForm.options) {
    if (option.value === getRenderedProject()) {
      option.selected = true;
    }
  }
}
