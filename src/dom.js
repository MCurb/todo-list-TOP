const taskTitle = document.querySelector(".title-input");
const dueDate = document.querySelector(".date-input");
const selectProject = document.querySelector(".select-project");
const selectPriority = document.querySelector(".select-priority");

export function getFormData() {
  return {
    taskTitle: document.querySelector(".title-input").value,
    dueDate: document.querySelector(".date-input").value,
    selectProject: document.querySelector(".select-project").value,
    selectPriority: document.querySelector(".select-priority").value,
  };
}

console.log(getFormData());
