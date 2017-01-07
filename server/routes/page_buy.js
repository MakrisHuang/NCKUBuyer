var Dorms = require('../models/dorms');
var StoreWithFoods = require('../models/storeWithFoods')

module.exports = function(app){
    app.get('/buy', function(request, response){
        // load data content
        response.json(StoreWithFoods.all());
        response.status(200)
    });
};