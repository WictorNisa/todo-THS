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
      toggleComplete(index);
    });

    // Create p tag
    const p = document.createElement("p");
    p.textContent = todo.todo;
    p.classList.add("todo-text");
    p.style.textDecoration = todo.completed ? "line-through" : "none";
    p.style.textTransform = "capitalize";
    li.appendChild(p);

    // Create move up button
    if (index > 0) {
      // No move up button for the first item
      const moveUpButton = document.createElement("button");
      moveUpButton.classList.add("move-up-button");
      const moveUpSpan = document.createElement("span");
      moveUpSpan.classList.add("material-symbols-outlined");
      moveUpSpan.textContent = "keyboard_arrow_up";
      moveUpButton.appendChild(moveUpSpan);
      moveUpButton.addEventListener("click", () => moveTodoUp(index));
      li.appendChild(moveUpButton);
    }

    // Create move down button
    if (index < todos.length - 1) {
      //No move down button for the last item
      const moveDownButton = document.createElement("button");
      moveDownButton.classList.add("move-down-button");
      const moveDownSpan = document.createElement("span");
      moveDownSpan.classList.add("material-symbols-outlined");
      moveDownSpan.textContent = "keyboard_arrow_down";
      moveDownButton.appendChild(moveDownSpan);
      moveDownButton.addEventListener("click", () => moveTodoDown(index));
      li.appendChild(moveDownButton);
    }

    // Create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    const editSpan = document.createElement("span");
    editSpan.classList.add("material-symbols-outlined");
    editSpan.textContent = "edit";
    editButton.appendChild(editSpan);
    editButton.addEventListener("click", () => {
      editTodoItem(index, p);
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

//Functions

const moveTodoUp = (index) => {
  //Swap the current item with the one above it
  const temp = todos[index - 1];
  todos[index - 1] = todos[index];
  todos[index] = temp;

  //Update local storage and re-render the todos
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const moveTodoDown = (index) => {
  //Swap the current item with the one below it
  const temp = todos[index + 1];
  todos[index + 1] = todos[index];
  todos[index] = temp;

  //Update local storage and re-render the todos
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const toggleComplete = (index) => {
  todos[index].completed = !todos[index].completed;
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const removeTodoItem = (index) => {
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
};

const editTodoItem = (index, p) => {
  const editInput = document.createElement("input");
  p.replaceWith(editInput);
  editInput.value = p.textContent;
  editInput.focus();
  const confirmButton = document.createElement("button");
  confirmButton.classList.add("confirm-button");
  const confirmSpan = document.createElement("span");
  confirmSpan.classList.add("material-symbols-outlined");
  confirmSpan.textContent = "check";
  confirmButton.appendChild(confirmSpan);
  editInput.insertAdjacentElement("afterend", confirmButton);
  confirmButton.addEventListener("click", () => {
    if (editInput.value.trim() === "") {
      alert("Todo cannot be empty");
      editInput.focus();
    } else {
      todos[index].todo = editInput.value;
      localStorage.setItem("todos", JSON.stringify(todos));
      confirmButton.remove();
      renderTodos();
    }
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
