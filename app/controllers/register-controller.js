angular.module('NCKUBuyer').controller('RegisterController', function($http, $scope, $location, LoginHelper){
   $scope.getDorm = function(dormID){
        switch(dormID){
            case 1: 
                $scope.user.dorm = "光一";
                break;
            case 2: 
                $scope.user.dorm = "光二";
                break;
            case 3: 
                $scope.user.dorm = "勝一";
                break;
            case 4: 
                $scope.user.dorm = "勝二";
                break;
            case 5: 
                $scope.user.dorm = "勝三";
                break;
            case 6: 
                $scope.user.dorm = "勝八";
                break;
            case 7: 
                $scope.user.dorm = "勝九";
                break;
            default:
                console.log("Unknown dorm id: ", dormID)
                break;
        }
    };
    
    $scope.register = function(){
        var newUser = {
            account: $scope.user.account, 
            password: $scope.user.password, 
            name: $scope.user.name, 
            telephone: $scope.user.telephone, 
            dorm: $scope.user.dorm
        }
        console.log('[client] register newuser: ', newUser)
        
        LoginHelper.register(newUser).then(
            function(success){
                console.log('create new user succeeded: ', success);

                // redirect to buy page
                $location.path('/login')
            }, function(error){
                console.log('[client] error in creating new user', error);
                
                // show error message
            }
        )
    };
});