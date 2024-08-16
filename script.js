const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvas.height = canvasSize;

let snake1, snake2, dx1, dy1, dx2, dy2, food, obstacle, gameOver, intervalId, speed, isPaused;

function resetGame() {
  snake1 = [{ x: 100, y: 200 }];
  dx1 = gridSize;
  dy1 = 0;
  
  snake2 = [{ x: 300, y: 200 }];
  dx2 = -gridSize;
  dy2 = 0;

  // Ensure snakes start at different positions
  while (snake1[0].x === snake2[0].x && snake1[0].y === snake2[0].y) {
    snake2 = [{ x: getRandomPosition().x, y: getRandomPosition().y }];
  }

  placeFood();
  placeObstacle();
  gameOver = false;
  isPaused = false;
  speed = 200; // Starting speed (200 ms per update)
  clearInterval(intervalId); // Clear any existing interval
  intervalId = setInterval(update, speed); // Start the game loop
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
  };
}

function placeFood() {
  food = getRandomPosition();
}

function placeObstacle() {
  obstacle = getRandomPosition();
}

function drawSnake(snake, color) {
  ctx.fillStyle = color;
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = 'green';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function drawObstacle() {
  ctx.fillStyle = 'red';
  ctx.fillRect(obstacle.x, obstacle.y, gridSize, gridSize);
}

function moveSnake(snake, dx, dy) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap the snake's position if it goes off the edge of the canvas
  if (head.x >= canvas.width) {
    head.x = 0;
  } else if (head.x < 0) {
    head.x = canvas.width - gridSize;
  }
  if (head.y >= canvas.height) {
    head.y = 0;
  } else if (head.y < 0) {
    head.y = canvas.height - gridSize;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    placeFood(); // Place a new food item at a random position
    adjustSpeed(); // Increase speed when the snake grows
  } else {
    snake.pop();
  }

  if (head.x === obstacle.x && head.y === obstacle.y) {
    gameOver = true;
  }

  // Check for collision with itself
  for (let i = 4; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
    }
  }
}

function checkCollision() {
  const head1 = snake1[0];
  const head2 = snake2[0];

  // Check for collision with the obstacle
  if (
    head1.x === obstacle.x && head1.y === obstacle.y ||
    head2.x === obstacle.x && head2.y === obstacle.y
  ) {
    gameOver = true;
  }

  // Check for collision with itself
  for (let i = 4; i < snake1.length; i++) {
    if (head1.x === snake1[i].x && head1.y === snake1[i].y) {
      gameOver = true;
    }
  }

  for (let i = 4; i < snake2.length; i++) {
    if (head2.x === snake2[i].x && head2.y === snake2[i].y) {
      gameOver = true;
    }
  }
}

function draw() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', 80, 200);
    clearInterval(intervalId); // Stop the game loop on game over
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake(snake1, 'lime');
  drawSnake(snake2, 'cyan');
  drawFood();
  drawObstacle();
}

function update() {
  if (!gameOver && !isPaused) {
    moveSnake(snake1, dx1, dy1);
    moveSnake(snake2, dx2, dy2);
    checkCollision();
  }
  draw();
}

function changeDirection1(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = dy1 === -gridSize;
  const goingDown = dy1 === gridSize;
  const goingRight = dx1 === gridSize;
  const goingLeft = dx1 === -gridSize;

  if (keyPressed === LEFT && !goingRight) {
    dx1 = -gridSize;
    dy1 = 0;
  }
  if (keyPressed === UP && !goingDown) {
    dx1 = 0;
    dy1 = -gridSize;
  }
  if (keyPressed === RIGHT && !goingLeft) {
    dx1 = gridSize;
    dy1 = 0;
  }
  if (keyPressed === DOWN && !goingUp) {
    dx1 = 0;
    dy1 = gridSize;
  }
}

function changeDirection2(event) {
  const keyPressed = event.keyCode;
  const A = 65; // 'A' key
  const W = 87; // 'W' key
  const S = 83; // 'S' key
  const D = 68; // 'D' key

  const goingUp = dy2 === -gridSize;
  const goingDown = dy2 === gridSize;
  const goingRight = dx2 === gridSize;
  const goingLeft = dx2 === -gridSize;

  if (keyPressed === A && !goingRight) {
    dx2 = -gridSize;
    dy2 = 0;
  }
  if (keyPressed === W && !goingDown) {
    dx2 = 0;
    dy2 = -gridSize;
  }
  if (keyPressed === D && !goingLeft) {
    dx2 = gridSize;
    dy2 = 0;
  }
  if (keyPressed === S && !goingUp) {
    dx2 = 0;
    dy2 = gridSize;
  }
}

function buttonChangeDirection(dir, player) {
  const goingUp = player === 1 ? dy1 === -gridSize : dy2 === -gridSize;
  const goingDown = player === 1 ? dy1 === gridSize : dy2 === gridSize;
  const goingRight = player === 1 ? dx1 === gridSize : dx2 === gridSize;
  const goingLeft = player === 1 ? dx1 === -gridSize : dx2 === -gridSize;

  if (dir === 'left' && !goingRight) {
    if (player === 1) {
      dx1 = -gridSize;
      dy1 = 0;
    } else {
      dx2 = -gridSize;
      dy2 = 0;
    }
  }
  if (dir === 'up' && !goingDown) {
    if (player === 1) {
      dx1 = 0;
      dy1 = -gridSize;
    } else {
      dx2 = 0;
      dy2 = -gridSize;
    }
  }
  if (dir === 'right' && !goingLeft) {
    if (player === 1) {
      dx1 = gridSize;
      dy1 = 0;
    } else {
      dx2 = gridSize;
      dy2 = 0;
    }
  }
  if (dir === 'down' && !goingUp) {
    if (player === 1) {
      dx1 = 0;
      dy1 = gridSize;
    } else {
      dx2 = 0;
      dy2 = gridSize;
    }
  }
}

function adjustSpeed() {
  // Decrease interval time as the snake grows to increase speed
  speed = Math.max(50, speed - 5); // Speed can't go below 50ms
  clearInterval(intervalId);
  intervalId = setInterval(update, speed);
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pause').innerText = isPaused ? 'Resume' : 'Pause';
}

document.addEventListener('keydown', (event) => {
  changeDirection1(event);
  changeDirection2(event);
});

document.getElementById('left').addEventListener('click', () => buttonChangeDirection('left', 1));
document.getElementById('up').addEventListener('click', () => buttonChangeDirection('up', 1));
document.getElementById('right').addEventListener('click', () => buttonChangeDirection('right', 1));
document.getElementById('down').addEventListener('click', () => buttonChangeDirection('down', 1));

document.getElementById('a').addEventListener('click', () => buttonChangeDirection('left', 2));
document.getElementById('w').addEventListener('click', () => buttonChangeDirection('up', 2));
document.getElementById('d').addEventListener('click', () => buttonChangeDirection('right', 2));
document.getElementById('s').addEventListener('click', () => buttonChangeDirection('down', 2));

document.getElementById('pause').addEventListener('click', togglePause);
document.getElementById('restart').addEventListener('click', resetGame);

resetGame();
