angular.module('NCKUBuyer').controller('LoginController', function($scope, $http, $rootScope, $location, LoginHelper){
    // variable declarations
    $rootScope.user = {
        
    };
    
    // methods
    $scope.login = function(){
        var loginData = {
            account: $scope.account, 
            password: $scope.password
        }
        
        $scope.login = function(){
            LoginHelper.login($rootScope.user).then(function(success){
                $location.path('/buy');
            }, function(error){
                $scope.errorMsg = error.data.msg
            })
        };
    };
});