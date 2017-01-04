var Dorms = require('../models/dorms');
var StoreWithFoods = require('../models/storeWithFoods')

module.exports = function(app){
    app.get('/buy', function(request, response){
        response.sendFile('/templates/buy.html', {root: app.settings.app})
        
        // load data content
        response.dorms = Dorms.all();
        response.storeWithFoods = StoreWithFoods.all();
        
        console.log('response.dorms = ' + response.dorms)
        console.log('response.storeWithFoods = ' + response.storeWithFoods);
    });
    
    app.post('/buy', function(request, response){
        // handle request of buying
    });
};