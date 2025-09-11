import "./styles.css";

import {
  renderDefaultProjects,
  renderCustomProjects,
  setupProjectListeners,
} from "./projects-ui";

import { renderTasks, setupTaskListeners } from "./tasks-ui";

import {
  getRenderedProject,
  populateProjectSelectors,
  setActiveSidebarProject,
  setupSidebarListeners,
} from "./sidebar-ui";

import { getCurrentProjects, loadData } from "./state";
import { findCorrectCategory } from "./categorize-tasks";

function initApp() {
  // Load & render
  loadData();
  findCorrectCategory();
  renderDefaultProjects();
  renderCustomProjects();
  renderTasks(getCurrentProjects()[getRenderedProject()]);
  setActiveSidebarProject(document.querySelector(".Inbox"));
  populateProjectSelectors();

  // Setup listeners
  setupSidebarListeners();
  setupTaskListeners();
  setupProjectListeners();
}

initApp();
