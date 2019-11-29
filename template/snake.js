// Function to export that contains the game
function Snake(containerId) {
    var self = this;
    this.welcome = 'Hello, lets play Snake!';
    this.gameOver = false;
    this.containerId = containerId;
    this.ctx = null;

    this.init(); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        self.update();
        self.render();
    }, 200);
}

Snake.prototype.init = function() {
    console.log(this.welcome);

    // Initialise the canvas and add it to the dom
    var canvas = document.createElement('canvas');
    var container = document.getElementById(this.containerId);
    container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
};

Snake.prototype.update = function() {
};

Snake.prototype.render = function() {
};

