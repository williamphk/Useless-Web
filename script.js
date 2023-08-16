// Dom element
const gameBoard = document.getElementById("game-board");

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
const boardSizeX = screenWidth / 30;
const boardSizeY = screenHeight / 30;

// Create the game board
for (let i = 0; i < boardSizeY; i++) {
  let row = document.createElement("div");
  row.className = "row";
  row.id = `row-${i}`;

  for (let j = 0; j < boardSizeX; j++) {
    let cell = document.createElement("input");
    cell.type = "checkbox";
    cell.className = "cell";
    cell.id = `cell-${j}-${i}`;

    row.appendChild(cell);
  }

  gameBoard.appendChild(row);
}

// Game logic
let snakeDirection = "right";
let snakeLength = 6;
let snakePosition = [
  [5, 5],
  [4, 5],
  [3, 5],
  [2, 5],
  [1, 5],
  [0, 5],
];
let gameEnd = false;
let snakeAte = false;
let speed = 70;

// Mapping of directions to array indices and operations
const directionMap = {
  left: { index: 0, operation: (x) => x - 1 },
  right: { index: 0, operation: (x) => x + 1 },
  up: { index: 1, operation: (x) => x - 1 },
  down: { index: 1, operation: (x) => x + 1 },
};

// Check the snake in start position
for (let i = 0; i < snakeLength; i++) {
  document.getElementById(
    `cell-${snakePosition[i][0]}-${snakePosition[i][1]}`
  ).checked = true;
}

checkRandomCellAsFood();

// Check a random cell as food
function checkRandomCellAsFood() {
  let randomX = Math.floor(Math.random() * (screenWidth / 30));
  let randomY = Math.floor(Math.random() * (screenHeight / 30));
  let randomCell = document.getElementById(`cell-${randomX}-${randomY}`);
  if (randomCell.checked === true) {
    checkRandomCellAsFood();
  }
  randomCell.checked = true;
  randomCell.style.accentColor = "red";
  randomCell.style.boxShadow = "0 0 10px 2px red";
  randomCell.setAttribute("data-food", true);
}

// Start the game
const startBtn = document.getElementById("start");
startBtn.addEventListener("click", function (e) {
  if (startBtn.value === "Restart") {
    location.reload();
  }
  e.target.disabled = true;
  // Move the snake into the direction 1 checkbox every second
  let moveSnake = setInterval(updatePosition, speed);

  // Update the snake visual position
  function updatePosition() {
    let lastCell = document.getElementById(
      `cell-${snakePosition[snakeLength - 1][0]}-${
        snakePosition[snakeLength - 1][1]
      }`
    );

    updateSnakeArray();

    if (gameEnd || snakeAte) {
    } else {
      // Uncheck the last cell
      lastCell.checked = false;
    }
    snakeAte = false;
    //console.log(lastCell);

    // Check the new head
    let forwardCell = document.getElementById(
      `cell-${snakePosition[0][0]}-${snakePosition[0][1]}`
    );
    if (forwardCell) {
      forwardCell.checked = true;
    }
    //console.log(forwardCell);
  }

  // Event listener for arrow keys
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        if (snakeDirection !== "right") snakeDirection = "left";
        break;
      case "ArrowRight":
        if (snakeDirection !== "left") snakeDirection = "right";
        break;
      case "ArrowUp":
        if (snakeDirection !== "down") snakeDirection = "up";
        break;
      case "ArrowDown":
        if (snakeDirection !== "up") snakeDirection = "down";
        break;
    }
  });

  function updateSnakeArray() {
    const { index, operation } = directionMap[snakeDirection];
    // Copy the current head position
    const newHead = [...snakePosition[0]];
    newHead[index] = operation(newHead[index]); // Update the relevant coordinate

    // Check if the snake is out of bounds
    if (
      newHead[0] < 0 ||
      newHead[0] > screenWidth / 30 ||
      newHead[1] < 0 ||
      newHead[1] > screenHeight / 30
    ) {
      gameOver(moveSnake);
    }

    // Check if the snake ate the food
    let snakeHead = document.getElementById(`cell-${newHead[0]}-${newHead[1]}`);
    if (
      snakeHead &&
      snakeHead.checked === true &&
      snakeHead.getAttribute("data-food") === "true"
    ) {
      console.log("Snake ate");
      if (snakeLength % 5 === 0) {
        speed -= 5;
        clearInterval(moveSnake);
        moveSnake = setInterval(updatePosition, speed);
      }
      snakePosition.unshift(newHead); // Add the new head to the snake body
      snakeLength++;
      snakeAte = true;
      snakeHead.removeAttribute("data-food");
      checkRandomCellAsFood();
      snakeHead.style.accentColor = "#00ff1e";
      snakeHead.style.boxShadow = "0 0 10px rgb(255, 255, 255)";
      return;
    }
    if (snakeHead && snakeHead.checked === true) {
      gameOver(moveSnake);
      return;
    }
    snakePosition.unshift(newHead); // Add the new head to the snake body
    snakePosition.pop();
  }
});

