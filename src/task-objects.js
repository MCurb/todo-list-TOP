//class that creates task objects
//it takes checkbox status, description, date, project, priority

export class Task {
  constructor(checkboxStatus, description, project, priority) {
    this.checkboxStatus = checkboxStatus;
    this.description = description;
    this.project = project;
    this.priority = priority;
  }
}
