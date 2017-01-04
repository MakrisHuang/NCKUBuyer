module.exports = function(app){
    app.get('/', function(request, response){
        response.sendFile('client.html', {root: app.settings.app})   
    });
};