'use strict';

var gameMap = require('./game_map');

var pacmanPosition = {
    row: 1,
    col: 1
};

exports.getPosition = function () {
  return pacmanPosition
};

exports.move = function (direction) {
  let previous = {
      row: pacmanPosition.row,
      col: pacmanPosition.col
  };

  if(direction === "right") pacmanPosition.col += 1;
  else if(direction === "left") pacmanPosition.col -= 1;
  else if(direction === "up") pacmanPosition.row -= 1;
  else if(direction === "down") pacmanPosition.row += 1;

  if(!exports.validateMove(pacmanPosition)) {
      pacmanPosition.row = previous.row;
      pacmanPosition.col = previous.col
  }

  return pacmanPosition
};

exports.validateMove = function (position) {
    let field = gameMap.find(rowMap => rowMap.row_id === position.row).fields
        .find(colMap => colMap.col_id === position.col).field_type;
    return (field && field === "floor")
};

exports.startGame = function () {
    pacmanPosition.col = 1;
    pacmanPosition.row = 1;
    return pacmanPosition;
};