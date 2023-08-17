# Useless-Web
https://williamphk.github.io/Useless-Web/

## Game Description
This JavaScript code is a part of a simple snake game where the snake moves across the screen, eating food and growing in length. The code defines the behavior of the snake, handles input from the arrow keys, and displays the game's status on the screen.

## Code Breakdown
### Initializing the Game Board:

`gameBoard`, `score1`, `score2` are selected using their respective DOM IDs.
The game board's dimensions are calculated based on the screen size, divided into 30px cells.
A grid is created by looping through the dimensions, with each cell represented by a checkbox input.
The game board is then populated with rows and cells.
### Setting Game Variables:

The snake's `direction`, `length`, `starting position`, `speed`, and other necessary variables are defined.
A mapping of directions to array indices and operations is also created for easy snake movement.
Checking the Snake's Starting Position:

The starting position of the snake is checked on the game board.
### Creating Food:

`checkRandomCellAsFood` function places food at random locations on the game board, ensuring that the food doesn't spawn on the snake itself.
### Game Start:

The 'Start' button initiates the game.
The `updatePosition` function updates the snake's visual position and handles logic for when the snake eats food or encounters various other game conditions.
Snake Movement & Color Changing:

The snake's movement is controlled by the arrow keys.
A random color is generated using `getRandomColor` function for styling purposes.
### Game Over Conditions:

If the snake goes out of bounds or runs into itself, the game ends.
The `gameOver` function is called to handle game over scenarios.
### Game Over Display:

The `uncheckAll` function unchecks all cells, clearing the board.
The `printGameOverWithCheckbox` function prints "GAME OVER" on the game board using checked checkboxes.

## Dependencies
No external libraries or dependencies are required for this code. It runs purely on vanilla JavaScript.
