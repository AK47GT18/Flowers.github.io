
let board;
let boardWidth;
let boardHeight;
let context;
let flappyimg;
let birdHeight;
let birdWidth;
let birdX;
let birdY;
let bird;
let velocityX;
let velocityY;
let gravity;
let GameOver;
let score;
let pipeArray;
let pipeHeight;
let pipeWidth;
let pipeX;
let pipeY;
let toppipeImg;
let bottompipeImg;
let wingSound = new Audio("Sounds/sfx_wing.wav");
let winghit = new Audio("Sounds/sfx_hit.wav");
/*let gameSound = new Audio ("Sounds/bgm_mario.mp3");*/
let gameSound = new Audio ("Sounds/mymusic.mp3");
gameSound.loop = true;
let flappydeath = new Audio("Sounds/sfx_die.wav");

// Initialize game based on screen size
function initializeGameDimensions() {
    // Get device screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Set board dimensions based on screen size
    boardWidth = Math.min(screenWidth * 0.95, 600); // Cap maximum width
    boardHeight = Math.min(screenHeight * 0.8, 800); // Cap maximum height

    // Scale game elements based on board size
    birdWidth = boardWidth * 0.07; // Smaller bird for mobile
    birdHeight = boardHeight * 0.04;
    birdX = boardWidth / 8;
    birdY = boardHeight / 2;

    // Adjust pipe dimensions
    pipeWidth = boardWidth * 0.15; // Thinner pipes for mobile
    pipeHeight = boardHeight * 0.8;
    pipeX = boardWidth;
    pipeY = 0;

    // Adjust physics for screen size
    velocityX = -2 * (boardWidth / 400); // Scale velocity to screen width
    velocityY = 0;
    gravity = 0.4 * (boardHeight / 600); // Scale gravity to screen height

    // Initialize bird object
    bird = {
        x: birdX,
        y: birdY,
        width: birdWidth,
        height: birdHeight
    };

    // Reset game state
    GameOver = false;
    score = 0;
    pipeArray = [];
}

// Handle screen rotation and resize
function handleResize() {
    initializeGameDimensions();
    if (board) {
        board.width = boardWidth;
        board.height = boardHeight;
    }
}

window.onload = function() {
   
    // Initialize game dimensions
    initializeGameDimensions();

    // Setup canvas
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Add meta viewport tag for better mobile rendering
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }

    // Load images
    flappyimg = new Image();
    flappyimg.src = "images/flappybird.png";
    flappyimg.onload = function() {
        context.drawImage(flappyimg, bird.x, bird.y, bird.width, bird.height);
    };

    toppipeImg = new Image();
    toppipeImg.src = "images/toppipe.png";
    bottompipeImg = new Image();
    bottompipeImg.src = "images/bottompipe.png";

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    document.addEventListener("keydown", moveBird);
    
    // Improve touch controls
    document.addEventListener("touchstart", function(e) {
        e.preventDefault(); // Prevent double-firing on some devices
        wingSound.play();
        if(gameSound.paused)
         {
            gameSound.play();
           

         }       
        velocityY = -6 * (boardHeight / 600); // Scale jump height to screen size
        if (GameOver) {
            resetGame();
        }
    }, { passive: false });

    // Start game loop
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
};

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    GameOver = false;
}

function update() {
    requestAnimationFrame(update);
    if (GameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Update bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(flappyimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        GameOver = true;
    }

    // Update pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1;
            pipe.passed = true;
        }

        if (collide(bird, pipe)) {
            winghit.play();
            GameOver = true;
        }
    }

    // Clean up pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Draw score
    context.fillStyle = "white";
    context.font = `${Math.max(boardWidth * 0.06, 20)}px sans-serif`; // Responsive font size
    context.fillText(score, 5, boardHeight * 0.1);

    if (GameOver) {
        context.fillStyle = "red";
        context.fillText("GAME OVER", boardWidth * 0.2, boardHeight * 0.2);
        gameSound.pause();
        gameSound.currentTime = 0;
    }
}

function placePipes() {
    if (GameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight * 0.25; // Adaptive opening size

    let topPipe = {
        img: toppipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottompipeImg,
        x: pipeX,
        y: randomPipeY + openingSpace + pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        wingSound.play();
        if(gameSound.paused)
         {
            gameSound.play();
           

         }        
        velocityY = -6 * (boardHeight / 600); // Scale jump height to screen size
        if (GameOver) {
            resetGame();
        }
    }
}

function collide(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;


}