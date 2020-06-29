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

        if(direction === "right" || direction === "d") this.position.col += 1;
        else if(direction === "left" || direction === "a") this.position.col -= 1;
        else if(direction === "up" || direction === "w") this.position.row -= 1;
        else if(direction === "down" || direction === "s") this.position.row += 1;

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
class GhostPink extends Ghost {

    constructor(r, c, others) {
        super(r, c, others);
    }

    chase(unit) {
        const previous = {
            row: this.position.row,
            col: this.position.col,
        };

        let direction = this.chooseRandomDirection();
        this.move(direction);
    }

    chooseRandomDirection() {
        let randInt = Math.random(); // 0 - 0.24; 0.25 - 0.49; 0.5 - 0.74; 0.75 - 0.99
        let randDir;

        if(randInt < 0.25) randDir = "up";
        else if(randInt < 0.5) randDir = "down";
        else if(randInt < 0.75) randDir = "left";
        else randDir = "right";

        return randDir;
    }
    //TODO obsluga corner case zwiazanego z blokowaniem sie duchow
    //TODO zmiana chooseRandDir aby przyjmowal tablice
    //TODO wywolanie ruchu ducha i poprawa updateow pozycji duchow
    //TODO frontend pink ducha 
}
class GhostOrange extends GhostPink {}
exports.pacman = new Pacman(1, 1);
exports.ghostRed = new GhostRed(6, 6, [ {row: 12, col: 12}, {row: 6, col: 12}, {row: 12, col: 6} ]);
exports.ghostCyan = new GhostCyan(12, 12, [ {row: 6, col:6}, {row: 6, col: 12}, {row: 12, col: 6} ]);
exports.ghostPink = new GhostPink(6, 12, [ {row: 12, col: 12}, {row: 6, col:6}, {row: 12, col: 6} ]);
exports.ghostOrange = new GhostOrange(12, 6, [ {row: 12, col: 12}, {row: 6, col:6}, {row: 6, col: 12} ]);