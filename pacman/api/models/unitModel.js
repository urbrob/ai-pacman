'use strict';

var gameMap = require('./game_map');

class Unit {
    constructor(r, c) {
        this.position = {
            row: r,
            col: c
        };
    }

    move(direction) {
        let previous = {
            row: this.position.row,
            col: this.position.col
        };

        if(direction === "right") this.position.col += 1;
        else if(direction === "left") this.position.col -= 1;
        else if(direction === "up") this.position.row -= 1;
        else if(direction === "down") this.position.row += 1;

        if(!this.validateMove(this.position)) {
            this.position.row = previous.row;
            this.position.col = previous.col
        }

        return this.position
    };

    validateMove(position) {
        let field = gameMap.find(rowMap => rowMap.row_id === position.row).fields
            .find(colMap => colMap.col_id === position.col).field_type;
        return (field && field === "floor")
    };

}

class Pacman extends Unit {}
exports.pacman = new Pacman(1, 1);