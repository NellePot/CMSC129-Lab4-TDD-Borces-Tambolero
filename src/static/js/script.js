document.addEventListener("DOMContentLoaded", () => {
  // ====== Element References ======
  const addButton       = document.querySelector(".add-task");
  const form            = document.getElementById("addTaskForm");
  const closeBtn        = document.getElementById("closePopUp");
  const saveBtn         = document.getElementById("saveTask");
  const taskNameInput   = document.getElementById("taskName");
  const dueDateInput    = document.getElementById("dueDate");
  const dueTimeInput    = document.getElementById("dueTime");
  const taskSelect      = document.getElementById("task");
  const prioritySelect  = document.getElementById("priority");
  const nameError       = document.getElementById("nameError");
  const deleteModal     = document.getElementById("deleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn  = document.getElementById("cancelDeleteBtn");

  let taskToDeleteElement = null;
  let taskToDeleteId = null;
  let editingTask = null;

  // ====== Rendering Tasks ======
  async function loadTasks(sortBy = "date_added") {
    const res = await fetch(`/tasks?sort=${sortBy}`);
    const tasks = await res.json();
    renderTasks(tasks);
  }

  function renderTasks(tasks) {
    document.querySelectorAll(".list-container").forEach(c => (c.innerHTML = ""));

    tasks.forEach(task => {
      const targetColumn = document.querySelector(
        `.status.${task.status} .list-container`
      );
      if (!targetColumn) return;

      const taskCard = document.createElement("div");
      taskCard.className = `task-card priority-${task.priority}`;
      taskCard.setAttribute("draggable", "true");
      taskCard.setAttribute("data-testid", "task-item");
      taskCard.dataset.id = task.id;
      taskCard.dataset.title = task.title;
      taskCard.dataset.status = task.status;
      taskCard.dataset.deadline = task.deadline || "";
      taskCard.dataset.duetime = task.duetime || "";
      taskCard.dataset.priority = task.priority;

      taskCard.innerHTML = `
        <div class="task-content">
          <strong class="${task.status === "done" ? "completed" : ""}">${task.title}</strong><br>
          <small>Due: ${formatDueDate(task.deadline, task.duetime, task.status)}</small>
          <br>
          <small class="created-date">Created: ${task.created_at ? new Date(task.created_at).toLocaleString() : "—"}</small>
        </div>
        <div class="task-options">
          <button class="options-btn" data-testid="mark-done-button" data-id="${task.id}">⋮</button>
          <ul class="options-menu">
            <li class="edit-task">Edit</li>
            <li class="mark-done-option" data-testid="mark-done-option">Mark Done</li>
            <li class="delete-task">Delete</li>
          </ul>
        </div>
      `;

      taskCard.addEventListener("dragstart", dragStart);
      targetColumn.appendChild(taskCard);
    });
  }

  function formatDueDate(dateStr, timeStr, status) {
    if (!dateStr) return "No deadline set";

    const deadline = new Date(`${dateStr}T${timeStr || "00:00"}`);
    const now = new Date();
    const diffMs = deadline - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    const optionsDate = { month: "short", day: "numeric", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    const formattedDate = deadline.toLocaleDateString("en-US", optionsDate);
    const formattedTime = timeStr ? deadline.toLocaleTimeString("en-US", optionsTime) : "";
    const formatted = timeStr ? `${formattedDate} • ${formattedTime}` : formattedDate;

    if (status === "done") return formatted;
    if (diffMs < 0) return `<span class="overdue">${formatted} (Overdue)</span>`;
    if (diffHours <= 24) return `<span class="near-deadline">${formatted} (Due Soon)</span>`;
    return formatted;
  }

  // ====== Save Task (Add or Edit) ======
  async function handleSaveTask() {
    const taskData = {
      title: taskNameInput.value.trim(),
      deadline: dueDateInput.value,
      duetime: dueTimeInput.value,
      status: taskSelect.value,
      priority: prioritySelect.value,
    };

    if (!taskData.title) {
      nameError.textContent = "Please enter a task name.";
      return;
    }
    nameError.textContent = "";

    if (editingTask) {
      const id = editingTask.dataset.id;
      await fetch(`/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    } else {
      taskData.created_at = new Date().toISOString();
      await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    }

    editingTask = null;
    closeForm();
    loadTasks();
  }

  // ====== Handle Task Options (⋮ menu) ======
  async function handleTaskOptions(e) {
    // Toggle the ⋮ menu
    if (e.target.classList.contains("options-btn")) {
      document.querySelectorAll(".options-menu.show").forEach(m => {
        if (m !== e.target.nextElementSibling) m.classList.remove("show");
      });
      const menu = e.target.nextElementSibling;
      menu.classList.toggle("show");
      return;
    }

    // Close menus when clicking outside
    if (!e.target.closest(".task-options")) {
      document.querySelectorAll(".options-menu.show").forEach(m => m.classList.remove("show"));
    }

    // Mark Done
    if (e.target.classList.contains("mark-done-option")) {
      const menu = e.target.closest(".options-menu");
      if (menu) menu.classList.remove("show");
      const task = e.target.closest(".task-card");
      const id = task.dataset.id;
      await fetch(`/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      loadTasks();
    }

    // Delete
    if (e.target.classList.contains("delete-task")) {
      const task = e.target.closest(".task-card");
      const menu = e.target.closest(".options-menu");
      if (menu) menu.classList.remove("show");
      taskToDeleteElement = task;
      taskToDeleteId = task.dataset.id;
      deleteModal.style.display = "flex";
    }

    // Edit
    if (e.target.classList.contains("edit-task")) {
      const menu = e.target.closest(".options-menu");
      if (menu) menu.classList.remove("show");
      const task = e.target.closest(".task-card");
      editingTask = task;
      taskNameInput.value  = task.dataset.title || "";
      dueDateInput.value   = task.dataset.deadline || "";
      dueTimeInput.value   = task.dataset.duetime || "";
      taskSelect.value     = task.dataset.status || "pending";
      prioritySelect.value = task.dataset.priority || "important";
      saveBtn.textContent  = "Edit Task";
      openForm(true);
    }
  }

  function openForm(isEdit = false) {
    form.style.display = "flex";
    if (!isEdit) {
      taskNameInput.value  = "";
      dueDateInput.value   = "";
      dueTimeInput.value   = "";
      taskSelect.value     = "pending";
      prioritySelect.value = "important";
      editingTask          = null;
      saveBtn.textContent  = "Add Task";
    }
  }

  function closeForm() {
    form.style.display = "none";
  }

  addButton.addEventListener("click", () => openForm(false));
  closeBtn.addEventListener("click", closeForm);
  saveBtn.addEventListener("click", handleSaveTask);
  document.addEventListener("click", handleTaskOptions);

  document.getElementById("sortForm").addEventListener("change", function (e) {
    loadTasks(e.target.value);
  });

  loadTasks();

  // ====== Delete Modal ======
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
    taskToDeleteElement = null;
    taskToDeleteId = null;
  });

    confirmDeleteBtn.addEventListener("click", async () => {
        if (taskToDeleteId) {
            await fetch(`/tasks/${taskToDeleteId}`, { method: "DELETE" });
            loadTasks();
        }
        deleteModal.style.display = "none";
        taskToDeleteElement = null;
        taskToDeleteId = null;
    });

  // ====== Drag & Drop ======
  let draggedTask = null;

  function dragStart(e) {
    draggedTask = this;
    setTimeout(() => this.classList.add("dragging"), 0);
  }

  document.querySelectorAll(".status").forEach(column => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      const listContainer = column.querySelector(".list-container");
      const afterElement = getDragAfterElement(listContainer, e.clientY);
      if (afterElement == null) listContainer.appendChild(draggedTask);
      else listContainer.insertBefore(draggedTask, afterElement);
    });

    column.addEventListener("drop", async (e) => {
      e.preventDefault();
      if (!draggedTask) return;
      draggedTask.classList.remove("dragging");
      const listContainer = column.querySelector(".list-container");
      const containerId = listContainer.id;
      let newStatus = "";
      if (containerId === "pendingTasks") newStatus = "pending";
      else if (containerId === "ongoingTasks") newStatus = "ongoing";
      else if (containerId === "doneTasks") newStatus = "done";

      if (newStatus && draggedTask.dataset.status !== newStatus) {
        const taskId = draggedTask.dataset.id;
        draggedTask.dataset.status = newStatus;
        const titleStrong = draggedTask.querySelector("strong");
        if (newStatus === "done") titleStrong.classList.add("completed");
        else titleStrong.classList.remove("completed");
        await fetch(`/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    });
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task-card:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
});