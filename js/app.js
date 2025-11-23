const taskContainer = document.querySelector(".task-container");
const submitButton = document.querySelector(".submit-button");
const timeLeftDisplay = document.querySelector(".time-left");
const sliderFill = document.querySelector(".fill");

const startCount = 25 * 60;
let timeLeft = startCount;
let timerID;

timeLeftDisplay.textContent = convertToMin(timeLeft);

let tasks = [
  {
    name: "Paractice CSS Animations",
    priority: 0,
  },
  {
    name: "Dev Community Work",
    priority: 2,
  },
  {
    name: "Algoritm Studies",
    priority: 1,
  },
];

function handleClick(button) {
  switch (button.textContent) {
    case "ACTIVE":
      button.textContent = "PAUSED";
      clearInterval(timerID);
      button.classList.remove("active-button");
      button.classList.add("paused-button");
      break;
    case "PAUSED":
      button.textContent = "ACTIVE";
      countDown(button);
      button.classList.remove("paused-button");
      button.classList.add("active-button");
      break;
    default:
      const allButtons = document.querySelectorAll(".controller-button");
      allButtons.forEach((button) => {
        button.textContent = "START";
        button.classList.remove("active-button");
        button.classList.remove("paused-button");
        clearInterval(timerID);
        timeLeft = startCount;
        timeLeftDisplay.textContent = convertToMin(timeLeft);
        sliderFill.style.width = "100%";
      });

      button.textContent = "ACTIVE";
      button.classList.add("active-button");
      countDown(button);
      break;
  }
}

function countDown(button) {
  timerID = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = convertToMin(timeLeft);
    sliderFill.style.width = (timeLeft / startCount) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timerID);
      delete descendingTasks[button.id];
      button.parentNode.remove();
      timeLeft = startCount;
      timeLeftDisplay.textContent = convertToMin(startCount);
      sliderFill.style.width = "100%";
    }
  }, 1000);
}

//sort by priority
const descendingTasks = tasks.sort(
  (taskA, taskB) => taskA.priority - taskB.priority
);

function convertToMin(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft - minutes * 60;
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
}

function render() {
  descendingTasks.forEach((task, index) => {
    const taskBlockElement = document.createElement("div");
    const deleteIconElement = document.createElement("p");
    const titleElement = document.createElement("p");
    const controllerElement = document.createElement("button");

    taskBlockElement.classList.add("task-block");
    deleteIconElement.classList.add("delete-icon");
    controllerElement.classList.add("controller-button");

    deleteIconElement.textContent = "x";
    titleElement.textContent = task.name;
    controllerElement.textContent = "START";

    controllerElement.id = index;

    deleteIconElement.addEventListener("click", deleteTask);
    controllerElement.addEventListener("click", () =>
      handleClick(controllerElement)
    );

    taskBlockElement.append(deleteIconElement, titleElement, controllerElement);
    taskContainer.append(taskBlockElement);
  });
}

render();

function deleteTask(e) {
  e.target.parentNode.remove();
  delete descendingTasks[e.target.parentNode.lastChild.id];
  if (e.target.parentNode.lastChild.textContent !== "START") {
    timeLeft = startCount;
    timeLeftDisplay.textContent = convertToMin(startCount);
    sliderFill.style.width = "100%";
    clearInterval(timerID);
  }
}
function addTask() {
  const inputElement = document.querySelector("input");
  const value = inputElement.value;
  if (value) {
    taskContainer.innerHTML = "";
    inputElement.value = "";
    tasks.push({
      name: value,
      priority: tasks.length,
    });
    render();
  }
}

submitButton.addEventListener("click", addTask);
