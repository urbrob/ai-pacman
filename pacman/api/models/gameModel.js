'use strict';
var gameMap = require('./game_map');
var unitModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = unitModel.pacman;
        this.ghostRed = unitModel.ghostRed;
        this.ghostCyan = unitModel.ghostCyan;
        this.state = "ongoing";
    }

    ghostMove() {
        this.ghostRed.chase(this.pacman);
        this.ghostCyan.updateOtherGhostsPositions([
            {row: this.ghostRed.position.row,
             col: this.ghostRed.position.col} ]);
        this.ghostCyan.chase(this.pacman);
        this.ghostRed.updateOtherGhostsPositions([
            {row: this.ghostCyan.position.row,
             col: this.ghostCyan.position.col} ]);
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
            ghost_cyan: this.ghostCyan.position,
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
        this.ghostCyan.position = {
            row: 12,
            col: 12
        };
        this.state = "ongoing";
        return this.getPositions();
    }

    updateState() {
        if((this.pacman.position.row === this.ghostRed.position.row
            && this.pacman.position.col === this.ghostRed.position.col) ||
            (this.pacman.position.row === this.ghostCyan.position.row
                && this.pacman.position.col === this.ghostCyan.position.col))
            this.state = "lose";
    }
}

exports.game = new PacmanGame();