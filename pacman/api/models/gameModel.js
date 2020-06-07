'use strict';
var gameMap = require('./game_map');
var unitModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = unitModel.pacman;
        this.ghost = unitModel.ghost;
        this.state = "ongoing";
    }

    ghostMove() {
        this.ghost.chase(this.pacman);
    }

    pacmanMove(direction) {
        this.pacman.move(direction);
        this.ghostMove();
        this.updateState();
        return this.getPositions();
    };

    getPositions() {
        return {
            pacman: this.pacman.position,
            ghost: this.ghost.position,
            state: this.state
        };
    };

    startGame() {
        this.pacman.position = {
            row: 1,
            col: 1
        };
        this.ghost.position = {
            row: 6,
            col: 6
        };
        this.state = "ongoing";
        return this.getPositions();
    }

    updateState() {
        if(this.pacman.position.row === this.ghost.position.row
            && this.pacman.position.col === this.ghost.position.col)
            this.state = "lose";
    }
}

exports.game = new PacmanGame();