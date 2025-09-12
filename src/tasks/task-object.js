// ========================
// PUBLIC API (exports)
// ========================

export class Task {
  constructor(checkboxStatus, date, description, project, priority, id) {
    this.checkboxStatus = checkboxStatus;
    this.date = date;
    this.description = description;
    this.project = project;
    this.priority = priority;
    this.id = id;
  }
}
