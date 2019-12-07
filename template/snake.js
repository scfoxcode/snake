// Function to export that contains the game
function Snake(containerId) {
    const self = this;
    this.welcome = 'Hello, lets play Snake!';
    this.gameOver = false;
    this.containerId = containerId;
    this.ctx = null;
    this.gridProps = {
        blockSize: 16,
        numColumns: 32,
        numRows: 32,
        gridGap: 2
    };

    this.init(); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        self.update();
        self.render(self.ctx);
    }, 200);
}

Snake.prototype.init = function() {
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

Snake.prototype.update = function() {
};

// BEGIN RENDER FUNCTIONS
Snake.prototype.drawRect = function(ctx, x, y, width, height, colour) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = colour;
    ctx.fill();
};

Snake.prototype.drawSquare = function(ctx, x, y, size, colour) {
    this.drawRect(ctx, x, y, size, size, colour);
};

Snake.prototype.render = function(ctx) {
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