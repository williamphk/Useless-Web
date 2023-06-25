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
    cell.id = `cell-${i}-${j}`;

    row.appendChild(cell);
  }

  gameBoard.appendChild(row);
}

// Game logic
let snakeDirection = "left";
let snakeLength = 1;
let snakePosition = [[0, 0]];

// Mapping of directions to array indices and operations
const directionMap = {
  left: { index: 0, operation: (x) => x + 1 },
  right: { index: 0, operation: (x) => x - 1 },
  up: { index: 1, operation: (x) => x + 1 },
  down: { index: 1, operation: (x) => x - 1 },
};

// Check the first cell
let firstCell = document.getElementById(`cell-${0}-${0}`);
firstCell.checked = true;

// Move the snake into the direction 1 checkbox every second
let moveSnake = setInterval(updatePosition, 1000);

function updatePosition() {
  let lastCell = document.getElementById(
    `cell-${snakePosition[snakeLength - 1][1]}-${
      snakePosition[snakeLength - 1][0]
    }`
  );
  lastCell.checked = false;

  const { index, operation } = directionMap[snakeDirection];

  for (let i = 0; i < snakeLength; i++) {
    snakePosition[i][index] = operation(snakePosition[i][index]);
  }

  let forwardCell = document.getElementById(
    `cell-${snakePosition[0][1]}-${snakePosition[0][0]}`
  );
  forwardCell.checked = true;

  console.log(lastCell);
}
