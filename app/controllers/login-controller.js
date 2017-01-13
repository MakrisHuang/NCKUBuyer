angular.module('NCKUBuyer').controller('LoginController', function($scope, $http, $location, LoginHelper, FindHelper){
    
    // methods
    $scope.login = function(){
        var loginData = {
            account: $scope.user.account, 
            password: $scope.user.password
        };
        
        LoginHelper.login(loginData).then(
            function(response){
                if (response.data.isLoggedIn){
                    
                    LoginHelper.logInMsg = response.data.msg;
                    console.log('logInMsg: ', LoginHelper.logInMsg);
                    
                    // store the userInfo
                    LoginHelper.userInfo = response.data.user.results[0]
                    
                    // Fire socket to as identity of buyer
                    // initially set identity as buyer
                    LoginHelper.identity = 'buyer'
                    
                    // notify server to keep the userInfo
                    FindHelper.emit('init', LoginHelper.userInfo)

                    // redirecting
                    $location.path('/buy');
                }else{
                    $scope.errorMessage = response.data.msg
                    console.log('[client] error in login: ' ,$scope.errorMessage)    
                }
            }
        )
    };
});