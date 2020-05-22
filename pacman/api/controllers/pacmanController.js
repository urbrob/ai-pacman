'use strict';

var current = {
    "row": 0,
    "col": 0
};

exports.current_state = function(req, res) {
    res.json({
        "row": current.row,
        "col": current.col
    })
};

exports.update = function(req, res) {
    current.row = req.body.row;
    current.col = req.body.col;

    res.json({
        "row": current.row,
        "col": current.col
    })
};