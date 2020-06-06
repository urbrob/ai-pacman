'use strict';
var gameMap = require('./game_map');
var unitModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = unitModel.pacman;
        this.ghost = unitModel.ghost;
    }

    ghostMove() {
        this.ghost.chase(this.pacman);
    }

    pacmanMove(direction) {
        this.pacman.move(direction);
        this.ghostMove();
        return this.getPositions();
    };

    getPositions() {
        return {
            pacman: this.pacman.position,
            ghost: this.ghost.position
        };
    };

    startGame() {
        this.pacman.position = {
            row: 1,
            col: 1
        };
        this.ghost.position = {
            row: 8,
            col: 8
        };
        return this.getPositions();
    }
}

exports.game = new PacmanGame();