angular.module('NCKUBuyer')
.controller('HelpToBuyController', function($http, $scope, FindHelper){
    $scope.name;
    $scope.buyer = null;
    $scope.allBuyer = 0;
    
    $scope.setIdentity = function(identity){
        socket.emit('set:identity', {identity: 'helper'})
    }
    
    FindHelper.on('init', function(data){
        console.log('on: [init]', data)
        $scope.name = data['name']
    })
    
    FindHelper.on('found:helper', function(notificiationForHelper){
        console.log('on: [found:helper], helper with buyer: ', notificiationForHelper)
        
        // 2. check if the helper is self
        if (notificiationForHelper['helper'] == $scope.name){
            // 3. show buyer info
            $scope.buyer = notificiationForHelper['buyer'];
            $scope.order = notificiationForHelper['order'];
        }
    });
    
    FindHelper.on('send:allBuyer', function(data){
        $scope.allBuyer = data.length    
    })
    
    FindHelper.emit('set:identity', {identity: 'helper'})
});