var dorms = [
	{
		"id": 1, 
		"dorm": "dorm1", 
		"location": "dorm1-location"
	}, 
	{
		"id": 2, 
		"dorm": "dorm2", 
		"location": "dorm2-location"
	}, 
	{
		"id": 3, 
		"dorm": "dorm3", 
		"location": "dorm3-location"
	}
]

module.exports = {
    get: function(id){
        return _.find(dorms, function(dorm){
            return dorm.id === id;
        })
    },
    all: function(){
        return dorms;
    }
}