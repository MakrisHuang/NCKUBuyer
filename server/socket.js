// maintain the states of the server
// keep track of which user wants to buy

/* Buyer and Helper */
var usersWantToBuy = []
var usersToHelp = []

var getHelper = function(){
    var helper;     // undefined
    if (usersToHelp.length > 0){
        helper = usersToHelp.pop();
    }
    return helper;
}

var addHelper = function(newHelper){
    usersToHelp.push(newHelper);
}

/* Order handling */
var orders = []

var getOrder = function(){
    var order;      // undefined
    if (orders.length > 0){
        order = orders.pop();
    }
    return order;
}

var addOrder = function(newOrder){
    orders.push(newOrder);
}

/* progress handling */

var progress = 60;

/* handle request from buyer and helper */
var findHelperForOrder = function(){
    var helper = getHelper();
    if (helper){
        
    }
}

module.exports = function(socket){
    socket.emit('init',{
        msg: 'init from server'
    })
    
    // event listeners
    socket.on('send:order', function(newOrder){
        console.log('on: [send:order]', newOrder)
        var helper;
        // continue waiting for helpers
        // if more then 10 seconds, then notify user no helper online
        var counter = 0;
        var findHelperInterval = setInterval(function(){
            helper = getHelper();
            counter++;
            if (helper){
                console.log('find helper')
                socket.boradcast.emit('found:helper', helper)
                clearInterval(findHelperInterval)
            }
            
            // send searching progress
            if (counter <= 10){
                console.log('counter: ', counter)
                socket.emit('send:progress', counter * 10)
            }
            
            if (counter == 10){
                socket.emit('notfound:helper', {msg: 'sorry, no helper'})
                clearInterval(findHelperInterval)
            }
        }, 1000)
    });
}