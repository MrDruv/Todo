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

      <span class="arrow" onclick="this.parentElement.nextElementSibling.classList.toggle('show')">&#9660;</span>
    </div>
    
    <div class="task-body">
      <label>Notes</label>
      <textarea placeholder="Write your notes..."></textarea>

      <label>Due Date</label>
      <input id="dt" type="date"><br>

      <label>Priority</label>
      <div id="Priority-dropdown"><select class="priority-select">
        <option>Select</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select></div>
      
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
      <span class="arrow" onclick="this.parentElement.classList.remove('show')">&#9650;</span>
    </div>
    
  `; 

  const checkbox = task.querySelector(".task-checkbox");
  const deleteBtn = task.querySelector(".delete-btn");
  const editbtn =task.querySelector(".edit-btn");
  const taskSpan = task.querySelector(".task-text");

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
      taskList.insertBefore(task, taskList.lastChild);
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



