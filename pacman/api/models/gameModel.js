'use strict';
var gameMap = require('./game_map');
var pacmanModel = require('./unitModel');

class PacmanGame {
    constructor() {
        this.pacman = pacmanModel.pacman;

    }

    move(direction, unit) {
        let previous = {
            row: unit.position.row,
            col: unit.position.col
        };

        if(direction === "right") unit.position.col += 1;
        else if(direction === "left") unit.position.col -= 1;
        else if(direction === "up") unit.position.row -= 1;
        else if(direction === "down") unit.position.row += 1;

        if(!this.validateMove(unit.position)) {
            unit.position.row = previous.row;
            unit.position.col = previous.col
        }

        return unit.position
    };

    validateMove(position) {
        let field = gameMap.find(rowMap => rowMap.row_id === position.row).fields
            .find(colMap => colMap.col_id === position.col).field_type;
        return (field && field === "floor")
    };

    pacmanMove(direction) {
        this.pacman.position = this.move(direction, this.pacman);
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