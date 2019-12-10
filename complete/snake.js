// Function to export that contains the game
function Snake(containerId) {
    const self = this;
    this.welcome = 'Hello, lets play Snake!';
    this.containerId = containerId;
    this.ctx = null;
    this.gridProps = {
        blockSize: 32,
        numColumns: 16,
        numRows: 16,
        gridGap: 2
    };
    this.state = {}; // Set in init
    this.play();
}

Snake.prototype.play = function() {
    var self = this;
    this.init(self.state); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        self.update(self.state);
        self.render(self.ctx, self.state);
    }, 150);
};

Snake.prototype.keyboardHandler = function(e) {
    console.log("This happened");
    const { snake } = this.state;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (snake.direction !== 'right') {
            snake.pendingDirection = 'left';
        }
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (snake.direction !== 'left') {
            snake.pendingDirection = 'right';
        }
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        if (snake.direction !== 'down') {
            snake.pendingDirection = 'up';
        }
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (snake.direction !== 'up') {
            snake.pendingDirection = 'down';
        }    
    }
};

Snake.prototype.init = function(state) {
    console.log(this.welcome);
    state.gameOver = false;
    const { blockSize, numColumns, numRows, gridGap } = this.gridProps;

    // Clear any existing items from parent container
    const container = document.getElementById(this.containerId);
    container.innerHTML = '';

    // Initialise the canvas and add it to the dom
    const canvas = document.createElement('canvas');
    canvas.width = blockSize * numColumns + (numColumns - 1) * gridGap;
    canvas.height = blockSize * numRows + (numRows - 1) * gridGap;
    
    container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');

    // Initialise the snake state
    state.snake = {
        head: {
            x: Math.floor(this.gridProps.numColumns / 2),
            y: Math.floor(this.gridProps.numRows / 2),
            next: null
        },
        color: '#F00',
        bodyColor: '#F88',
        direction: 'right',
        pendingDirection: 'right'
    };
    state.snake.head.uidPos = this.uidPos({
        x: state.snake.head.x,
        y: state.snake.head.y
    });
    
    // Snake should be called game, and state.snake should be it's own object

    // Set food state
    state.food = [];

    // Clear any existing handlers and add new ones
    window.removeEventListener('keydown', this.keyboardHandler.bind(this));
    window.addEventListener('keydown', this.keyboardHandler.bind(this));
};

Snake.prototype.uidPos = function(pos) {
    return ('' + pos.x + '_' + pos.y);
};

Snake.prototype.posFromUid = function(uid) {
    const values = uid.split('_');
    return {x: parseInt(values[0]), y: parseInt(values[1])};
};

Snake.prototype.mapSnakeNodes = function(snake, f) {
    const results = [];
    let node = snake.head;
    let index = 0;
    while (node) {
        results.push(f(node, index));
        node = node.next;
        ++index;
    }
    return results;
};

Snake.prototype.move = function(snake, pos, preserveTail) {
    // Create new head
    const oldHead = snake.head;
    const newHead = {
        x: pos.x,
        y: pos.y,
        next: oldHead,
        uidPos: this.uidPos(pos)
    }
    snake.head = newHead;

    // Useful for when we've eaten food
    if (preserveTail) {
        return;
    }

    // Delete old tail
    let node = snake.head;
    while (node && node.next) {
        if (!node.next.next) {
            node.next = null;
        }
        node = node.next;
    }
    // Probably makes sense to store next and prev, makes this much simpler
}

// This is expensive, minimise calls
Snake.prototype.listFreeCells = function() {
    const { numColumns, numRows } = this.gridProps;
    const { snake, food } = this.state;
    const takenCells = [];

    // List cells snake occupies
    this.mapSnakeNodes(snake, node => {
        takenCells.push(node.uidPos);
    });

    // Determine free cells
    const freeCells = [];
    for (let i=0; i<numColumns; i++) {
        for (let j=0; j<numRows; j++) {
            const id = this.uidPos({x: i, y: j});
            if (!takenCells.includes(id)) {
                freeCells.push(id);
            }
        }
    }

    return freeCells;
}

Snake.prototype.update = function(state) {
    const { snake, food } = state;
    const { numColumns, numRows } = this.gridProps;

    // Apply direction provided from event handlers
    snake.direction = snake.pendingDirection;

    // Determine new position for snake head
    let pos = {x: snake.head.x, y: snake.head.y};
    switch (snake.direction) {
        case 'left': pos.x -= 1; break;
        case 'right': pos.x += 1; break;
        case 'up': pos.y -= 1; break;
        case 'down': pos.y += 1; break;
    }

    let foodEaten = false;
    const foodUid = this.uidPos(pos);
    for (let i=0; i<food.length; i++) {
        if (food[i].uid === foodUid) {
            foodEaten = true;
            food.splice(i, 1);
            break;
        }
    }

    // If it is legal, set new head position
    this.move(snake, pos, foodEaten);

    // Create food
    if (!food.length) {
        const freeCells = this.listFreeCells();
        const pick = Math.floor(Math.random() * (freeCells.length -1));
        const foodPos = this.posFromUid(freeCells[pick]);
        state.food.push({pos: foodPos, uid: freeCells[pick]});
    }

    // Check if position is legal
    let legal = true;
    // Check if snake head is outside of the board
    if (pos.x < 0 || pos.y < 0 || pos.x >= numColumns || pos.y >= numRows) {
        legal = false;
    } 
    // Check if snake head intersects an existing snake element
    this.mapSnakeNodes(snake, (node, index) => {
        if (index === 0) {
            return;
        }
        if (snake.head.uidPos === node.uidPos) {
            legal = false;
        }
    });
    state.gameOver = !legal;
    if (state.gameOver) {
        this.init(state);
    }
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
    const { numColumns, numRows } = this.gridProps;

    // Clear canvas
    this.drawRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#EEE');

    // Draw grid
    for (let i=0; i<numColumns; i++) {
        for (let j=0; j<numRows; j++) {
            this.drawCell(ctx, i, j, '#DDE');
        }
    }

    // Draw food
    state.food.forEach(food => {
        this.drawCell(ctx, food.pos.x, food.pos.y, '#080');
    });

    // Draw snake
    const { snake } = state;
    this.mapSnakeNodes(snake, (node, index) => {
        const color = index === 0 ? snake.color : snake.bodyColor;
        this.drawCell(ctx, node.x, node.y, color);
    });
    
};
// END RENDER FUNCTIONS