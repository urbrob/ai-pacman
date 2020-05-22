'use strict';
module.exports = function(app) {
    var todoList = require('../controllers/pacmanController');

    // Routes
    app.route('/game')
        .get(todoList.current_state);

};