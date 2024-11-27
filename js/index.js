//Global variables

const todoForm = document.querySelector(".todo-form");
const todoAlert = document.querySelector(".todo-alert");
const todoSuccess = document.querySelector(".todo-success");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const authorInput = document.querySelector(".author-input");
const filterContainer = document.querySelector(".filter-container");

let todos = [];

//Eventlisteners

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

filterContainer.addEventListener("click", (e) => {
  //Check if the clicked target is a button
  if (e.target.tagName === "BUTTON") {
    //Determine the sort criteria based on the buttons text or class
    if (e.target.textContent === "Sort by author") {
      sortTodos("author");
    } else if (e.target.textContent === "Sort by timestamp") {
      sortTodos("timestamp");
    }
  }
});

const renderTodos = () => {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");

    if (todo.completed) {
      li.classList.add("completed");
    }

    //Create div to contain move up/move down buttons
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-div");
    li.appendChild(orderDiv);

    // Create move up button
    if (index > 0) {
      // No move up button for the first item
      const moveUpButton = document.createElement("button");
      moveUpButton.classList.add("move-up-button");
      const moveUpSpan = document.createElement("span");
      moveUpSpan.classList.add("material-symbols-outlined");
      moveUpSpan.textContent = "keyboard_arrow_up";
      moveUpButton.appendChild(moveUpSpan);
      moveUpButton.addEventListener("click", (e) => {
        e.stopPropagation();
        moveTodoUp(index);
      });
      orderDiv.appendChild(moveUpButton);
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
      moveDownButton.addEventListener("click", (e) => {
        moveTodoDown(index);
        e.stopPropagation();
      });
      orderDiv.appendChild(moveDownButton);
    }

    //Create div that contains timestamp and author text

    const div = document.createElement("div");
    div.classList.add("todo-item-text-container");
    li.appendChild(div);

    // Create h4 tag for author
    const h4 = document.createElement("h4");
    h4.textContent = todo.author;
    h4.classList.add("author-text");

    //Create span tag for timestamp
    const span = document.createElement("span");
    const dateString = todo.timestamp;
    const date = new Date(dateString);
    span.textContent = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    span.classList.add("timestamp-text");
    div.appendChild(h4);
    div.appendChild(span);

    // Create p tag
    const p = document.createElement("p");
    p.textContent = todo.todo;
    p.classList.add("todo-text");
    p.style.textDecoration = todo.completed ? "line-through" : "none";
    p.style.textTransform = "capitalize";
    li.appendChild(p);


    //Create div container for edit and delete button
    const changeDiv = document.createElement('div')
    changeDiv.classList.add('change-div')
    li.appendChild(changeDiv)

    // Create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    const editSpan = document.createElement("span");
    editSpan.classList.add("material-symbols-outlined");
    editSpan.textContent = "edit";
    editButton.appendChild(editSpan);
    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      editTodoItem(index, p);
    });

    // Create delete button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    const removeSpan = document.createElement("span");
    removeSpan.classList.add("material-symbols-outlined");
    removeSpan.textContent = "close";
    removeButton.appendChild(removeSpan);
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTodoItem(index);
    });

    //Eventlistener on Li tag for toggling completed state
    li.addEventListener("click", () => {
      toggleComplete(index, li);
    });
    // Append the buttons to the list item

    li.appendChild(p);
    changeDiv.appendChild(editButton);
    changeDiv.appendChild(removeButton);

    //Append the list item to the todo list
    todoList.appendChild(li);
  });
};

//Functions

const sortTodos = (criteria) => {
  if (criteria === "timestamp") {
    //Sort by timestamp (default)
    todos.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (criteria === "author") {
    todos.sort((a, b) => {
      const authorA = a.author || "";
      const authorB = b.author || "";
      return authorA.localeCompare(authorB);
    });
  }

  //After sorting, update the DOM
  renderTodos();
};

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

const toggleComplete = (index, li) => {
  // Toggle the completed state in the todos array
  todos[index].completed = !todos[index].completed;
  // Save updated todos to localStorage
  localStorage.setItem("todos", JSON.stringify(todos));
  // Dynamically toggle the 'completed' class on the li
  li.classList.toggle("completed", todos[index].completed);
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

  if (authorInput.value === "") {
    todoAlert.classList.add("show");
    todoAlert.textContent = "Please enter a author";
    authorInput.focus();
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
    author: authorInput.value.trim(),
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
