import "./styles.css";

import { Task } from "./task-objects";

import { categorize } from "./project-arrays";

categorize.newProject("Today");
categorize.newProject("Home");

categorize.newTask(new Task(false, "do my homework", "Home", "High"));

categorize.newTask(new Task(false, "do my homework", "Today", "High"));

categorize.findCorrectCategory();
console.log(categorize.getCurrentProjects());
console.log(categorize.getCurrentTasks());
