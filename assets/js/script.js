// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}



function createTaskCard(task) {
    let deadlineDate = dayjs(task.deadline);
    let currentDate = dayjs();
    let daysUntilDeadline = deadlineDate.diff(currentDate, 'day');
  
    let deadlineClass = '';
    if (daysUntilDeadline < 0) {
      deadlineClass = 'text-danger'; // Overdue
    } else if (daysUntilDeadline < 3) {
      deadlineClass = 'text-warning'; // Nearing deadline
    }
  
    const taskCard = `
      <div class="card task-card mb-3 ${deadlineClass}" id="task-${task.id}" data-task-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Deadline: ${dayjs(task.deadline).format('YYYY-MM-DD')}</small></p>
          <button type="button" class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
      </div>
    `;
    return taskCard;
  }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  taskList.forEach(task => {
    let taskCard = createTaskCard(task);
    if (task.status === "todo") {
      $("#todo-cards").append(taskCard);
    } else if (task.status === "in-progress") {
      $("#in-progress-cards").append(taskCard);
    } else if (task.status === "done") {
      $("#done-cards").append(taskCard);
    }
  });

  $(".task-card").draggable({
    revert: "invalid",
    stack: ".task-card",
    cursor: "move",
    helper: "clone"
  });

  $(".delete-task").click(function () {
    let taskId = $(this).closest(".task-card").data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    saveTaskList();
    renderTaskList();
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    console.log(event, "event is fired")

  event.preventDefault();
  let title = $("#title").val();
  let description = $("#description").val();
  let deadline = $("#deadline").val();
  let id = generateTaskId();
  let newTask = {
    id: id,
    title: title,
    description: description,
    deadline: deadline,
    status: "todo"
  };
  taskList.push(newTask);
  console.log(taskList, "new task push")
  saveTaskList();
  renderTaskList();
  
  // Clear the form fields
  $("#title").val("");
  $("#description").val("");
  $("#deadline").val("");

  // Close the modal
  let modal = new bootstrap.Modal(document.getElementById('formModal'));
  modal.hide();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.data("task-id");
  let newStatus = $(this).attr("id");
  taskList = taskList.map(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });
  saveTaskList();
  renderTaskList();
}

// Todo: create a function to save the task list to localStorage
function saveTaskList() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $("#addTaskForm").submit(handleAddTask);

  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  $("#deadline").datepicker({
    dateFormat: "dd/mm/yy"
  });
});
