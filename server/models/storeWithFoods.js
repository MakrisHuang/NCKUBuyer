var storeWithFoods = [
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

module.exports = {
    all: function(){
        return storeWithFoods;
    }
}