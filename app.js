var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// app initialization
app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use(express.static('server'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set root path
app.set('app', __dirname + '/app');

// load route
require('./server/routes/main')(app);
require('./server/routes/page_buy')(app);
require('./server/routes/page_helpToBuy')(app);
require('./server/routes/page_myInfo')(app);

var server = app.listen(3000, function(){
	console.log('listening on port 3000');
});
var io = require('socket.io')(server);
var socket = require('./server/socket');

// socket.io
io.on('connection', socket);

