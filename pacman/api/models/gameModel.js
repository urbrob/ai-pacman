'use strict';
var gameMap = require('./game_map');
var pacmanModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = pacmanModel.pacman;

    }

    pacmanMove(direction) {
        this.pacman.move(direction);
        return this.getPositions();
    };

    getPositions() {
        return this.pacman.position;
    };

    startGame() {
        this.pacman.position = {
            row: 1,
            col: 1
        };
        return this.getPositions();
    }
}

exports.game = new PacmanGame();