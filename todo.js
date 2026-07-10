"use strict";

const STORAGE_KEY = "glass-todo-tasks";
const THEME_KEY = "glass-todo-theme";
const RING_CIRCUMFERENCE = 113.1;

let tasks = [];
let currentFilter = "all";
let currentPriority = "low";
let searchQuery = "";

let taskForm;
let taskInput;
let taskList;
let taskCount;
let taskCountSolo;
let panelFooter;
let btnClearCompleted;
let progressWrap;
let progressRingFill;
let progressLabel;
let searchInput;
let meshSpotlight;
let greetingEl;

/* ── Storage ───────────────────────────────────────────────── */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((task) => ({
      id: task.id,
      text: task.text,
      completed: Boolean(task.completed),
      createdAt: task.createdAt || Date.now(),
      priority: task.priority || "low",
    }));
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* ── Task Model ────────────────────────────────────────────── */
function createTask(text, priority) {
  return {
    id: createId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
    priority: priority || "low",
  };
}

function sortTasks(list) {
  const priorityWeight = { high: 0, medium: 1, low: 2 };

  return [...list].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.createdAt - b.createdAt;
  });
}

function getVisibleTasks() {
  let visible = sortTasks(tasks);

  if (currentFilter === "active") {
    visible = visible.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    visible = visible.filter((task) => task.completed);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    visible = visible.filter((task) => task.text.toLowerCase().includes(query));
  }

  return visible;
}

function getActiveCount() {
  return tasks.filter((task) => !task.completed).length;
}

function getCompletedCount() {
  return tasks.filter((task) => task.completed).length;
}

function getCompletionPercent() {
  if (tasks.length === 0) return 0;
  return Math.round((getCompletedCount() / tasks.length) * 100);
}

/* ── Rendering ─────────────────────────────────────────────── */
function render() {
  const visible = getVisibleTasks();
  taskList.innerHTML = "";

  visible.forEach((task) => {
    taskList.appendChild(buildTaskElement(task));
  });

  updateListEmptyState(visible);
  updateStats();
  refreshIcons();
}

function updateListEmptyState(visible) {
  taskList.classList.remove("is-empty", "is-filtered-empty");

  if (tasks.length === 0) {
    taskList.classList.add("is-empty");
    return;
  }

  if (visible.length === 0) {
    taskList.classList.add("is-filtered-empty");
  }
}

function buildTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-item task-item--${task.priority}`;
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add("is-completed");
  }

  li.innerHTML = `
    <label class="task-checkbox" aria-label="Mark task as ${task.completed ? "incomplete" : "complete"}">
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="checkbox-visual">
        <i data-lucide="check"></i>
      </span>
    </label>
    <div class="task-text-wrap">
      <span class="task-text" title="Double-click to edit">${escapeHtml(task.text)}</span>
      ${task.priority !== "low" ? `<div class="task-meta"><span class="task-priority-label">${task.priority}</span></div>` : ""}
    </div>
    <button type="button" class="btn-delete" aria-label="Delete task">
      <i data-lucide="trash-2"></i>
    </button>
  `;

  const checkbox = li.querySelector('input[type="checkbox"]');
  const deleteBtn = li.querySelector(".btn-delete");
  const textEl = li.querySelector(".task-text");

  checkbox.addEventListener("change", () => toggleTask(task.id, li));
  deleteBtn.addEventListener("click", () => removeTask(task.id, li));
  textEl.addEventListener("dblclick", () => startEditing(task.id, li));

  return li;
}

function updateStats() {
  const active = getActiveCount();
  const total = tasks.length;
  const percent = getCompletionPercent();
  const label = active === 1 ? "1 task remaining" : `${active} tasks remaining`;

  taskCount.textContent = label;
  taskCountSolo.textContent = label;

  const showProgress = total > 0;
  progressWrap.hidden = !showProgress;
  taskCountSolo.hidden = showProgress;

  if (showProgress) {
    const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
    progressRingFill.style.strokeDashoffset = String(offset);
    progressLabel.textContent = `${percent}% done`;
  }

  panelFooter.hidden = getCompletedCount() === 0;
}

function refreshIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ── Actions ───────────────────────────────────────────────── */
function addTask(text, priority) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const task = createTask(trimmed, priority);
  tasks.push(task);
  saveTasks();
  render();
}

function toggleTask(id, listItem) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  listItem.classList.add("is-completing");

  setTimeout(() => {
    task.completed = !task.completed;
    saveTasks();
    render();
  }, 300);
}

function removeTask(id, listItem) {
  listItem.classList.add("is-removing");

  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }, 280);
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

function startEditing(id, listItem) {
  const task = tasks.find((t) => t.id === id);
  if (!task || task.completed) return;

  const wrap = listItem.querySelector(".task-text-wrap");
  const meta = wrap.querySelector(".task-meta");
  if (meta) meta.remove();

  const input = document.createElement("input");
  input.type = "text";
  input.className = "task-edit-input";
  input.value = task.text;
  input.maxLength = 200;
  input.setAttribute("aria-label", "Edit task");

  wrap.innerHTML = "";
  wrap.appendChild(input);
  input.focus();
  input.select();

  const commit = () => {
    const trimmed = input.value.trim();
    if (trimmed) {
      task.text = trimmed;
      saveTasks();
    }
    render();
  };

  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    }
    if (event.key === "Escape") {
      render();
    }
  });
}

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filter-pill").forEach((pill) => {
    const isActive = pill.dataset.filter === filter;
    pill.classList.toggle("is-active", isActive);
    pill.setAttribute("aria-selected", String(isActive));
  });

  render();
}

function setPriority(priority) {
  currentPriority = priority;

  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.priority === priority);
  });
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  refreshIcons();
}

/* ── UI Helpers ────────────────────────────────────────────── */
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good evening";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  greetingEl.textContent = greeting;
}

function initSpotlight() {
  if (!meshSpotlight) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.body.classList.add("is-spotlight-active");

  document.addEventListener("mousemove", (event) => {
    meshSpotlight.style.left = `${event.clientX}px`;
    meshSpotlight.style.top = `${event.clientY}px`;
  });
}

function cacheElements() {
  taskForm = document.getElementById("task-form");
  taskInput = document.getElementById("task-input");
  taskList = document.getElementById("task-list");
  taskCount = document.getElementById("task-count");
  taskCountSolo = document.getElementById("task-count-solo");
  panelFooter = document.getElementById("panel-footer");
  btnClearCompleted = document.getElementById("btn-clear-completed");
  progressWrap = document.getElementById("progress-wrap");
  progressRingFill = document.getElementById("progress-ring-fill");
  progressLabel = document.getElementById("progress-label");
  searchInput = document.getElementById("search-input");
  meshSpotlight = document.getElementById("mesh-spotlight");
  greetingEl = document.getElementById("greeting");
}

function bindEvents() {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(taskInput.value, currentPriority);
    taskInput.value = "";
    taskInput.focus();
  });

  document.getElementById("glass-panel").addEventListener("click", (event) => {
    const themeBtn = event.target.closest("#theme-toggle");
    if (themeBtn) {
      event.preventDefault();
      toggleTheme();
      return;
    }

    const priorityBtn = event.target.closest(".priority-btn");
    if (priorityBtn) {
      event.preventDefault();
      setPriority(priorityBtn.dataset.priority);
      return;
    }

    const filterPill = event.target.closest(".filter-pill");
    if (filterPill) {
      event.preventDefault();
      setFilter(filterPill.dataset.filter);
      return;
    }

    const clearBtn = event.target.closest("#btn-clear-completed");
    if (clearBtn) {
      event.preventDefault();
      clearCompleted();
    }
  });

  searchInput.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim();
    render();
  });

  searchInput.addEventListener("search", (event) => {
    searchQuery = event.target.value.trim();
    render();
  });
}

function init() {
  cacheElements();
  tasks = loadTasks();
  applyTheme(loadTheme());
  bindEvents();
  setGreeting();
  initSpotlight();
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.refreshLucideIcons = refreshIcons;
