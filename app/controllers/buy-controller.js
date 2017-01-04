angular.module('NCKUBuyer')
.controller('BuyController', function($http){
   var self = this;
//    $http({method: 'GET', url: '/buy'}).success(function(data){
//        console.log("[controller] data from GET" + data)
//        self.data = data;
//    });
    
    // data
    self.title = "我要買宵夜!";
    self.stores = [
        {"id": 0,
         "name": "小上海",
         "items": [
                {"food": "薯條", 
                 "price": 20, 
                 "storeId": 0
                }, 
                {"food": "雞排", 
                 "price": 40, 
                 "storeId": 0
                },
                {"food": "鹽酥雞", 
                 "price": 30, 
                 "storeId": 0
                }, 
                {"food": "雞腿棒", 
                 "price": 20, 
                 "storeId": 0
                }
            ]
        }, 
        {"id": 1,
         "name": "轉角關東煮",
         "items": [
                {"food": "黑輪", 
                 "price": 10, 
                }, 
                {"food": "蝦棒", 
                 "price": 10, 
                },
                {"food": "米血", 
                 "price": 5, 
                }, 
                {"food": "地瓜葉", 
                 "price": 15, 
                }
            ]
        }, 
        {"id": 2,
         "name": "歡喜鹹酥雞",
         "items": [
                {"food": "雞排", 
                 "price": 40, 
                }, 
                {"food": "杏鮑菇", 
                 "price": 20, 
                },
                {"food": "小黃瓜", 
                 "price": 20, 
                }, 
                {"food": "茄子", 
                 "price": 20, 
                }, 
                {"food": "花椰菜", 
                 "price": 20, 
                }, 
                {"food": "秀珍菇", 
                 "price": 20, 
                }
            ]
        }
    ];

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