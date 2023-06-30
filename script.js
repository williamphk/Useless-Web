// Dom element
const gameBoard = document.getElementById("game-board");

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
const boardSizeX = screenWidth / 30;
const boardSizeY = screenHeight / 30;

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
let functionCount = 0;

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

// Check a random cell as food
let randomX = Math.floor(Math.random() * (screenWidth / 30));
let randomY = Math.floor(Math.random() * (screenHeight / 30));
let randomCell = document.getElementById(`cell-${randomX}-${randomY}`);
randomCell.checked = true;

// Move the snake into the direction 1 checkbox every second
let moveSnake = setInterval(updatePosition, 400);

function updatePosition() {
  let lastCell = document.getElementById(
    `cell-${snakePosition[snakeLength - 1][0]}-${
      snakePosition[snakeLength - 1][1]
    }`
  );
  lastCell.checked = false;
  //console.log(lastCell);

  // set random direction for snake
  //snakeDirection = getRandomDirection(snakeDirection);

  updateSnakeArray();
  functionCount = 0;
  let forwardCell = document.getElementById(
    `cell-${snakePosition[0][0]}-${snakePosition[0][1]}`
  );
  forwardCell.checked = true;
  console.log(forwardCell);
}

// Event listener for arrow keys
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      snakeDirection = "left";
      break;
    case "ArrowRight":
      snakeDirection = "right";
      break;
    case "ArrowUp":
      snakeDirection = "up";
      break;
    case "ArrowDown":
      snakeDirection = "down";
      break;
  }
});

// helper function
function getRandomDirection(currentDirection) {
  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  let directions = [
    "up",
    "down",
    "left",
    "right",
    currentDirection,
    currentDirection,
    currentDirection,
  ];

  // Remove the opposite direction
  directions = directions.filter(
    (direction) => direction !== opposite[currentDirection]
  );

  const randomIndex = Math.floor(Math.random() * directions.length);

  return directions[randomIndex];
}

function updateSnakeArray() {
  functionCount++;

  if (functionCount > 3) {
    clearInterval(moveSnake);
    return;
  }
  const { index, operation } = directionMap[snakeDirection];
  // Copy the current head position
  const newHead = [...snakePosition[0]];
  newHead[index] = operation(newHead[index]); // Update the relevant coordinate

  if (
    newHead[0] < 0 ||
    newHead[0] > screenWidth / 30 ||
    newHead[1] < 0 ||
    newHead[1] > screenHeight / 30
  ) {
    snakeDirection = getRandomDirection(snakeDirection);
    updateSnakeArray();
    return;
  }
  if (
    document.getElementById(`cell-${newHead[0]}-${newHead[1]}`).checked === true
  ) {
    snakeDirection = getRandomDirection(snakeDirection);
    updateSnakeArray();
    return;
  }
  snakePosition.unshift(newHead); // Add the new head to the snake body
  snakePosition.pop();
}
