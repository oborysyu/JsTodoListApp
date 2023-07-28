const TASK_STATES = [
  { name: "All tasks", value: "" },
  { name: "Pending", value: "isPending" },
  { name: "In Progress", value: "isInProgress" },
  { name: "Completed", value: "isCompleted" },
];
class Description {
  constructor(text) {
    this.description = text;
  }
}
class Task extends Description {
  /** The task contains a description and three status fields  */
  constructor(text) {
    super(text);
    this.isPending = true;
    this.isInProgress = false;
    this.isCompleted = false;
  }
}

class ToDoList {
  constructor(container) {
    this.tasks = JSON.parse(window.localStorage.getItem("todotasks")) || [];
    this.filteredTasks = [];
    this.container = container || document.body;
    this.toolsContainer;
    this.listContainer;
    this.init();
  }

  //method to initiate application
  init() {
    //prepare component; create some containers.
    this.container.innerHTML = "";
    this.toolsContainer = document.createElement("div");
    this.toolsContainer.classList.add("tools-container");
    this.container.appendChild(this.toolsContainer);
    this.listContainer = document.createElement("div");
    this.listContainer.classList.add("list-container");
    this.container.appendChild(this.listContainer);
    this.addPromptFormForAddingTasks();
    this.addSelect();
    this.render(this.tasks);
  }

  //method to renew list of todo items
  render(chosenTaskArray) {
    this.listContainer.innerHTML = "";
    this.addListWithTasks(chosenTaskArray);
  }

  //method to add new todo
  addTaskToList(text) {
    if (text.length > 0) {
      this.tasks.push(new Task(text));
      this.saveTaskInLocalStorage();
    } else {
      alert("The task must contain a description!");
    }
    this.render(this.tasks);
  }

  //method to create list of todos
  addListWithTasks(chosenTaskArray) {
    const todoList = document.createElement("ul");
    todoList.className = "todo-list";
    chosenTaskArray.forEach((task, taskIndex) => {
      const li = document.createElement("li");
      li.classList.add("task");

      //button to start task
      const startTaskButton = document.createElement("div");
      startTaskButton.title = "Start task";
      const startIcon = document.createTextNode("\u2BC8");
      startTaskButton.appendChild(startIcon);
      startTaskButton.className = "task-button";
      startTaskButton.addEventListener("click", () => {
        task.isInProgress = true;
        task.isPending = false;
        updateTask(task, li, startTaskButton, completeTaskButton);
        this.saveTaskInLocalStorage();
      });

      //button to complete task
      const completeTaskButton = document.createElement("div");
      completeTaskButton.title = "Complete task";
      const completeIcon = document.createTextNode("\u2714");
      completeTaskButton.appendChild(completeIcon);
      completeTaskButton.className = "task-button";
      completeTaskButton.addEventListener("click", () => {
        if (task.isPending) {
          alert("You need to start the task first!");
          return;
        }
        task.isInProgress = false;
        task.isPending = false;
        task.isCompleted = true;
        updateTask(task, li, startTaskButton, completeTaskButton);
        this.saveTaskInLocalStorage();
      });

      //button to remove task
      const removeTaskButton = document.createElement("div");
      removeTaskButton.title = "Delete task";
      const removeIcon = document.createTextNode("\u2716"); //2714
      removeTaskButton.appendChild(removeIcon);
      removeTaskButton.className = "task-button";
      removeTaskButton.addEventListener("click", () => {
        if (!task.isCompleted) {
          alert("Can not delete incomplete task!");
          return;
        }
        todoList.removeChild(li);
        this.tasks = this.tasks
          .slice(0, taskIndex)
          .concat(this.tasks.slice(taskIndex + 1, this.tasks.length));
        this.saveTaskInLocalStorage();
        this.render(this.tasks);
      });

      //element to display description of todo
      const textContainer = document.createElement("div");
      textContainer.innerHTML = task.description;
      li.appendChild(textContainer);

      updateTask(task, li, startTaskButton, completeTaskButton);

      //create container to keep buttons to change todo's status
      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("buttons-container");
      buttonsContainer.appendChild(startTaskButton);
      buttonsContainer.appendChild(completeTaskButton);
      buttonsContainer.appendChild(removeTaskButton);
      li.appendChild(buttonsContainer);
      todoList.appendChild(li);
    });
    this.listContainer.appendChild(todoList);

    //method to colorize todo item based on its status
    function updateTask(
      task,
      li,
      startTaskButton,
      completeTaskButton
    ) {
      if (task.isCompleted) {
        li.classList.add("task-completed");
        startTaskButton.classList.add("disabled-button");
        completeTaskButton.classList.add("disabled-button");
      }
      if (task.isInProgress) {
        li.classList.add("task-inprogress");
        startTaskButton.classList.add("disabled-button");
      }
    }
  }

  //method adds a select component that filters tasks by their status
  addSelect() {
    const selectList = document.createElement("select");
    selectList.id = "selectList";
    selectList.classList.add("selectlist");
    selectList.addEventListener("change", (e) => {
      this.filteredTasks =
        e.target.value.length > 0
          ? this.tasks.filter((task) => task[e.target.value])
          : this.tasks;
      this.render(this.filteredTasks);
    });
    this.toolsContainer.appendChild(selectList);
    for (var i = 0; i < TASK_STATES.length; i++) {
      var option = document.createElement("option");
      option.value = TASK_STATES[i].value;
      option.text = TASK_STATES[i].name;
      selectList.appendChild(option);
    }
  }

  //add input and button ui-elements
  addPromptFormForAddingTasks() {
    const input = document.createElement("input");
    input.classList.add("input-task-field");
    const button = document.createElement("button");
    button.classList.add("button-task-field");
    input.autofocus = true;
    input.placeholder = button.innerText = "Add Task";

    button.addEventListener("click", () => {
      this.addTaskToList(input.value);
      input.value = "";
      document.getElementById("selectList").value = "";
    });

    this.toolsContainer.appendChild(input);
    this.toolsContainer.appendChild(button);
  }

  //method to save tasks in localStorage
  saveTaskInLocalStorage() {
    window.localStorage.setItem("todotasks", JSON.stringify(this.tasks));
  }
}
//insert component in div on main page with id "app"
const todo = new ToDoList(document.getElementById("app"));
