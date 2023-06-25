const boardSize = 10;
const gameBoard = document.getElementById("game-board");

for (let i = 0; i < boardSize; i++) {
  let row = document.createElement("div");
  row.className = "row";
  row.id = `row-${i}`;

  for (let j = 0; j < boardSize; j++) {
    let cell = document.createElement("input");
    cell.type = "checkbox";
    cell.className = "cell";
    cell.id = `cell-${i}-${j}`;

    row.appendChild(cell);
  }

  gameBoard.appendChild(row);
}
