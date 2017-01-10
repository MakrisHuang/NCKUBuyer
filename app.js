var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// load database and init
var Db = require('./server/db')
var db = new Db('localhost', 'root', 'password', 'database')

// app initialization
app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use(express.static('server'));

app.use(express.cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initial passport
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});
var newSession = {
    secret: 'almvnirtgd#$DFsa25452*AYD*D*S!@!#adsda))Ddsadsax', 
    cookie: {httpOnly: true, secure: false, maxAge: 86400000}, 
    store: new session.MemoryStore()
};
app.use(session(newSession));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(userName, password, done){
    // load account and password from database
}))

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

// init socket.io
var io = require('socket.io')(server);
var socket = require('./server/socket');

// start socket.io
io.on('connection', socket);

