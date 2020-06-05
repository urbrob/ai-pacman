'use strict';

class Unit {
    constructor(r, c) {
        this.position = {
            row: r,
            col: c
        };
    }
}

class Pacman extends Unit {}
exports.pacman = new Pacman(1, 1);