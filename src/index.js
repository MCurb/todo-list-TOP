import "./styles.css";

import { Task } from "./task-objects";

import { categorize, eraseTaskFromEverywhere, eraseProject } from "./project-arrays";

categorize.newProject("Today");
categorize.newProject("Home");
categorize.newProject("Work");
categorize.newProject("Upcomming");
categorize.newProject("Completed");

categorize.newTask(
  new Task(
    true,
    new Date(),
    "do my homework",
    "Home",
    "High",
    crypto.randomUUID()
  )
);

categorize.newTask(
  new Task(
    false,
    new Date(),
    "do this today1",
    "Home",
    "High",
    crypto.randomUUID()
  )
);

categorize.newTask(
  new Task(
    true,
    new Date("2024-12-24"),
    "do this today2",
    "Work",
    "High",
    crypto.randomUUID()
  )
);

// categorize.findCorrectCategory();
const actualProjects = categorize.getCurrentProjects();
console.log(actualProjects);
console.log(categorize.getCurrentTasks());

eraseTaskFromEverywhere(categorize.getCurrentTasks()[1].id);
eraseProject("Work")
console.log(categorize.getCurrentProjects());
console.log(categorize.getCurrentTasks());
