// Import the functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4zhzWU4dwovbYPyrWuct9s8qFQcP27AM",
  authDomain: "checkbox-snake-9cb23.firebaseapp.com",
  projectId: "checkbox-snake-9cb23",
  storageBucket: "checkbox-snake-9cb23.appspot.com",
  messagingSenderId: "798229108705",
  appId: "1:798229108705:web:cb3aaa1687ed797ef624a0",
  measurementId: "G-42PQQYM2X3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dom element
const gameBoard = document.getElementById("game-board");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const topFive = document.getElementById("top-five");

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
getTopFiveScores();

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
let numOfCellVisited = 0;

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
    // Get the last cell before the snake positon array is updated
    let lastCell = document.getElementById(
      `cell-${snakePosition[snakeLength - 1][0]}-${
        snakePosition[snakeLength - 1][1]
      }`
    );

    // Check the new head
    let forwardCell = document.getElementById(
      `cell-${snakePosition[0][0]}-${snakePosition[0][1]}`
    );

    if (forwardCell && forwardCell.style.boxShadow === "") {
      score2.innerHTML = `Number of cell visited: ${numOfCellVisited++}`;
    }

    // Update the snake position array
    updateSnakeArray();

    // Uncheck the last cell
    if (!gameEnd && !snakeAte) {
      lastCell.checked = false;
    }
    snakeAte = false;

    // Check the new head
    if (forwardCell) {
      forwardCell.checked = true;
      forwardCell.style.accentColor = getRandomColor();
      forwardCell.style.boxShadow = `0 0 10px ${getRandomColor()}`;
    }
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
    // Update the relevant coordinate
    newHead[index] = operation(newHead[index]);

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
      //console.log("Snake ate");

      // Increase the speed every 5 food ate
      if (snakeLength % 5 === 0) {
        speed -= 5;
        clearInterval(moveSnake);
        moveSnake = setInterval(updatePosition, speed);
      }

      // Update the score
      score1.innerHTML = `Number of food ate: ${snakeLength - 5}`;

      // Add the new head to the snake body
      snakePosition.unshift(newHead);
      snakeLength++;
      snakeAte = true;
      snakeHead.removeAttribute("data-food");
      checkRandomCellAsFood();
      snakeHead.style.accentColor = "red";
      snakeHead.style.boxShadow = "0 0 10px red";
      return;
    }

    // Check if the snake ate itself
    if (snakeHead && snakeHead.checked === true) {
      gameOver(moveSnake);
      return;
    }

    // Add the new head to the snake body
    snakePosition.unshift(newHead);
    // Remove the last cell of the snake body
    snakePosition.pop();
  }
});

// Game over
function gameOver(moveSnake) {
  console.log("Game over");
  clearInterval(moveSnake);
  gameEnd = true;
  setTimeout(() => uncheckAll(), 500);
  setTimeout(() => printGameOverWithCheckbox(), 600);
  startBtn.disabled = false;
  storeScore(snakeLength - 6, numOfCellVisited - 1);
  startBtn.value = "Restart";
}

// Uncheck all the cells
function uncheckAll() {
  for (let i = 0; i < boardSizeY; i++) {
    for (let j = 0; j < boardSizeX; j++) {
      document.getElementById(`cell-${j}-${i}`).checked = false;
    }
  }
}

// Helper functions
// Print Game Over with checkbox
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

// Get random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Store score to firebase
async function storeScore(score1, score2) {
  try {
    const scores = collection(db, "scores");
    const docRef = await addDoc(scores, {
      score1: score1,
      score2: score2,
    });
    console.log("Document written with ID: ", docRef.id);
    getTopFiveScores();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Get top 5 scores from firebase
async function getTopFiveScores() {
  const scores = collection(db, "scores");
  const q = query(scores, orderBy("score1", "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  const ul = document.createElement("ul");
  topFive.innerHTML = "<p>Top 5 Scores:</p>";
  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `Food: ${doc.data().score1}
     Color: ${doc.data().score2}`;
    ul.append(li);
  });
  topFive.append(ul);
}
