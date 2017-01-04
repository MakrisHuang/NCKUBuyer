angular.module('NCKUBuyer')
.controller('BuyController', function($http){
   var self = this;
    $http({method: 'GET', url: '/buy'}).success(function(data){
        console.log("[controller] data from GET" + data)
        self.data = data;
    });
});