// ✅ 1. Global Task Array
let tasks = [];
let dateFilter = "all";
let currentFilter = "all"; // all | completed | pending

// ✅ 2. Block past dates in the date input
function setMinDueDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dueDateInput").setAttribute("min", today);
}

// ✅ 3. Add Task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dueDateInput");
  const text = taskInput.value.trim();
  const dueDate = dateInput.value;

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: dueDate || null
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dateInput.value = "";
}

// ✅ 4. Render Tasks
function renderTasks() {
  const taskList = document.getElementById("taskList");
  const now = new Date();
  const today = now.toISOString().split("T")[0];
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

  // sort tasks by earliest due date
  filteredTasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // Highlight overdue or today's task
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

// ✅ 5. Toggle Task Completion
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// ✅ 6. Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ✅ 7. Filter by status (all/completed/pending)
function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

// ✅ 8. Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ 9. Load from localStorage on page load
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
  renderTasks();
}

// ✅ 10. Filter by date via dropdown
document.getElementById("dueDateFilter").addEventListener("change", (e) => {
  dateFilter = e.target.value;
  renderTasks();
});

// ✅ 11. Filter by status buttons
document.querySelectorAll("#filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// ✅ 12. Add Task Button
document.getElementById("addBtn").addEventListener("click", addTask);

// ✅ 13. Init on page load
window.onload = () => {
  loadTasks();
  setMinDueDate();
};
