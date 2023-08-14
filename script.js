//set board and snake parameters
const boardBorder = "black";
const boardBackground = "white";
const snakeCol = "pink";
const snakeBorder = "darkblue";

//set initial position of snake body with an array of coordinates
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

//assign score variable
let score = 0;
// Assign variable to changeDirection - True if changing direcion
let isChangingDirection = false;
//Assign food variables
let foodX;
let foodY;
//horizontal velocity (x) d=displacement
let dx = 10;
//vertical velocity
let dy = 0;

//Get the canvas/set game board
const snakeBoard = document.getElementById("snakeBoard");
// return a 2 dimensional drawing context
const snakeBoard_ctx = snakeBoard.getContext("2d");

//start game
main();

//Add food to gameBoard
genFood();
// add event listener for the keydown event and associ with the change dir function
document.addEventListener("keydown", changeDirection);

// main function called repeatedly to keep the game running
function main() {
  // add functions to main function

  if (gameHasEnded()) return;

  isChangingDirection = false;

  setTimeout(function onTick() {
    clearCanvass();
    drawFood();
    moveSnake();
    drawSnake();
    //call main again
    main();
  }, 100);
}

//draw a border around canvass
function clearCanvass() {
  // Select color to fill drawing
  snakeBoard_ctx.fillStyle = boardBackground;
  //select color for the border of the canvas
  snakeBoard_ctx.strokestyle = boardBorder;
  //Draw a "filled" rectangle to cover the entire canvass
  snakeBoard_ctx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  // Draw a "border" around entire canvas
  snakeBoard_ctx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

//function to draw a rectangle for each pair of coordinates of the snake on canvass
function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
    snakeBoard_ctx.fillStyle = 'lightgreen';
    snakeBoard_ctx.strokestyle = 'darkgreen';
    snakeBoard_ctx.fillRect(foodX, foodY, 10, 10);
    snakeBoard_ctx.strokeRect(foodX, foodY, 10, 10);
}

//function to draw a piece of snakes body with drawSnake
function drawSnakePart(snakePart) {
  //select the color of the snake part
  snakeBoard_ctx.fillStyle = snakeCol;
  // set the border color of the snakepart
  snakeBoard_ctx.strokestyle = snakeBorder;
  //Draw a "filled" rectangle to represent the snake part at the coordinates the part is located
  snakeBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  //Draw a board around the snake part
  snakeBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Add function for boundary conditions: snake hitting wall and itself
function gameHasEnded() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
        return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeBoard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeBoard.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

  //Generate a random set of coordinates for the food
  function randomFood(min, max) {
    return Math.round(Math.random() * (max - min) / 10) * 10;
}

//generate a new location for food so its not where the snake is
function genFood() {
    foodX = randomFood(0, snakeBoard.width - 10);
    foodY = randomFood(0, snakeBoard.height -10);
    snake.forEach(function snakeHasEatenFood(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) genFood();
    });
}

//add function assigning keys to change direction

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  //Prevent snake from reversing
  if (isChangingDirection) return;
  isChangingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

//Update moveSnake function to incorporate the score
function moveSnake() {
  //create new snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  //add new head to the beginning of snake body
  snake.unshift(head);
  const snakeEats = snake[0].x === foodX && snake[0].y === foodY;
  if (snakeEats) {
    //Increase score
    score += parseInt(10);
    // Display score on screen
    document.getElementById('score').innerHTML = score;
    // generate new food location
    genFood();
  } else {
    //get rid of tail
  snake.pop();
  }
}