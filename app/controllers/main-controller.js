angular.module('NCKUBuyer').controller('MainController', function(LoginHelper){
   $scope.loginHelper = LoginHelper;
    
    // check if the user is logged in when the application loads
    // LoginHelper will automatically update isLoggedIn
    // after this call finishes
    LoginHelper.session();
});