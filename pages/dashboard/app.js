// Dashboard functionality with Firebase and server integration
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getTasks, addTask, updateTask, deleteTask, logoutUser } from '../../firebase/firebase.js';

// Firebase config (same as in firebase/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyCc38FFnM7Xc7xFOoffrnEsQ3DJexchl8s",
  authDomain: "daily-task-manager-24d82.firebaseapp.com",
  projectId: "daily-task-manager-24d82",
  storageBucket: "daily-task-manager-24d82.appspot.com",
  messagingSenderId: "399990159546",
  appId: "1:399990159546:web:918bc96a0c138279906a83"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
  }
});

class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentFilter = 'all';
    this.currentDateFilter = 'all';
    this.init();
  }

  async init() {
    // Check authentication
    if (!this.checkAuth()) {
      return;
    }

    this.setupEventListeners();
    await this.loadTasks();
    this.renderTasks();
    this.updateTaskCount();
  }

  checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }

  setupEventListeners() {
    // Add task button
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', () => this.addTask());

    // Enter key on task input
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask();
      }
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('#filters button');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.currentFilter = button.dataset.filter;
        this.updateActiveFilter();
        this.renderTasks();
      });
    });

    // Date filter
    const dateFilter = document.getElementById('dueDateFilter');
    dateFilter.addEventListener('change', () => {
      this.currentDateFilter = dateFilter.value;
      this.renderTasks();
    });

    // Logout functionality
    this.setupLogout();
  }

  setupLogout() {
    // Add logout button to header
    const header = document.querySelector('.app h1');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';
    logoutBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    `;
    
    logoutBtn.addEventListener('mouseenter', () => {
      logoutBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    logoutBtn.addEventListener('mouseleave', () => {
      logoutBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    logoutBtn.addEventListener('click', async () => {
      try {
        await logoutUser();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout error:', error);
      }
    });

    document.querySelector('.app').style.position = 'relative';
    document.querySelector('.app').appendChild(logoutBtn);
  }

  async loadTasks() {
    try {
      this.tasks = await getTasks();
      this.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.showMessage('Error loading tasks', 'error');
    }
  }

  async addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    
    const title = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!title) {
      this.showMessage('Please enter a task title', 'error');
      return;
    }

    try {
      const taskData = {
        title,
        dueDate: dueDate || null,
        priority: 'medium',
        completed: false
      };

      await addTask(taskData);
      
      // Clear inputs
      taskInput.value = '';
      dueDateInput.value = '';
      
      // Reload and render tasks
      await this.loadTasks();
      this.renderTasks();
      this.updateTaskCount();
      
      this.showMessage('Task added successfully!', 'success');
    } catch (error) {
      console.error('Error adding task:', error);
      this.showMessage('Error adding task', 'error');
    }
  }

  async toggleTask(taskId) {
    try {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;

      await updateTask(taskId, { completed: !task.completed });
      
      await this.loadTasks();
      this.renderTasks();
      this.updateTaskCount();
    } catch (error) {
      console.error('Error updating task:', error);
      this.showMessage('Error updating task', 'error');
    }
  }

  async deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      
      await this.loadTasks();
      this.renderTasks();
      this.updateTaskCount();
      
      this.showMessage('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      this.showMessage('Error deleting task', 'error');
    }
  }

  async editTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newTitle = prompt('Edit task:', task.title);
    if (newTitle === null || newTitle.trim() === '') return;

    try {
      await updateTask(taskId, { title: newTitle.trim() });
      
      await this.loadTasks();
      this.renderTasks();
      
      this.showMessage('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      this.showMessage('Error updating task', 'error');
    }
  }

  renderTasks() {
    const taskList = document.getElementById('taskList');
    const filteredTasks = this.getFilteredTasks();

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <h3>No tasks found</h3>
          <p>${this.currentFilter === 'all' ? 'Add your first task to get started!' : 'No tasks match your current filter.'}</p>
        </div>
      `;
      return;
    }

    taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
  }

  createTaskHTML(task) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();
    
    let dateClass = '';
    if (isOverdue) dateClass = 'overdue';
    else if (isDueToday) dateClass = 'due-today';

    return `
      <li class="task-item ${task.completed ? 'completed' : ''} ${dateClass}">
        <div class="task-header">
          <div class="task-title">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="taskManager.toggleTask('${task.id}')">
            <span>${this.escapeHtml(task.title)}</span>
          </div>
          <div class="task-actions">
            <button class="edit-btn" onclick="taskManager.editTask('${task.id}')" title="Edit task">
              ✏️
            </button>
            <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Delete task">
              🗑️
            </button>
          </div>
        </div>
        <div class="task-details">
          <span class="task-date">
            ${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
          </span>
          <span class="task-priority priority-${task.priority || 'medium'}">
            ${task.priority || 'medium'}
          </span>
        </div>
      </li>
    `;
  }

  getFilteredTasks() {
    let filtered = this.tasks;

    // Apply status filter
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply date filter
    if (this.currentDateFilter !== 'all') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);

        switch (this.currentDateFilter) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'week':
            return dueDate >= startOfWeek && dueDate <= endOfWeek;
          case 'overdue':
            return dueDate < today && !task.completed;
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  updateActiveFilter() {
    const filterButtons = document.querySelectorAll('#filters button');
    filterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.filter === this.currentFilter);
    });
  }

  updateTaskCount() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const taskCount = document.querySelector('.task-count');
    if (!taskCount) {
      const countDiv = document.createElement('div');
      countDiv.className = 'task-count';
      document.querySelector('.app').insertBefore(countDiv, document.querySelector('.input-group'));
    }

    const countElement = document.querySelector('.task-count');
    countElement.innerHTML = `
      <div>Total: ${totalTasks} | Completed: ${completedTasks} | Pending: ${pendingTasks}</div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%"></div>
      </div>
    `;
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

    if (type === 'error') {
      messageDiv.style.background = '#dc3545';
    } else {
      messageDiv.style.background = '#28a745';
    }

    document.body.appendChild(messageDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the task manager
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
  taskManager = new TaskManager();
});
