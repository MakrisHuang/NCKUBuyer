var Dorms = require('../models/dorms');
var StoreWithFoods = require('../models/storeWithFoods')

module.exports = function(app){
    app.get('/buy', function(request, response){
        // load data content
        response.json(StoreWithFoods.all());
        response.status(200)
    });
    
    app.post('/buy', function(request, response){
        // progress bar
        if (request.body['req']){
            console.log('progress bar')
            response.send({'progress': 60})
        }else{
            // order handling
            console.log('order: ', request.body)
            response.send({msg: 'get order'})
        }
    });
};