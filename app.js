var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

// socket.io
io.on('connection', function(socket){
    console.log('connected')
})

app.listen(3000, function(){
	console.log('listening on port 3000');
});