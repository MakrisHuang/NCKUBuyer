// maintain the states of the server
// keep track of which user wants to buy

/* Buyer and Helper */
var allUsers = (function(){
    var buyers = {};
    var helpers = {};
    
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
    
    var freeUser = function(userInfo){
        var userId = userInfo.userId;
        var identity = userInfo.identity;
        
        if (identity == 'buyer'){
            delete buyers[userId]   
        }
        if (identity == 'helper'){
           delete helpers[userId]
        }
    };
    
    var setIdentityWithUserInfo = function(userInfo){
        var userId = userInfo.userId
        var identity = userInfo.identity;
        
        if (identity == 'buyer'){
            buyers[userId] = userInfo
            
            // clean identity in helper if exists
            if (helpers[userId]){
                delete helpers[userId]
            }
        }
        if (identity == 'helper'){
            helpers[userId] = userInfo
            
            // clean identity in buyer if exists
            if (buyers[userId]){
                delete buyers[userId]
            }
        }
        console.log('after setting identity: ')
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
        buyers: buyers, 
        helpers: helpers,
        getAllBuyer: getAllBuyer, 
        getAllHelper: getAllHelper,
        freeUser: freeUser, 
        setIdentityWithUserInfo: setIdentityWithUserInfo, 
    };
}());

module.exports = function(socket){
    var personInfo;
    
    socket.on('init', function(userInfo){
        console.log('on [init] get userInfo from user: ', userInfo)
        var userId = userInfo.userId
        
        if (userInfo.identity == 'buyer'){
            allUsers.buyers[userId] = userInfo;
        }
        if (userInfo.identity == 'helper'){
            allUsers.helpers[userId] = userInfo
        }
        
        console.log('after setting identity: ')
        console.log('buyers: ', allUsers.buyers)
        console.log('helpers: ', allUsers.helpers)
        
        // keep the userInfo
        personInfo = userInfo
        console.log('on [init] userInfo: ', personInfo)
    })
    
    // notify clients the current online buyers and helpers
    socket.emit('send:allBuyer', allUsers.getAllBuyer());
    socket.emit('send:allHelper', allUsers.getAllHelper());
    
    socket.on('set:identity', function(userInfo){
        console.log('on: [set:identity]', userInfo)
        allUsers.setIdentityWithUserInfo(userInfo)
        
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
            var helperId = allHelpers.pop();
            
            console.log('[server] helper found: ', helperId)
            if (helperId){
                // 1. send done progress
                counter = 90;
                socket.emit('send:progress', counter)
                
                // 2. wait for 1 second
                var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                    if ((new Date().getTime() - start) > 1e7){
                        break;
                    }
                }
                
                counter = 100;
                socket.emit('send:progress', counter)
                
                // 2. send notification for helper
                var buyer = orderInfo['buyer'];
                var notificiationForHelper = {
                    buyer: buyer, 
                    helper: allUsers.helpers[helperId], 
                    total: orderInfo['total'],
                    earn: orderInfo['earn'],
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
        if (personInfo != undefined){
            console.log('on: [disconnect] userInfo = ', personInfo)
            allUsers.freeUser(personInfo);
            
            socket.broadcast.emit('send:allBuyer', allUsers.getAllBuyer());
            socket.broadcast.emit('send:allHelper', allUsers.getAllHelper());
        }else{
            console.log('on: [disconnect] without userInfo')
        }
    })
}