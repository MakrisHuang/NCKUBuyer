// maintain the states of the server
// keep track of which user wants to buy

/* Buyer and Helper */
var allUsers = (function(){
    var userNames = {};     // only stores the names
    var buyers = {};
    var helpers = {};
    
    var claim = function(name){
        if (!name || userNames[name]){
            return false;
        }else{
            userNames[name] = 'joined';
            // after 'joined', set the identity
            return true;
        }
    };
    
    var getName = function(){
        var name, nextUserId = 1;
        
        do{
            name = 'User ' + nextUserId;
            nextUserId += 1;
        }while(!claim(name));
        
        return name;
    };
    
    // dump all helper to array
    var getAllUser = function(){
        var allUsers = []
        for (user in userNames){
            allUsers.push(user)
        }
        
        return allUsers;
    }
    
    var freeUser = function(name){
        var identity;
        if (userNames[name]){
            identity = userNames[name];
            delete userNames[name];
            console.log('[delete] allUsers: ', userNames)
            
            if (identity == 'buyer'){
                delete buyers[name]
                console.log('[delete] buyers: ', buyers)
            }
            if (identity == 'helper'){
                delete helpers[name]
                console.log('[delete] helpers: ', helpers)
            }
        }
    }
    
    var setIdentityWithName = function(identity, name){
        if (identity == 'buyer'){
            userNames[name] = 'buyer'
            buyers[name] = {name: name, identity: 'buyer'}
            
            // clean identity in helper if exists
            if (helpers[name]){
                delete helpers[name]
            }
        }
        if (identity == 'helper'){
            userNames[name] = 'helper'
            helpers[name] = {name: name, identity: 'helper'}
            
            // clean identity in buyer if exists
            if (buyers[name]){
                delete buyers[name]
            }
        }
        console.log('after setting identity: ')
        console.log('allUsers: ', userNames)
        console.log('buyers: ', buyers)
        console.log('helpers: ', helpers)
    };
    
    var getAllBuyer = function(){
        var allBuyer = []
        for (buyer in buyers){
            allBuyer.push(buyer)
        }
        return allBuyer
    };
    
    var getAllHelper = function(){
        var allHelper = []
        for (helper in helpers){
            allHelper.push(helper)
        }
        return allHelper
    };
    
    return {
        claim: claim, 
        getName: getName, 
        getAllUser: getAllUser, 
        freeUser: freeUser, 
        setIdentityWithName: setIdentityWithName, 
        getAllBuyer: getAllBuyer, 
        getAllHelper: getAllHelper
    };
}());

var progress = 60;

module.exports = function(socket){
    var user = allUsers.getName();
    
    socket.emit('init',{
        msg: 'init from server', 
        name: user
    });
    
    // notify clients the current online buyers and helpers
    socket.emit('send:allBuyer', allUsers.getAllBuyer());
    socket.emit('send:allHelper', allUsers.getAllHelper());
    
    socket.on('set:identity', function(data){
        console.log('on: [set:identity]', data)
        allUsers.setIdentityWithName(data['identity'], user)
        
        // notify all that the identities of user have changed
        socket.broadcast.emit('send:allBuyer', allUsers.getAllBuyer());
        socket.broadcast.emit('send:allHelper', allUsers.getAllHelper());
    });
    
    // event listeners
    socket.on('send:order', function(orderInfo){
        console.log('on: [send:order]', orderInfo)
        
        // continue waiting for helpers
        // if more then 10 seconds, then notify user no helper online
        var counter = 0;
        var findHelperInterval = setInterval(function(){
            var allHelpers = allUsers.getAllHelper()
            var helper = allHelpers.pop();
            
            if (helper){
                // 1. send done progress
                counter = 100;
                socket.emit('send:progress', 100)
                
                // 2. send notification for helper
                var buyer = orderInfo['buyer'];
                var notificiationForHelper = {
                    buyer: buyer, 
                    helper: helper, 
                    order: orderInfo['order']
                }
                // notify others
                socket.broadcast.emit('found:helper', notificiationForHelper);
                // notify sender
                socket.emit('found:helper', notificiationForHelper);
                
                // 3. clear the helper
                allUsers.freeUser(helper);
                
                // 4. send remained helpers
                // notify others
                socket.emit('send:allHelper', allUsers.getAllHelper());
                // notify sender
                socket.broadcast.emit('send:allHelper', allUsers.getAllHelper());
                
                // 4. clear loop
                clearInterval(findHelperInterval)
            }
            
            // send searching progress
            if (counter <= 10){
                socket.emit('send:progress', counter * 10)
            }
            
            if (counter == 10){
                socket.emit('notfound:helper', {msg: 'sorry, no helper'})
                clearInterval(findHelperInterval)
            }
            
            counter++;
        }, 1000)
    });
    
    // clean up when a helper leaves
    socket.on('disconnect', function(){
        console.log('on: [disconnect]', user)
        allUsers.freeUser(user);
        
        socket.broadcast.emit('send:allBuyer', allUsers.getAllBuyer());
        socket.broadcast.emit('send:allHelper', allUsers.getAllHelper());
    })
}