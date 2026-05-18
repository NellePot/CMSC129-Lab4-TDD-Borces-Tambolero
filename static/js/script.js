document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();

    document.querySelector('.add-task').addEventListener('click', () => {
        document.getElementById('addTaskForm').style.display = 'flex';
    });

    document.getElementById('closePopUp').addEventListener('click', () => {
        document.getElementById('addTaskForm').style.display = 'none';
    });

    document.getElementById('saveTask').addEventListener('click', addTask);

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        document.getElementById('deleteModal').style.display = 'none';
        taskToDeleteId = null;
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        if (taskToDeleteId) {
            await fetch(`/tasks/${taskToDeleteId}`, { method: 'DELETE' });
            fetchTasks();
        }
        document.getElementById('deleteModal').style.display = 'none';
        taskToDeleteId = null;
    });
});

let taskToDeleteId = null;

function fetchTasks() {
    fetch("/tasks")
        .then(r => r.json())
        .then(tasks => renderTasks(tasks))
        .catch(err => console.error(err));
}

function addTask() {
    const input = document.getElementById("taskName");
    const title = input.value.trim();
    if (!title) return;

    fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    })
    .then(r => {
        if (r.ok) {
            input.value = "";
            document.getElementById('addTaskForm').style.display = 'none';
            fetchTasks();
        }
    });
}

function renderTasks(tasksArray) {
    document.getElementById("pendingTasks").innerHTML = "";
    document.getElementById("ongoingTasks").innerHTML = "";
    document.getElementById("doneTasks").innerHTML = "";

    tasksArray.forEach(task => {
        const card = document.createElement("div");
        card.setAttribute("data-testid", "task-item");
        card.dataset.id = task.id;

        card.innerHTML = `
            <span>${task.title} - ${task.status}</span>
            <button class="options-btn">⋮</button>
            <ul class="options-menu" style="display:none;">
                <li class="mark-done-option">Mark Done</li>
                <li class="delete-task">Delete</li>
            </ul>
        `;

        card.querySelector('.options-btn').addEventListener('click', () => {
            const menu = card.querySelector('.options-menu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        card.querySelector('.mark-done-option').addEventListener('click', async () => {
            await fetch(`/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'done' })
            });
            fetchTasks();
        });

        card.querySelector('.delete-task').addEventListener('click', () => {
            taskToDeleteId = task.id;
            document.getElementById('deleteModal').style.display = 'flex';
        });

        if (task.status === "done") document.getElementById("doneTasks").appendChild(card);
        else if (task.status === "ongoing") document.getElementById("ongoingTasks").appendChild(card);
        else document.getElementById("pendingTasks").appendChild(card);
    });
}