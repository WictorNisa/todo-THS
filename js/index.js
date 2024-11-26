//Global variables

const todoForm = document.querySelector(".todo-form");
const todoAlert = document.querySelector(".todo-alert");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");

let todos = [];

document.addEventListener("DOMContentLoaded", function () {
  const storedTodos = JSON.parse(localStorage.getItem("todos"));
  if (storedTodos) {
    todos = storedTodos;
    storedTodos.forEach((todo) => {
      renderTodos(todo);
    });
  } else {
    todos = [];
    todoList.innerHTML = "<p>No todos</p>";
  }
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createNewTodo();
});

const renderTodos = () => {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");

    // Create check button
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    const checkSpan = document.createElement("span");
    checkSpan.classList.add("material-symbols-outlined");
    checkSpan.innerText = todo.completed
      ? "radio_button_checked"
      : "radio_button_unchecked";
    checkButton.appendChild(checkSpan);
    checkButton.addEventListener("click", () => {
      toggleComplete(index, li);
    });

    // Create p tag
    const p = document.createElement("p");
    p.textContent = todo.todo;
    p.classList.add("todo-text");

    // Create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    const editSpan = document.createElement("span");
    editSpan.classList.add("material-symbols-outlined");
    editSpan.textContent = "edit";
    editButton.appendChild(editSpan);
    editButton.addEventListener("click", () => {
      editTodoItem(index);
    });

    // Create delete button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    const removeSpan = document.createElement("span");
    removeSpan.classList.add("material-symbols-outlined");
    removeSpan.textContent = "close";
    removeButton.appendChild(removeSpan);
    removeButton.addEventListener("click", () => {
      removeTodoItem(index);
    });

    // Append the buttons to the list item
    li.appendChild(checkButton);
    li.appendChild(p);
    li.appendChild(editButton);
    li.appendChild(removeButton);

    //Append the list item to the todo list
    todoList.appendChild(li);
  });
};

const createNewTodo = () => {
  if (todoInput.value === "") {
    todoAlert.classList.add("show");
    todoAlert.textContent = "Please enter your todo text";
    todoInput.focus();
    setTimeout(() => {
      todoAlert.classList.remove("show");
      todoAlert.textContent = "";
    }, 2000);
    return;
  }
  const newTodo = {
    todo: todoInput.value.trim(),
    completed: false,
    timestamp: new Date().toISOString(),
  };
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  todoInput.value = "";

  renderTodos();
  todoAlert.classList.add("show");
  todoAlert.textContent = "Todo added successfully";
  setTimeout(() => {
    todoAlert.classList.remove("show");
    todoAlert.textContent = "";
  }, 2000);
};
