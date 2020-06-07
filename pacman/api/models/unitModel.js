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

class Ghost extends Unit {

    chase(unit) {
        const previous = {
          row: this.position.row,
          col: this.position.col,
        };

        if(Math.abs(this.position.row - unit.position.row) < Math.abs(this.position.col - unit.position.col))
            this.chaseVert(unit, previous);
        else
            this.chaseHoriz(unit, previous);
    }

    chaseVert(unit, previous, force) {
        if(force) {
            if (unit.position.row > this.position.row) this.move("down");
            else this.move("up");
        } else {
            if (unit.position.row === this.position.row) this.chaseHoriz(unit, previous);
            else {
                if (unit.position.row > this.position.row) this.move("down");
                else this.move("up");

                if (previous.col === this.position.col && previous.row === this.position.row) this.chaseHoriz(unit, previous, true)
            }
        }
    }

    chaseHoriz(unit, previous, force) {
        if(force) {
            if (unit.position.col > this.position.col) this.move("right");
            else this.move("left");
        } else {
            if(unit.position.col === this.position.col) this.chaseVert(unit, previous);
            else {
                if (unit.position.col > this.position.col) this.move("right");
                else this.move("left");

                if (previous.col === this.position.col && previous.row === this.position.row) this.chaseVert(unit, previous, true)
            }
        }
    }
}

exports.pacman = new Pacman(1, 1);
exports.ghost = new Ghost(6, 6);