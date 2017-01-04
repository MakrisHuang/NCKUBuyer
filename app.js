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

// root route
app.get('/', function(request, response){
    response.sendFile('index.html');
    response.status(400);
});

// load route
require('./server/routes/buy')(app);
require('./server/routes/helpToBuy')(app);
require('./server/routes/myInfo')(app);

app.listen(3000, function(){
	console.log('listening on port 3000');
});