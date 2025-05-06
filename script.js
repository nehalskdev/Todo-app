"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const taskInput = document.getElementById("taskInput");
  const tasksContainer = document.getElementById("tasksContainer");

  loadTasks();

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
      alert("Please enter a task!");
      return;
    }

    const taskId = Date.now();
    createTaskElement(taskId, taskText, false);
    saveTasks();
    taskInput.value = "";
    taskInput.focus();
  }

  function createTaskElement(id, text, completed) {
    const taskElement = document.createElement("div");
    taskElement.className = `task-item ${completed ? "completed" : ""}`;
    taskElement.dataset.id = id;

    taskElement.innerHTML = `
            <div class="task-text">${text}</div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

    taskElement.querySelector(".task-text").addEventListener("click", () => {
      taskElement.classList.toggle("completed");
      saveTasks();
    });

    taskElement.querySelector(".edit-btn").addEventListener("click", () => {
      editTask(taskElement, id, text);
    });

    taskElement.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        taskElement.remove();
        saveTasks();
      }
    });

    tasksContainer.appendChild(taskElement);
  }

  function editTask(taskElement, id, currentText) {
    const taskTextElement = taskElement.querySelector(".task-text");
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

    taskTextElement.replaceWith(input);
    input.focus();

    const saveEdit = (e) => {
      if (e.key === "Enter" || e.type === "blur") {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
          taskTextElement.textContent = newText;
          input.replaceWith(taskTextElement);
          saveTasks();
        } else if (!newText) {
          if (confirm("Empty task will be deleted. Continue?")) {
            taskElement.remove();
            saveTasks();
          } else {
            taskTextElement.textContent = currentText;
            input.replaceWith(taskTextElement);
          }
        } else {
          taskTextElement.textContent = currentText;
          input.replaceWith(taskTextElement);
        }

        input.removeEventListener("keypress", saveEdit);
        input.removeEventListener("blur", saveEdit);
      }
    };

    input.addEventListener("keypress", saveEdit);
    input.addEventListener("blur", saveEdit);
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((taskElement) => {
      tasks.push({
        id: taskElement.dataset.id,
        text: taskElement.querySelector(".task-text").textContent,
        completed: taskElement.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      JSON.parse(savedTasks).forEach((task) => {
        createTaskElement(task.id, task.text, task.completed);
      });
    }
  }
});
