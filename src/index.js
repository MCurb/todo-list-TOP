import "./styles.css";
import { setupTaskListeners } from "./tasks-listeners";
import {
  getRenderedProject,
  setActiveSidebarProject,
  setupSidebarListeners,
} from "./sidebar-ui";
import {
  renderDefaultProjects,
  renderCustomProjects,
  setupProjectListeners, populateProjectSelectors
} from "./projects-ui";
import { renderTasks } from "./tasks-ui";
import { findCorrectCategory } from "./categorize-tasks";
import { getCurrentProjects, loadData } from "./state";

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
