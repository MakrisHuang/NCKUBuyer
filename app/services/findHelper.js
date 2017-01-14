angular.module("NCKUBuyer").factory('FindHelper', function FindHelperFactory($rootScope) {
    // rootScope help controller communicate with each other
    var socket = io.connect();
    var services = {
        on: on, 
        emit: emit, 
        numOfHelpers: 0, 
        numOfBuyers: 0
    }
    
    function on(eventName, callback){
        socket.on(eventName, function(){
            var args = arguments;
            // inform angular to update all variables
            $rootScope.$apply(function(){
                callback.apply(socket, args);
            })
        })
    }
    
    function emit(eventName, data, callback){
        socket.emit(eventName, data, function(){
            var args = arguments;
            $rootScope.$apply(function(){
                if (callback) {
                    callback.apply(socket, args);
                }
            })
        })
    }
    
    return services;
});