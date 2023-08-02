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
  randomCell.setAttribute("data-food", true);
}

// Move the snake into the direction 1 checkbox every second
let moveSnake = setInterval(updatePosition, 100);

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
  forwardCell.checked = true;
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
    console.log("Game over");
    clearInterval(moveSnake);
    gameEnd = true;
  }

  // Check if the snake ate the food
  let snakeHead = document.getElementById(`cell-${newHead[0]}-${newHead[1]}`);
  if (
    snakeHead.checked === true &&
    snakeHead.getAttribute("data-food") === "true"
  ) {
    console.log("Snake ate");
    snakePosition.unshift(newHead); // Add the new head to the snake body
    snakeLength++;
    snakeAte = true;
    snakeHead.removeAttribute("data-food");
    checkRandomCellAsFood();
    return;
  }
  // if (snakeHead.checked === true) {
  //   console.log("Game over");
  //   clearInterval(moveSnake);
  //   gameEnd = true;
  //   return;
  // }
  snakePosition.unshift(newHead); // Add the new head to the snake body
  snakePosition.pop();
}
