angular.module('NCKUBuyer').factory('LoginHelper', function LoginHelperFactory($http, FindHelper){
    var service = {
        // when the service is injected, the service will be 
        // created at once while load application
        // and keep the isLoggedIn
        isLoggedIn: false, 
        logInMsg: 'initial',
        /* 
        userInfo = {
            id: 2, 
            account: 'alice@gmail.com', 
            name: 'alice', 
            password: '456', 
            telephone: '0912345678', 
            dorm: '光三', 
            identity: 'buyer'
        }
        */
        userInfo: null, 
        
        session: function(){
            return $http.get('/api/session').then(
                function(response){
                    service.isLoggedIn = true;
                    
                    // setting userInfo from session
                    service.userInfo = response.data.user.results[0]
                    
                    // after receiving the session, resend to socket
                    service.userInfo.identity = 'buyer'
                    FindHelper.emit('init', service.userInfo)
                    
                    return response;
                }, 
                function(error){
                    return error;
                }
            );
        }, 
        
        login: function(user){
            return $http.post('/api/login', user)
            .then(
                function(response){
                    service.isLoggedIn = true;
                    console.log('[LoginHelper] user logged in')
                    return response;
                }, 
                function(error){
                    console.log('[LoginHelper] user fails to log in: ', error)
                    return error;
                }
            );
        }, 
        
        register: function(newUser){
            return $http.post('/api/register', newUser)
            .then(function(response){
                console.log('[LoginHelper] user registered')
                return response;
            })
        }
    };
    return service;
});