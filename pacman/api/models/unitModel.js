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

        if(direction !== "no_move") {
            if (!this.validateMove(this.position)) {
                this.position.row = previous.row;
                this.position.col = previous.col
            }
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
    constructor(r, c, others) {
        super(r, c);
        this.otherGhostsPositions = others
    }

    updateOtherGhostsPositions(othersPositions) {
        this.otherGhostsPositions = othersPositions
    }

    validateMove(position) {
        let collision = false;
        this.otherGhostsPositions.forEach( (other) => {
           if(this.position.row === other.row && this.position.col === other.col) {
               collision = true;
           }
        });
        return !collision && super.validateMove(position);
    }
}

class GhostRed extends Ghost {

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

    chaseMoveVert(unit) {
        if (unit.position.row > this.position.row) this.move("down");
        else this.move("up");
    }

    chaseMoveHoriz(unit) {
        if (unit.position.col > this.position.col) this.move("right");
        else this.move("left");
    }

    chaseVert(unit, previous, force) {
        if(force) {
            this.chaseMoveVert(unit)
        } else {
            if (unit.position.row === this.position.row) this.chaseHoriz(unit, previous);
            else {
                this.chaseMoveVert(unit);

                if (previous.col === this.position.col && previous.row === this.position.row) this.chaseHoriz(unit, previous, true)
            }
        }
    }

    chaseHoriz(unit, previous, force) {
        if(force) {
            this.chaseMoveHoriz(unit)
        } else {
            if(unit.position.col === this.position.col) this.chaseVert(unit, previous);
            else {
                this.chaseMoveHoriz(unit);

                if (previous.col === this.position.col && previous.row === this.position.row) this.chaseVert(unit, previous, true)
            }
        }
    }
}
class GhostCyan extends GhostRed {

    chase(unit) {
        const previous = {
            row: this.position.row,
            col: this.position.col,
        };

        if(Math.abs(this.position.row - unit.position.row) < Math.abs(this.position.col - unit.position.col))
            this.chaseHoriz(unit, previous);
        else
            this.chaseVert(unit, previous)
    }
}
class PinkGhost extends Ghost {

    constructor(r, c, others) {
        super(r, c, others);
        this.prevPositions = [] //max 10
    }

    chase(unit) {
        const previous = {
            row: this.position.row,
            col: this.position.col,
        };

        let direction = this.chooseRandomDirection();

        this.move(direction);
        if(this.position.col === previous.col && this.position.row === previous.row) this.chase(unit);
        else {
            this.prevPositions.push(this.position);
            if(this.prevPositions.length > 10) this.prevPositions = this.prevPositions.slice(1, 11);
        }
    }

    chooseRandomDirection() {
        let randInt = Math.floor(Math.random() * 4); // 0 - 0.24; 0.25 - 0.49; 0.5 - 0.74; 0.75 - 0.99
        let randDir;

        if(randInt === 0) randDir = "up";
        else if(randInt === 1) randDir = "down";
        else if(randInt === 2) randDir = "left";
        else randDir = "right";

        return randDir;
    }
    //TODO obsluga corner case zwiazanego z blokowaniem sie duchow
    //TODO zmiana chooseRandDir aby przyjmowal tablice
    //TODO wywolanie ruchu ducha i poprawa updateow pozycji duchow
    //TODO frontend pink ducha 
    validateMove(position) {
        let moveBack = false;
        this.prevPositions.forEach( (pos) => {
           if(pos.row === this.position.row && pos.col === this.position.col) moveBack = true;
        });
        return !moveBack && super.validateMove(position);
    }
}
exports.pacman = new Pacman(1, 1);
exports.ghostRed = new GhostRed(6, 6, [ {row: 12, col: 12} ]);
exports.ghostCyan = new GhostCyan(12, 12, [ {row: 6, col:6} ]);