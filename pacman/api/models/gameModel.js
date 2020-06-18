'use strict';
var gameMap = require('./game_map');
var unitModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = unitModel.pacman;
        this.ghostRed = unitModel.ghostRed;
        this.state = "ongoing";
    }

    ghostMove() {
        this.ghostRed.chase(this.pacman);
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
            ghost_red: this.ghostRed.position,
            state: this.state
        };
    };

    startGame() {
        this.pacman.position = {
            row: 1,
            col: 1
        };
        this.ghostRed.position = {
            row: 6,
            col: 6
        };
        this.state = "ongoing";
        return this.getPositions();
    }

    updateState() {
        if(this.pacman.position.row === this.ghostRed.position.row
            && this.pacman.position.col === this.ghostRed.position.col)
            this.state = "lose";
    }
}

exports.game = new PacmanGame();