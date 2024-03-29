// Function to export that contains the game
function SnakeGame(containerId) {
    const self = this;
    this.welcome = 'Hello, lets play Snake!';
    this.gameOver = false;
    this.containerId = containerId;
    this.ctx = null;
    this.gridProps = {
        blockSize: 32,
        numColumns: 16,
        numRows: 16,
        gridGap: 2
    };

    this.init(); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        self.update();
        self.render(self.ctx);
    }, 150);
}

// Shortcut for adding keyboard input
// Must be modified for your snake data structure
// SnakeGame.prototype.keyboardHandler = function(e) {
//     console.log("This happened");
//     const { snake } = this.state;
//     if (e.key === 'ArrowLeft' || e.key === 'a') {
//         if (snake.direction !== 'right') {
//             snake.pendingDirection = 'left';
//         }
//     } else if (e.key === 'ArrowRight' || e.key === 'd') {
//         if (snake.direction !== 'left') {
//             snake.pendingDirection = 'right';
//         }
//     } else if (e.key === 'ArrowUp' || e.key === 'w') {
//         if (snake.direction !== 'down') {
//             snake.pendingDirection = 'up';
//         }
//     } else if (e.key === 'ArrowDown' || e.key === 's') {
//         if (snake.direction !== 'up') {
//             snake.pendingDirection = 'down';
//         }    
//     }
// };

SnakeGame.prototype.init = function() {
    console.log(this.welcome);
    const { blockSize, numColumns, numRows, gridGap } = this.gridProps;

    // Initialise the canvas and add it to the dom
    const canvas = document.createElement('canvas');
    canvas.width = blockSize * numColumns + (numColumns - 1) * gridGap;
    canvas.height = blockSize * numRows + (numRows - 1) * gridGap;
    const container = document.getElementById(this.containerId);
    container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
};

SnakeGame.prototype.update = function() {
};

// BEGIN RENDER FUNCTIONS
SnakeGame.prototype.drawRect = function(ctx, x, y, width, height, colour) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = colour;
    ctx.fill();
};

SnakeGame.prototype.drawSquare = function(ctx, x, y, size, colour) {
    this.drawRect(ctx, x, y, size, size, colour);
};

SnakeGame.prototype.render = function(ctx) {
    const { blockSize, numColumns, numRows, gridGap } = this.gridProps;

    // Clear canvas
    this.drawRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#EEE');

    // Draw grid
    for (let i=0; i<numColumns; i++) {
        for (let j=0; j<numRows; j++) {
            this.drawSquare(
                ctx,
                i * blockSize + i * gridGap,
                j * blockSize + j * gridGap,
                blockSize,
                '#DDE',
            );
        }
    }
};
// END RENDER FUNCTIONS