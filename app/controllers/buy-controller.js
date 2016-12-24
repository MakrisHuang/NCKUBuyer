angular.module('NCKUBuyer')
.controller('BuyController', function($http, $scope){
	$scope.activeTab = 1;
    
    $scope.setActiveTab = function(tab){
        $scope.activeTab = tab;
    }
});