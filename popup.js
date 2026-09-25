const STORAGE_KEY = "tasks";

const form = document.getElementById("new-task-form");
const input = document.getElementById("new-task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("empty-state");
const clearDoneButton = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = [];
let currentFilter = "all";

async function loadTasks() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  tasks = data[STORAGE_KEY] || [];
  render();
}

async function saveTasks() {
  await chrome.storage.local.set({ [STORAGE_KEY]: tasks });
  updateBadge();
}

function updateBadge() {
  const pending = tasks.filter((t) => !t.done).length;
  chrome.action.setBadgeText({ text: pending > 0 ? String(pending) : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#4f6bed" });
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: Date.now(),
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function updateTaskText(id, text) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  if (text) {
    task.text = text;
    saveTasks();
  }
  render();
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

function startEditing(li, task) {
  const span = li.querySelector(".text");
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit";
  editInput.value = task.text;
  editInput.maxLength = 200;
  span.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  let finished = false;
  const finish = (save) => {
    if (finished) return;
    finished = true;
    if (save) {
      updateTaskText(task.id, editInput.value.trim());
    } else {
      render();
    }
  };

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  editInput.addEventListener("blur", () => finish(true));
}

function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.done) li.classList.add("done");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const span = document.createElement("span");
  span.className = "text";
  span.textContent = task.text;
  span.addEventListener("dblclick", () => startEditing(li, task));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.title = "Excluir";
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  li.append(checkbox, span, deleteButton);
  return li;
}

function render() {
  const visible = tasks.filter((t) => {
    if (currentFilter === "pending") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.replaceChildren(...visible.map(createTaskElement));
  emptyState.hidden = visible.length > 0;

  const pending = tasks.filter((t) => !t.done).length;
  counter.textContent =
    tasks.length === 0
      ? ""
      : `${pending} pendente${pending === 1 ? "" : "s"} de ${tasks.length}`;

  clearDoneButton.hidden = !tasks.some((t) => t.done);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === button));
    render();
  });
});

clearDoneButton.addEventListener("click", clearDone);

loadTasks().then(updateBadge);
