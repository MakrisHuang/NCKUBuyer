var express = require('express');
var app = express();

app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use(express.static('server'));

app.get('/', function(request, response){
	response.sendFile(__dirname + '/app/client-index.html');
});

app.get('/', function(request, response){
	
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});

angular.module('NCKUBuyer', ['ngRoute']);