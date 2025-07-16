// ✅ 1. Global Task Array
let tasks = [];
let dateFilter = "all";
let currentFilter = "all"; // all | completed | pending

// ✅ 2. Add Task
function addTask() {
  const input = document.getElementById("taskInput").value.trim;
  const dueDate = document.getElementById("dateInput").value;

  if (!text) 
    return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: dueDate || null
  };

  tasks.push(newTask);
  input.value = "";
  saveTasks();
  renderTasks();

  // clearing inputs after saving
  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
}
document.getElementById("addBtn").addEventListener("click", addTask);

// ✅ 3. Render Tasks
function renderTasks() {
  const taskList = document.getElementById("taskList");
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    // status logic
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;

    // date logic
    if (dateFilter === "today") {
      return task.dueDate === today;
    }
    if (dateFilter === "week") {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const in7Days = new Date();
      in7Days.setDate(now.getDate() + 7);
      return taskDate >= now && taskDate <= in7Days;
    }
    if (dateFilter === "overdue") {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now && !task.completed;
    }
    return true;
  });

  // sorting according to nearest due date
  filteredTasks.sort((a, b) => {
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return new Date(a.dueDate) - new Date(b.dueDate);
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // Highlighting overdue and today's tasks
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const isToday = task.dueDate === today;
      const isOverdue = taskDate < now && !task.completed;

      if (isToday) li.classList.add("due-today");
      if (isOverdue) li.classList.add("overdue");
    }

    li.innerHTML = `
    <div class="task-content">
      <span class="${task.completed ? 'done' : ''}">${task.text}</span>
      ${task.dueDate ? `<small class="due">Due: ${task.dueDate}</small>` : ""}
    </div>
    <div class="task-actions">
      <button onclick="toggleTask(${task.id})">✔</button>
      <button onclick="deleteTask(${task.id})">🗑</button>
    </div>
    `;

    taskList.appendChild(li);
  });
}

document.getElementById("dueDateFilter").addEventListener("change", (e) => {
  dateFilter = e.target.value;
  renderTasks();
});

// ✅ 4. Toggle Task Completion
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// ✅ 5. Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ✅ 6. Filter Tasks
function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}
document.querySelectorAll("#filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// ✅ 7. Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ 8. Load from localStorage on page load
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
  renderTasks();
}

window.onload = loadTasks;


