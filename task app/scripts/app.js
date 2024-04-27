// start create task variables
const form = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const TaskDescription = document.getElementById("TaskDescription");
const taskCategory = document.getElementById("taskCategory");
const addTask = document.getElementById("addTask");

let appStatue = "add";
let holder;

// the tasks array
let tasksArray = localStorage.getItem("addedTasks")
  ? JSON.parse(localStorage.getItem("addedTasks"))
  : [];
// the tasks array

// start tasks render variables
let tasksCount = document.getElementById("tasksCount");
let tasks__holder = document.querySelector(".tasks__holder");
const clearAll = document.getElementById("clearAll");
// end tasks render variables

// end create task variables
form.addEventListener("submit", (e) => {
  if (taskTitle.value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Add your Task!",
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-center",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Task Added successfully",
    });
    setTimeout(() => {
      createTaskObj(taskTitle, TaskDescription, taskCategory);
      removeInputValues([taskTitle, TaskDescription, taskCategory]);
      renderData();
    }, 1000);
  }
});

// creating object of the task
function createTaskObj(taskTitle, TaskDescription, taskCategory) {
  if (appStatue === "add") {
    let taskObj = {
      id: parseInt(Math.random() * 1000000),
      title: taskTitle.value,
      description: TaskDescription.value,
      category: taskCategory.value,
      finished: false,
    };
    tasksArray.push(taskObj);
  } else {
    let choosen = tasksArray.find((item) => {
      return item.id === holder;
    });
    choosen.title = taskTitle.value;
    choosen.description = TaskDescription.value;
    choosen.category = taskCategory.value;
    addTask.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    appStatue = "add";
    renderData();
  }
  localStorage.setItem("addedTasks", JSON.stringify(tasksArray));
}

// remove the values from inputs after add
function removeInputValues(inputsArray) {
  inputsArray.forEach((element) => {
    element.value = "";
  });
}

/* start rendering the data from local storage to the DOM  */
function renderData() {
  let taskContainer = ``;
  if (tasksArray.length > 0) {
    tasksArray.forEach((task) => {
      taskContainer += ` 
      <div class="task" data-id="${task.id}">
      <h2>Task Title: ${task.title}</h2>
      <p>Description :  ${task.description}</p>
      <span>Category : ${task.category}</span>
      <div class="task__control">
      <button class="deleteTask"><i class="fa-solid fa-trash"></i></button>
      <button class="editTask"><i class="fa-solid fa-pen"></i></button>
      <button id="checkTask"><i class="fa-solid fa-check"></i></button>
      </div>
      </div>
      `;
      tasks__holder.innerHTML = taskContainer;
    });
  } else {
    tasks__holder.innerHTML = `<h4 id="empty">
    Add Your New Task <i class="fa-solid fa-plus"></i>
    </h4>`;
    let empty = document.getElementById("empty");
    empty.addEventListener("click", () => taskTitle.focus());
  }
  checkOnTasksArr();
  createDeleteBtns();
  createEditBtns();
}
renderData();

/* 
? this function about deleting ? 
todo 1- create delete btns 
todo 2- delete actions 
 */
function createDeleteBtns() {
  let deleteBtns = Array.from(document.querySelectorAll(".deleteTask"));
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(btn);
      renderData();
      checkOnTasksArr();
    });
  });
}
function deleteTask(btn) {
  let taskId = parseInt(btn.closest(".task").dataset.id);
  let task = btn.closest(".task");
  tasksArray = tasksArray.filter((item) => {
    return item.id !== taskId;
  });
  task.remove();
  localStorage.setItem("addedTasks", JSON.stringify(tasksArray));
}

/* 
? this function about editing ? 
todo 1- create edit btns 
todo 2- edit actions 
 */
function createEditBtns() {
  let editBtns = Array.from(document.querySelectorAll(".editTask"));
  editBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      editTask(btn);
    });
  });
}

function editTask(btn) {
  let taskId = parseInt(btn.closest(".task").dataset.id);
  let task = btn.closest(".task");
  let editedTask = tasksArray.find((item) => {
    return item.id === taskId;
  });
  taskTitle.value = editedTask.title;
  TaskDescription.value = editedTask.description;
  taskCategory.value = editedTask.category;
  appStatue = "edit";
  addTask.textContent = "Edit";
  // again
  holder = taskId;
}

// check if the array have tasks and exist in localstorage
function checkOnTasksArr() {
  if (tasksArray.length > 0) {
    tasksCount.innerHTML = `You Have ${tasksArray.length}`;
    clearAll.classList.add("active");
  } else {
    tasksCount.innerHTML = `No`;
    clearAll.classList.remove("active");
  }
}

// start clear all tasks function
clearAll.addEventListener("click", clearAllTasks);

function clearAllTasks() {
  Swal.fire({
    title: "Do you want to clear the tasks?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Clear All",
    denyButtonText: `Don't Clear`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Cleared!", "", "success");
      tasksArray = [];
      localStorage.removeItem("addedTasks");
      renderData();
      checkOnTasksArr();
      removeInputValues([taskTitle, TaskDescription, taskCategory]);
    } else if (result.isDenied) {
      Swal.fire("Tasks are not cleared", "", "info");
    }
  });
}
// end clear all tasks function
