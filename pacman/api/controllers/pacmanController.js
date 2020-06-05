'use strict';

var pacmanModel = require('../models/unitModel');
var gameModel = require('../models/gameModel');

exports.current_state = function(req, res) {
    res.json(gameModel.game.getPositions());
};
exports.move = function (req, res) {
    let obj = JSON.parse(JSON.stringify(req.body));
    res.json(gameModel.game.pacmanMove(obj.direction));
};
exports.startGame = function (req, res) {
    let obj = JSON.parse(JSON.stringify(req.body));
    res.json(gameModel.game.startGame());
};