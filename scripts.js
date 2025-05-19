window.addEventListener("DOMContentLoaded", function() {
  var inputBox = document.getElementById("input-box");
  var taskList = document.getElementById("task-list");
  var checkedTaskList = document.getElementById("checked-task-list");
  var deleteAllCheckedBtn = document.getElementById("deleteAllChecked");

  inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  deleteAllCheckedBtn.addEventListener("click", deleteChecked);

  function saveTasksToLocal() {
    var tasks = [];
    var allTasks = document.querySelectorAll(".task");
    allTasks.forEach(function(task) {
      var checkbox = task.querySelector(".task-checkbox");
      var span = task.querySelector(".task-text");
      var dueDate = task.querySelector(".due-date-input").value;
      var dueTime = task.querySelector(".due-time-input").value;
      var priority = task.querySelector(".priority-select").value;
      var notes = task.querySelector("textarea").value;

      tasks.push({
        text: span.textContent,
        completed: checkbox.checked,
        dueDate: dueDate,
        dueTime: dueTime,
        priority: priority,
        notes: notes
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function deleteChecked() {
    var checkedBoxes = document.querySelectorAll(".task-checkbox:checked");
    checkedBoxes.forEach(function(cb) {
      cb.closest(".task").remove();
    });
    updateCheckedTasks();
    saveTasksToLocal();
  }

  function updateCheckedTasks() {
    checkedTaskList.innerHTML = "";
    var allTasks = document.querySelectorAll(".task");
    allTasks.forEach(function(task) {
      var cb = task.querySelector(".task-checkbox");
      var span = task.querySelector(".task-text");
      if (cb.checked) {
        var li = document.createElement("li");
        li.textContent = span.textContent;
        checkedTaskList.appendChild(li);
      }
    });
  }

  function addTask(taskData) {
    taskData = taskData || null;
    var taskText = taskData ? taskData.text : inputBox.value.trim();
    if (!taskText) {
      alert("Please write down the task");
      return;
    }

    var task = document.createElement("div");
    task.className = "task";

    task.innerHTML =
  '<div class="task-header">' +
    '<label><input type="checkbox" class="task-checkbox"> <span class="task-text">' + taskText + '</span></label>' +
    '<span class="due-timer"></span>' +
    '<span class="arrow">&#9660;</span>' +
  '</div>' +
  '<div class="task-body">' +
    '<label>Notes</label>' +
    '<textarea placeholder="Write your notes..."></textarea>' +

    '<label>Due Date</label>' +
    '<input class="due-date-input" type="date"><br>' +
    '<label>Due Time</label>' +
    '<input class="due-time-input" type="time"><br>' +

    '<label>Priority</label>' +
    '<div id="Priority-dropdown">' +
      '<select class="priority-select">' +
        '<option>Select</option>' +
        '<option>High</option>' +
        '<option>Medium</option>' +
        '<option>Low</option>' +
      '</select>' +
    '</div>' +

    
    '<div>' +
      '<button class="delete-btn">Delete</button>' +
      '<button class="edit-btn" style="background-color: silver;">Edit</button>' +
    '</div>' +

    '<span class="arrow">&#9650;</span>' +
  '</div>';


    // Toggle task body visibility on arrow click
    task.querySelector(".task-header .arrow").addEventListener("click", function() {
      this.parentElement.nextElementSibling.classList.toggle("show");
    });
    task.querySelector(".task-body .arrow").addEventListener("click", function() {
      this.parentElement.classList.remove("show");
    });

    var checkbox = task.querySelector(".task-checkbox");
    var deleteBtn = task.querySelector(".delete-btn");
    var editBtn = task.querySelector(".edit-btn");
    var taskSpan = task.querySelector(".task-text");
    var dueDateInput = task.querySelector(".due-date-input");
    var dueTimeInput = task.querySelector(".due-time-input");
    var dueTimerSpan = task.querySelector(".due-timer");
    var prioritySelect = task.querySelector(".priority-select");
    var notesInput = task.querySelector("textarea");

    // Prefill if restoring
    if (taskData) {
      checkbox.checked = taskData.completed;
      if (taskData.completed) taskSpan.classList.add("completed");
      dueDateInput.value = taskData.dueDate;
      dueTimeInput.value = taskData.dueTime;
      prioritySelect.value = taskData.priority;
      notesInput.value = taskData.notes;
    }

    function updateDueTimer() {
      var date = dueDateInput.value;
      var time = dueTimeInput.value || "23:59";
      if (!date) {
        dueTimerSpan.textContent = "";
        return;
      }

      var now = new Date();
      var dueDateTime = new Date(date + "T" + time);
      var diff = dueDateTime - now;

      if (diff <= 0) {
        dueTimerSpan.textContent = "Overdue";
        dueTimerSpan.style.color = "red";
      } else if (diff <= 60 * 60 * 1000) {
        var minutes = Math.floor((diff / (1000 * 60)) % 60);
        var seconds = Math.floor((diff / 1000) % 60);
        dueTimerSpan.textContent = "⚠️ " + minutes + "m " + seconds + "s left";
        dueTimerSpan.style.color = "orange";
      } else {
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        var minutes = Math.floor((diff / (1000 * 60)) % 60);
        var seconds = Math.floor((diff / 1000) % 60);
        dueTimerSpan.textContent = "Time left: " + days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        dueTimerSpan.style.color = "green";
      }
    }

    // Update timer every second
    setInterval(updateDueTimer, 1000);

    dueDateInput.addEventListener("change", function() {
      updateDueTimer();
      saveTasksToLocal();
    });
    dueTimeInput.addEventListener("change", function() {
      updateDueTimer();
      saveTasksToLocal();
    });

    checkbox.addEventListener("click", function() {
      if (checkbox.checked) {
        taskSpan.classList.add("completed");
      } else {
        taskSpan.classList.remove("completed");
      }
      updateCheckedTasks();
      saveTasksToLocal();
    });

    deleteBtn.addEventListener("click", function() {
      if (confirm("Are you sure you want to delete this task?")) {
        task.remove();
        updateCheckedTasks();
        saveTasksToLocal();
      }
    });

    editBtn.addEventListener("click", function() {
      var update = prompt("Edit task:", taskSpan.textContent);
      if (update !== null && update.trim() !== "") {
        taskSpan.textContent = update.trim();
        taskSpan.classList.remove("completed");
        checkbox.checked = false;
        saveTasksToLocal();
      }
    });

    prioritySelect.addEventListener("change", function() {
      task.style.borderLeft = "20px solid";
      var value = prioritySelect.value;
      var taskBody = task.querySelector(".task-body");
      if (taskBody) taskBody.classList.remove("show");

      if (value === "High") {
        task.style.borderLeftColor = "red";
        taskList.insertBefore(task, taskList.firstChild);
      } else if (value === "Medium") {
        task.style.borderLeftColor = "orange";
      } else if (value === "Low") {
        task.style.borderLeftColor = "yellow";
      }

      saveTasksToLocal();
    });

    // Trigger priority change to set border color etc.
    var event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, false);
    prioritySelect.dispatchEvent(event);

    taskList.appendChild(task);

    if (!taskData) inputBox.value = "";

    saveTasksToLocal();
  }

  // Load saved tasks on page load
  var savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    var saved = JSON.parse(savedTasks);
    saved.forEach(function(data) {
      addTask(data);
    });
  }
});
