import "./styles.css";

import { Task } from "./task-object"

import { newProject, eraseProject } from "./projects";

import { newTask, eraseTaskFromEverywhere } from "./tasks";

//Not so important now:
import { getCurrentProjects, getCurrentTasks } from "./categorize-tasks";

newProject("Home");
newProject("Work");
newProject("Today");
newProject("Upcomming");
newProject("Completed");

newTask(
  new Task(
    true,
    new Date(),
    "do my homework",
    "Home",
    "High",
    crypto.randomUUID()
  )
);

newTask(
  new Task(
    false,
    new Date(),
    "do this today1",
    "Home",
    "High",
    crypto.randomUUID()
  )
);
newTask(
  new Task(
    true,
    new Date("2024-12-24"),
    "do this today2",
    "Work",
    "High",
    crypto.randomUUID()
  )
);

console.log(getCurrentProjects());
console.log(getCurrentTasks());

eraseTaskFromEverywhere(getCurrentTasks()[1].id);
eraseProject("Work")
console.log(getCurrentProjects());
console.log(getCurrentTasks());
