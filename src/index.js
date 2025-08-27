import "./styles.css";

import { Task } from "./task-object";

import { newProject, eraseProject } from "./projects";

import { newTask, eraseTaskFromEverywhere } from "./tasks";

import { renderTasks } from "./dom";

import { parseISO } from "date-fns";

//Not so important now:
import { getCurrentProjects, getCurrentTasks } from "./categorize-tasks";

newProject("Home");
newProject("Work");
newProject("Today");
newProject("Upcomming");
newProject("Completed");

// newTask(
//   new Task(
//     true,
//     new Date(),
//     "do my homework",
//     "Home",
//     "High",
//     crypto.randomUUID()
//   )
// );

// newTask(
//   new Task(
//     false,
//     new Date(),
//     "do this today1",
//     "Home",
//     "High",
//     crypto.randomUUID()
//   )
// );
// newTask(
//   new Task(
//     true,
//     new Date("2024-12-24"),
//     "do this today2",
//     "Work",
//     "High",
//     crypto.randomUUID()
//   )
// );

// console.log(getCurrentProjects());
// console.log(getCurrentTasks());

// eraseTaskFromEverywhere(getCurrentTasks()[1].id);

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
 
  renderTasks(tasksContainer, getCurrentTasks())
  console.log(getCurrentProjects());
  console.log(getCurrentTasks());
}
