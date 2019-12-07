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
    this.state = {
        snake: {
            head: {
                x: Math.floor(this.gridProps.numColumns / 2),
                y: Math.floor(this.gridProps.numRows / 2),
                next: null
            },
            color: '#F00',
            bodyColor: '#F88',
            direction: 'right'
        }
    }

    this.init(); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        self.update(self.state);
        self.render(self.ctx, self.state);
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

Snake.prototype.update = function(state) {
    const { snake } = state;

    // Determine new position for snake head
    let pos = {x: snake.head.x, y: snake.head.y};
    switch (snake.direction) {
        case 'left': pos.x -= 1; break;
        case 'right': pos.x += 1; break;
        case 'up': pos.y -= 1; break;
        case 'down': pos.y += 1; break;
    }

    snake.head.x = pos.x;
    snake.head.y = pos.y;

};

// BEGIN RENDER FUNCTIONS
Snake.prototype.drawRect = function(ctx, x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
};

Snake.prototype.drawSquare = function(ctx, x, y, size, color) {
    this.drawRect(ctx, x, y, size, size, color);
};

Snake.prototype.drawCell = function(ctx, x, y, color) {
    const { blockSize, gridGap } = this.gridProps;
    this.drawSquare(
        ctx,
        x * blockSize + x * gridGap,
        y * blockSize + y * gridGap,
        blockSize,
        color,
    );
}

Snake.prototype.render = function(ctx, state) {
    const { blockSize, numColumns, numRows, gridGap } = this.gridProps;

    // Clear canvas
    this.drawRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#EEE');

    // Draw grid
    for (let i=0; i<numColumns; i++) {
        for (let j=0; j<numRows; j++) {
            this.drawCell(ctx, i, j, '#DDE');
        }
    }

    // Draw snake
    const { snake } = state;
    this.drawCell(ctx, snake.head.x, snake.head.y, snake.color);
};
// END RENDER FUNCTIONS