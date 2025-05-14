const inputBox = document.getElementById("input-box");
const taskList = document.getElementById("task-list");

inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = inputBox.value.trim();
  if (!taskText) {
    alert("please write down the task");
    return;
  }

  const task = document.createElement("div");
  task.className = "task";

  task.innerHTML = `
  
    <div class="task-header" onclick="this.nextElementSibling.classList.toggle('show')">
      <label><input type="checkbox" class="task-checkbox"> ${taskText}</label> 
      <span class="arrow">&#9660;</span>
    </div>
    
    <div class="task-body">
      <label>Notes</label>
      <textarea placeholder="Write your notes..."></textarea>

      <label>Due Date</label>
      <input id="dt" type="date"><br>

      <label>Priority</label>
      <select>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      
      <button class="delete-btn">Delete</button>
    </div>
    
  `;

  // Attach functional behavior to elements
  const checkbox = task.querySelector(".task-checkbox");
  const deleteBtn = task.querySelector(".delete-btn");

  checkbox.addEventListener("click", function () {
    task.classList.toggle("completed", checkbox.checked);
  });

  deleteBtn.addEventListener("click", function () {
    task.remove();
  });

  taskList.appendChild(task);
  inputBox.value = "";
}

// This should be defined outside addTask
function clearAllTasks() {
  taskList.innerHTML = '';
}
