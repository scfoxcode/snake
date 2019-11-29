
// Function to export which contains the game
function Snake(containerId) {
    this.welcome = 'Hello, lets play Snake!';
    this.gameOver = false;

    this.init(); // Initialise the game

    this.gameLoop = setInterval(function() { // Game loop
        this.update();
        this.render();
    }, 200);
}

Snake.prototype.init = function() {
    console.log(this.welcome);
};

Snake.prototype.update = function() {
};

Snake.prototype.render = function() {
};

