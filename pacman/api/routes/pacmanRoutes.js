'use strict';
module.exports = function(app) {
    var pacman = require('../controllers/pacmanController');

    // Routes
    app.route('/game')
        .get(pacman.current_state)
        .post(pacman.move);

    app.route('/startGame')
        .post(pacman.startGame)
};