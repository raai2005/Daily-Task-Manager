// ✅ 1. Global Task Array
let tasks = [];
let currentFilter = "all"; // all | completed | pending

// ✅ 2. Add Task
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  input.value = "";
  saveTasks();
  renderTasks();
}
document.getElementById("addBtn").addEventListener("click", addTask);

// ✅ 3. Render Tasks
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.completed ? 'done' : ''}">${task.text}</span>
      <button onclick="toggleTask(${task.id})">✔</button>
      <button onclick="deleteTask(${task.id})">🗑</button>
    `;
    taskList.appendChild(li);
  });
}

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
