angular.module('NCKUBuyer')
.controller('BuyController', function($http, $scope){
    var self = this;
    self.stores = [];
    
    $http({method: 'GET', url: '/buy'}).then(function succ(response){
        self.stores = response.data;
    });
    
    // data
    self.title = "我要買宵夜!";
    
    self.orderDescription = "幫買小幫手：每筆訂單至少須多加10元的工本費，每買3個項目則多加5元，不足3個則以5元計算 ^_^"

    self.selectedStoreId = 0;

    self.getCurrentItems = function(tab){
        return self.stores[tab].items;
    }

    self.setCurrentStoreId = function(tab){
        self.selectedStoreId = tab;    
    }

    self.getCurrentStoreName = function(tab){
        return self.stores[tab].name;
    }

    self.order = new Array();

    self.addFood = function(item){
        // check if the item is already ordered
        var foodName = item.food;
        var storeId = self.selectedStoreId;

        var orderIndex = -1;
        for (i = 0; i < self.order.length; i++){
            if (foodName == self.order[i].food && storeId == self.order[i].storeId){
                // found already exists
                orderIndex = i;
                break;
            }
        }

        if (orderIndex == -1){  // new item
            var orderedItem = {};

            orderedItem['storeId'] = self.stores[self.selectedStoreId].id;
            orderedItem['storeName'] = self.stores[self.selectedStoreId].name;
            orderedItem['amount'] = 1;
            orderedItem['food'] = item.food;
            orderedItem['price'] = item.price;
            self.order.push(orderedItem);
        }else{  // old item, increase its amount
            self.order[orderIndex].amount += 1;
        }

        console.log(self.order);
    }

    self.increaseAmount = function(orderedItem){
        orderedItem['amount']++;
    }

    self.decreaseAmount = function(orderedItem, $index){
        orderedItem['amount']--;
        if (orderedItem['amount'] == 0){
            self.order.splice($index, 1)
        }
    }

    self.totalPrice = function(){
        var total = 0;
        if (self.order.length > 0){
            for(i = 0; i < self.order.length; i++){
                total += self.order[i].price * self.order[i].amount;
            }
        }
        total += self.extraPay();
        return total;
    }

    self.removeOrderedItem = function($index){
        self.order.splice($index, 1);
    }

    self.extraPay = function(){
        var totalAmount = 0;
        for (i = 0; i < self.order.length; i++){
            totalAmount += self.order[i]['amount'];
        }
        var total = (totalAmount > 0) ? 10 : 0;
        var extra = Math.floor(totalAmount / 3);
        if (totalAmount % 3 > 0){
            extra += 1;
        }
        total += extra * 5;
        return total;
    }
});