function gameOver(moveSnake) {
  console.log("Game over");
  clearInterval(moveSnake);
  gameEnd = true;
  setTimeout(() => uncheckAll(), 500);
  setTimeout(() => printGameOverWithCheckbox(), 600);
  startBtn.disabled = false;
  startBtn.value = "Restart";
}

function uncheckAll() {
  for (let i = 0; i < boardSizeY; i++) {
    for (let j = 0; j < boardSizeX; j++) {
      document.getElementById(`cell-${j}-${i}`).checked = false;
      document.getElementById(`cell-${j}-${i}`).style.boxShadow = "none";
    }
  }
}

function printGameOverWithCheckbox() {
  // G
  for (let j = 4; j < 9; j++) {
    document.getElementById(`cell-${j}-${6}`).checked = true;
  }
  for (let i = 7; i < 13; i++) {
    document.getElementById(`cell-${4}-${i}`).checked = true;
  }
  for (let j = 5; j < 9; j++) {
    document.getElementById(`cell-${j}-${12}`).checked = true;
  }
  for (let i = 9; i < 12; i++) {
    document.getElementById(`cell-${8}-${i}`).checked = true;
  }
  document.getElementById(`cell-${7}-${9}`).checked = true;
  // A
  document.getElementById(`cell-${13}-${6}`).checked = true;
  document.getElementById(`cell-${12}-${7}`).checked = true;
  document.getElementById(`cell-${14}-${7}`).checked = true;
  for (let i = 8; i < 13; i++) {
    document.getElementById(`cell-${11}-${i}`).checked = true;
  }
  for (let i = 8; i < 13; i++) {
    document.getElementById(`cell-${15}-${i}`).checked = true;
  }
  for (let j = 12; j < 15; j++) {
    document.getElementById(`cell-${j}-${10}`).checked = true;
  }
  // M
  document.getElementById(`cell-${19}-${7}`).checked = true;
  document.getElementById(`cell-${21}-${7}`).checked = true;
  document.getElementById(`cell-${20}-${8}`).checked = true;
  for (let i = 6; i < 13; i++) {
    document.getElementById(`cell-${18}-${i}`).checked = true;
  }
  for (let i = 6; i < 13; i++) {
    document.getElementById(`cell-${22}-${i}`).checked = true;
  }
  // E
  for (let j = 26; j < 30; j++) {
    document.getElementById(`cell-${j}-${6}`).checked = true;
  }
  for (let j = 26; j < 30; j++) {
    document.getElementById(`cell-${j}-${9}`).checked = true;
  }
  for (let j = 26; j < 30; j++) {
    document.getElementById(`cell-${j}-${12}`).checked = true;
  }
  for (let i = 6; i < 13; i++) {
    document.getElementById(`cell-${25}-${i}`).checked = true;
  }

  // O
  for (let j = 11; j < 16; j++) {
    document.getElementById(`cell-${j}-${15}`).checked = true;
  }
  for (let i = 16; i < 21; i++) {
    document.getElementById(`cell-${11}-${i}`).checked = true;
  }
  for (let j = 11; j < 16; j++) {
    document.getElementById(`cell-${j}-${21}`).checked = true;
  }
  for (let i = 16; i < 21; i++) {
    document.getElementById(`cell-${15}-${i}`).checked = true;
  }
  // V
  document.getElementById(`cell-${19}-${19}`).checked = true;
  document.getElementById(`cell-${19}-${20}`).checked = true;
  document.getElementById(`cell-${21}-${19}`).checked = true;
  document.getElementById(`cell-${21}-${20}`).checked = true;
  document.getElementById(`cell-${20}-${21}`).checked = true;
  for (let i = 15; i < 19; i++) {
    document.getElementById(`cell-${18}-${i}`).checked = true;
  }
  for (let i = 15; i < 19; i++) {
    document.getElementById(`cell-${22}-${i}`).checked = true;
  }
  // R
  document.getElementById(`cell-${26}-${19}`).checked = true;
  document.getElementById(`cell-${27}-${20}`).checked = true;
  document.getElementById(`cell-${28}-${20}`).checked = true;
  document.getElementById(`cell-${29}-${21}`).checked = true;
  for (let i = 15; i < 22; i++) {
    document.getElementById(`cell-${25}-${i}`).checked = true;
  }
  for (let j = 26; j < 29; j++) {
    document.getElementById(`cell-${j}-${15}`).checked = true;
  }
  for (let j = 26; j < 29; j++) {
    document.getElementById(`cell-${j}-${18}`).checked = true;
  }
  for (let i = 16; i < 18; i++) {
    document.getElementById(`cell-${29}-${i}`).checked = true;
  }

  // E
  for (let j = 33; j < 37; j++) {
    document.getElementById(`cell-${j}-${15}`).checked = true;
  }
  for (let j = 33; j < 37; j++) {
    document.getElementById(`cell-${j}-${18}`).checked = true;
  }
  for (let j = 33; j < 37; j++) {
    document.getElementById(`cell-${j}-${21}`).checked = true;
  }
  for (let i = 15; i < 22; i++) {
    document.getElementById(`cell-${32}-${i}`).checked = true;
  }
}
