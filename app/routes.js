angular.module('NCKUBuyer').config(function($routeProvider){
	$routeProvider
    .when('/', {
        redirectTo: '/buy'
    })
    
    .when('/buy', {
		templateUrl: '/templates/buy.html', 
		controller: 'BuyController', 
	})

	.when('/helpToBuy', {
		templateUrl: '/templates/helpToBuy.html', 
		controller: 'HelpToBuyController'
	})

	.when('/myInfo', {
		templateUrl: '/templates/myInfo.html', 
		controller: 'MyInfoController'
	})
    
    .when('/login', {
        templateUrl: '/templates/login.html', 
        controller: 'LoginController'
    })
    
    .when('/register', {
        templateUrl: '/templates/register.html', 
        controller: 'RegisterController'
    })

	.otherwise({ redirectTo: '/buy' });

});