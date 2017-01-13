angular.module('NCKUBuyer')
.controller('HelpToBuyController', function($http, $scope, FindHelper, LoginHelper){
    $scope.buyer;
    $scope.numOfBuyers = 0;
    
    FindHelper.on('found:helper', function(notificiationForHelper){
        console.log('on: [found:helper], helper with buyer: ', notificiationForHelper)
        
        // 2. check if the helper is self
        if (notificiationForHelper['helper'].userId == LoginHelper.userInfo.userId){
            
            // 3. show buyer info
            $scope.buyer = notificiationForHelper['buyer'];
            $scope.order = notificiationForHelper['order'];
            $scope.total = notificiationForHelper['total'];
            $scope.earn = notificiationForHelper['earn'];
        }
    });
    
    FindHelper.on('send:allBuyer', function(data){
        $scope.allBuyer = data.length    
    })
});