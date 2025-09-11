import { getCurrentProjects, getCurrentTasks, saveData } from "./state";
import { findCorrectCategory } from "./categorize-tasks";
import { eraseTaskFromEverywhere } from "./tasks";
import { getRenderedProject } from "./sidebar-ui";
import { format, parseISO } from "date-fns";
import { renderTasks } from "./tasks-ui";

// --- Cached DOM elements (static ones) ---

const editTaskForm = document.querySelector(".edit-task-form");

const editTitle = document.querySelector(".title-edit-input");
const editDueDate = document.querySelector(".date-edit-input");
const editSelectProject = document.querySelector(".select-project-edit");
const editSelectPriority = document.querySelector(".select-priority-edit");

// ========================
// PUBLIC API (exports)
// ========================

// State

export function getProjectFormData() {
  const projectName = document.querySelector(".project-name-input").value;

  return {
    projectName: projectName,
  };
}





// ========================
// EVENT HANDLERS
// ========================





// ========================
// PRIVATE HELPERS
// ========================








