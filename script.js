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
let snakeLength = 3;
let snakePosition = [
  [2, 5],
  [1, 5],
  [0, 5],
];

// Mapping of directions to array indices and operations
const directionMap = {
  left: { index: 0, operation: (x) => x - 1 },
  right: { index: 0, operation: (x) => x + 1 },
  up: { index: 1, operation: (x) => x - 1 },
  down: { index: 1, operation: (x) => x + 1 },
};

// Check the first cell
let firstCell = document.getElementById(
  `cell-${snakePosition[0][0]}-${snakePosition[0][1]}`
);
firstCell.checked = true;

// Check a ramdom cell as food
let ramdomX = Math.floor(Math.random() * (screenWidth / 30));
let ramdomY = Math.floor(Math.random() * (screenHeight / 30));
let ramdomCell = document.getElementById(`cell-${ramdomX}-${ramdomY}`);
ramdomCell.checked = true;

// Move the snake into the direction 1 checkbox every second
let moveSnake = setInterval(updatePosition, 1000);

function updatePosition() {
  let lastCell = document.getElementById(
    `cell-${snakePosition[snakeLength - 1][0]}-${
      snakePosition[snakeLength - 1][1]
    }`
  );
  lastCell.checked = false;
  console.log(lastCell);

  const { index, operation } = directionMap[snakeDirection];

  for (let i = 0; i < snakeLength; i++) {
    snakePosition[i][index] = operation(snakePosition[i][index]);
  }
  console.log(snakePosition[0], snakePosition[1], snakePosition[2]);

  let forwardCell = document.getElementById(
    `cell-${snakePosition[0][0]}-${snakePosition[0][1]}`
  );
  forwardCell.checked = true;
}

// Event listener for arrow keys
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      snakeDirection = "left";
      for (let i = 1; i < snakeLength; i++) {
        snakePosition[i][0] = snakePosition[0][0] + i;
        snakePosition[i][1] = snakePosition[0][1];
      }
      break;
    case "ArrowRight":
      snakeDirection = "right";
      for (let i = 1; i < snakeLength; i++) {
        snakePosition[i][0] = snakePosition[0][0] - i;
        snakePosition[i][1] = snakePosition[0][1];
      }
      break;
    case "ArrowUp":
      snakeDirection = "up";
      for (let i = 1; i < snakeLength; i++) {
        snakePosition[i][0] = snakePosition[0][0];
        snakePosition[i][1] = snakePosition[0][1] + i;
      }
      break;
    case "ArrowDown":
      snakeDirection = "down";
      for (let i = 1; i < snakeLength; i++) {
        snakePosition[i][0] = snakePosition[0][0];
        snakePosition[i][1] = snakePosition[0][1] - i;
      }
      break;
  }
});
