'use strict';

var model = require('../model/pacmanModel');

exports.current_state = function(req, res) {
    res.json(model.getPosition())
};
exports.move = function (req, res) {
    let obj = JSON.parse(JSON.stringify(req.body));
    res.json(model.move(obj.direction));
};
exports.startGame = function (req, res) {
    let obj = JSON.parse(JSON.stringify(req.body));
    res.json(model.startGame());
};