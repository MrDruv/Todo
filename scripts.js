const inputBox = document.getElementById("input-box");
const taskList = document.getElementById("task-list");

inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add task logic
function addTask() {
  const taskText = inputBox.value.trim();
  if (!taskText) {
    alert("please write down the task");
    return;
    
  }

  const task = document.createElement("div");
  task.className = "task";

  task.innerHTML = `
  
    <div class="task-header" >
      <label><input type="checkbox" class="task-checkbox"> <span class="task-text">${taskText}</span></label>
      <span class="due-timer"></span> <!-- Timer display -->
      <span class="arrow" onclick="this.parentElement.nextElementSibling.classList.toggle('show')">&#9660;</span>
    </div>
    
    <div class="task-body">
      <label>Notes</label>
      <textarea placeholder="Write your notes..."></textarea>

      <label>Due Date</label>
    
      <input class="due-date-input" type="date"><br>
      <label>Due Time</label>
      <input class="due-time-input" type="time"><br>
      

      <label>Priority</label>
      <div id="Priority-dropdown"><select class="priority-select">
        <option>Select</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select></div>
      
      <button class="delete-btn">Delete</button>
      <button class="edit-btn" style="background-color: silver;">Edit</button>
      <span class="arrow" onclick="this.parentElement.classList.remove('show')">&#9650;</span>
    </div>
    
  `; 

  const checkbox = task.querySelector(".task-checkbox");
  const deleteBtn = task.querySelector(".delete-btn");
  const editbtn =task.querySelector(".edit-btn");
  const taskSpan = task.querySelector(".task-text");
    // Due Timer Logic
  const dueDateInput = task.querySelector(".due-date-input");
  const dueTimeInput = task.querySelector(".due-time-input");
  const dueTimerSpan = task.querySelector(".due-timer");

  function updateDueTimer() {
  const date = dueDateInput.value;
  const time = dueTimeInput.value || "23:59"; // default time if empty
  if (!date) {
    dueTimerSpan.textContent = "";
    return;
  }

    const now = new Date();
    const dueDateTime = new Date(`${date}T${time}`);

    const diff = dueDateTime - now;

    if (diff <= 0) {
      dueTimerSpan.textContent = "overdue";
      dueTimerSpan.style.color = "red";
    }else if (diff <= 60 * 60 * 1000) { // less than or equal to 1 hour
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dueTimerSpan.textContent = `⚠️ Time is running out: ${minutes}m ${seconds}s`;
    dueTimerSpan.style.color = "orange";
  } 
    else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      dueTimerSpan.textContent = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
      dueTimerSpan.style.color = "green";
    }
  }

  // Start countdown
  setInterval(updateDueTimer, 1000);
  dueDateInput.addEventListener("change", updateDueTimer);
  dueTimeInput.addEventListener("change", updateDueTimer);


  /*const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);*/

  
  //CheckBox
  checkbox.addEventListener("click", function () {
  taskSpan.classList.toggle("completed", checkbox.checked);
  });

  //Delete Button
  deleteBtn.addEventListener("click", function () {
    if(confirm("Are you sure you want to delete this task?")){
    task.remove();
    }
  });

  
  //Edit Button
  editbtn.addEventListener("click", function() {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null && update.trim() !== "") {
      taskSpan.textContent = update.trim();
      task.classList.remove("completed");
      checkbox.checked = false;
    }
  });

  //priority border color logic:
  const prioritySelect = task.querySelector(".priority-select");

  prioritySelect.addEventListener("change", function () {
    task.style.borderLeft = "20px solid"; 
    const value = prioritySelect.value;

    if (value === "High") {
      task.style.borderLeftColor = "red";
      taskList.insertBefore(task, taskList.firstChild);
      const taskBody = task.querySelector('.task-body');
    if (taskBody) {
      taskBody.classList.remove('show');  
    }

    } else if (value === "Medium") {
      task.style.borderLeftColor = "orange";

      const taskBody = task.querySelector('.task-body');
      if (taskBody) {
      taskBody.classList.remove('show');  
    }
    } else if (value === "Low") {
      task.style.borderLeftColor = "Yellow";
      const taskBody = task.querySelector('.task-body');
      if (taskBody) {
      taskBody.classList.remove('show');  
    }
    }
  });
  prioritySelect.dispatchEvent(new Event("change"));


  taskList.appendChild(task);
  inputBox.value = "";
}



