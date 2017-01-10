angular.module('NCKUBuyer').controller('RegisterController', function($http, $scope, $rootScope){
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
    } 
});