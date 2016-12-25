var express = require('express');
var app = express();

// app initialization
app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// load routes
var buy = require('./route/buy');
app.use('/buy', buy);


// buy route
app.route('/buy')
    .get(function(request, response){
        response.sendFile(__dirname + '/app/client-index.html');
        response.sendStatus(200);
    });
    .post(parseUrlencoded, function(request, response){
                        
    });

// helpToBuy route
var helpToBuyRoute = app.route('/helpToBuy')
helpToBuyRoute.get(function(request, response){
	response.sendFile(__dirname + '/app/')
});
helpToBuyRoute.post(function(request, response){
	response.sendFile(__dirname + '/app/')
});

app.get('/myInfo', function(request, response){
	
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});