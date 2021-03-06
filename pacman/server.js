var express = require('express'),
    app = express(),
    port = 5678;


var routes = require('./api/routes/pacmanRoutes'); //importing route
app.use(express.json());
routes(app); //register the route

app.listen(port);

console.log('Pacman RESTful API server started on: ' + port);