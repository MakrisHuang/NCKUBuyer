angular.module('NCKUBuyer').factory('LoginHelper', function LoginHelperFactory($http){
    var service = {
        isLoggedIn: false, 
        
        session: function(){
            return $http.get('/session').then(function(response){
                service.isLoggedIn = true;
                return response;
            });
        }, 
        
        login: function(user){
            return $http.post('/login', user)
            .then(function(response){
                service.isLoggedIn = true;
                return response;
            });
        }
    };
});