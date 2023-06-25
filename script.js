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
let snakePosition = [0, 0];

// Move the snake into the direction 1 checkbox every second
let moveSnake = setInterval(updatePosition, 1000);

function updatePosition() {
  switch (snakeDirection) {
    case "left":
      snakePosition[0]++;
  }
}
