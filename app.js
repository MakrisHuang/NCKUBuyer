var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var app = express();

// load database and init
var Db = require('./server/db')

// app initialization
app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use(express.static('server'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ----------- passport start ------------ */
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});
var newSession = {
    secret: 'almvnirtgd#$DFsa25452*AYD*D*S!@!#adsda))Ddsadsax', 
    cookie: {httpOnly: true, secure: false, maxAge: 86400000}, 
    store: new session.MemoryStore(), 
    resave: true, 
    saveUninitialized: true
};
app.use(session(newSession));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    {
        usernameField: 'account', 
        passwordField: 'password'
    }, 
    
    function(username, password, done){
        console.log('localStrategy called')
        Db.queryUserExist('user', username, password, function callback(error, results){
            if (error){
                console.log('[passport]: error in login')
                done(null, false, {msg: 'Not registered user: ' + username})
            }else if(results.length == 0){
                console.log('[passport]: no query result')
                done(null, false, 'Incorrect username or password')
            }else{
                // login succeeded
                var user = {results: results};
                done(null, user);
            }
        })
    }
));

app.post('/api/login', function(req, res, next){
    console.log('body parsing: ', req.body)
    passport.authenticate('local', function(err, user, msg){
        if(err){
            console.log('error in authenticate')
            return next(err);
        }
        if(!user) {
            console.log('not user')
            return res.status(400).send(
                {isLoggedIn: false, msg: msg}
            );
        }
        req.logIn(user, function(err){
            if (err) {
                return res.status(500).send(
                    {msg: 'Error logging in', 
                     err: err})
            }else{
                console.log('[server] Succeed login')
                return res.status(200).send({
                    isLoggedIn: true,
                    msg: 'Succeeded logged in', 
                    user: user
                })
            }
        })
    })(req, res, next);
});

app.post('/api/register', function(req, res, next){
    // write new user to database
    var newUser = req.body;
    console.log('[server] new user: ', newUser)
    Db.insertUser('user', newUser, function callback(error, results){
        if (error){
            res.status(500).send({msg: 'Error in create new user'})
        }else{
            res.status(200).send(
                {
                    msg: 'Create new user succeeded', 
                }
            )
        }
    })
})

// isLoggedIn: middleware
var isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        next();
    }else{
        res.status(401).send({
            msg: 'Please login to acces this information'
        });
    }
};

app.get('/api/session', isLoggedIn, function(req, res){
    res.status(200).send({
        loginStatus: true, 
        user: req.user
    });
    
    // create io socket here
});

app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/#/buy');
})
/* ----------- passport end ------------ */

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
