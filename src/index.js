import "./styles/styles.css";
import { loadExampleTasks, setupTaskListeners } from "./tasks/tasks-listeners";
import {
  getRenderedProject,
  setActiveSidebarProject,
  setupSidebarListeners,
} from "./sidebar/sidebar-ui";
import {
  renderDefaultProjects,
  renderCustomProjects,
  setupProjectListeners,
  populateProjectSelectors,
  loadExampleProjects,
} from "./projects/projects-ui";
import { renderTasks } from "./tasks/tasks-ui";
import { findCorrectCategory } from "./tasks/categorize-tasks";
import { getCurrentProjects, loadData } from "./state/state";

function initApp() {
  // // Load & render
  loadData();
  // Check if examples were already loaded
  const examplesLoaded = localStorage.getItem("examplesLoaded");

  if (!examplesLoaded) {
    loadExampleProjects();
    loadExampleTasks();
    localStorage.setItem("examplesLoaded", "true");
  }
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
