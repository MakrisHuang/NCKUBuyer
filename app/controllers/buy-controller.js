angular.module('NCKUBuyer')
.controller('BuyController', function($http, $scope, $timeout){
    $scope.stores = [];
    
    $http({method: 'GET', url: '/buy'}).then(function succ(response){
        $scope.stores = response.data;
    });
    
    // data
    $scope.title = "我要買宵夜!";
    
    $scope.orderDescription = "幫買小幫手：每筆訂單至少須多加10元的工本費，每買3個項目則多加5元，不足3個則以5元計算 ^_^"

    $scope.selectedStoreId = 0;

    $scope.getCurrentItems = function(tab){
        try{
            return $scope.stores[tab].items;
        }
        catch(err){
            console.log('error: loading items')
        }
    }

    $scope.setCurrentStoreId = function(tab){
        $scope.selectedStoreId = tab;    
    }

    $scope.getCurrentStoreName = function(tab){
        try{
            return $scope.stores[tab].name;
        }catch(err){
            console.log('error: loading store name')
        }
    }

    $scope.order = new Array();

    $scope.addFood = function(item){
        // check if the item is already ordered
        var foodName = item.food;
        var storeId = $scope.selectedStoreId;

        var orderIndex = -1;
        for (i = 0; i < $scope.order.length; i++){
            if (foodName == $scope.order[i].food && storeId == $scope.order[i].storeId){
                // found already exists
                orderIndex = i;
                break;
            }
        }

        if (orderIndex == -1){  // new item
            var orderedItem = {};

            orderedItem['storeId'] = $scope.stores[$scope.selectedStoreId].id;
            orderedItem['storeName'] = $scope.stores[$scope.selectedStoreId].name;
            orderedItem['amount'] = 1;
            orderedItem['food'] = item.food;
            orderedItem['price'] = item.price;
            $scope.order.push(orderedItem);
        }else{  // old item, increase its amount
            $scope.order[orderIndex].amount += 1;
        }

        console.log($scope.order);
    }

    $scope.increaseAmount = function(orderedItem){
        orderedItem['amount']++;
    }

    $scope.decreaseAmount = function(orderedItem, $index){
        orderedItem['amount']--;
        if (orderedItem['amount'] == 0){
            $scope.order.splice($index, 1)
        }
    }

    $scope.totalPrice = function(){
        var total = 0;
        if ($scope.order.length > 0){
            for(i = 0; i < $scope.order.length; i++){
                total += $scope.order[i].price * $scope.order[i].amount;
            }
        }
        total += $scope.extraPay();
        return total;
    }

    $scope.removeOrderedItem = function($index){
        $scope.order.splice($index, 1);
    }

    $scope.extraPay = function(){
        var totalAmount = 0;
        for (i = 0; i < $scope.order.length; i++){
            totalAmount += $scope.order[i]['amount'];
        }
        var total = (totalAmount > 0) ? 10 : 0;
        var extra = Math.floor(totalAmount / 3);
        if (totalAmount % 3 > 0){
            extra += 1;
        }
        total += extra * 5;
        return total;
    }
    
    
    // handle progress bar
    $scope.progress = -1;
    $scope.progressBarStyle = {'width': '0%'}
    $scope.getProgressBar = function(){
        var req = {'req': 'bar'}
        $http.post('/buy', req).then(function(response){
            $scope.progress = response.data['progress']
            
            var progressStr = $scope.progress.toString();
            progressStr += "%";
            $scope.progressBarStyle['width'] = progressStr;
        });
    }
    var checkProgressBar;
    
    $scope.intervalProgressBar = function(){
        checkProgressBar = setTimeout(function(){
            $scope.getProgressBar();
            $scope.intervalProgressBar();
        }, 2000);
        
        if ($scope.progress == 100){
            clearTimeout(checkProgressBar);
        }
        
        console.log('processing')
    }
    
    $scope.showProgressBar = function(){
        if ($scope.progress == -1 || $scope.progress == 100)
            return false;
        else
            return true;
    }
    
    $scope.progressDone = function(){
        if ($scope.progress == 100)
            return true;
        else
            return false;
    }
    
    // handle helper
    $scope.helper = null;
    $scope.findHelper = function(){
        $scope.progress = 0;
        $scope.intervalProgressBar();

        if ($scope.order.length > 0){
            $http.post('/buy', $scope.order).
            then(function(response){                                   $scope.message = response.data.msg;
                console.log("post: ", $scope.order)
                console.log('msg: ', $scope.message)
            });
        }
    }
});