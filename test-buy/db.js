module.exports = function(host, user, password, database){
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    
    var mysql = require('mysql');
    
    this.connection;
    
    this.handleConnect = function(){
        
        this.connection = mysql.createConnection({
            host: host, 
            user: user, 
            password: password, 
            database: database
        });
        
        this.connection.connect(function(err){
            if (err) {
                console.log('connecting error');
                // 2秒後重連
                setTimeout(this.handleConnect(), 2000);
            }
            console.log('connecting success'); 
        });
        
        this.connection.on('error', function(err){
           console.log('db error', err) ;
            if (err.code === 'PROTOCOL_CONNECTION_LOST'){
                this.handleConnect();
            }else{
                throw err;
            }
        });
    };
    
    this.handleConnect();
    
    this.query = function(queryStr){
        this.connection.query(queryStr, function(error, rows, fields){
           if (error){
               console.log('Query fail: ' + queryStr)
               throw error;
           }else{
                console.log('Query succeeded: ');
                console.log(rows);
            }
        });
    };
    
    this.insert = function(insertStr, data){
        // data example
//        var data = {
//            name: 'steve',
//            telephone: '32433', 
//            dorm: 'kuFong-2'
//        };
        this.connection.query(insertStr, data, function(error){
            if (error){
                console.log('Insert fail: ' + insertStr)
            }else{
                console.log('Insert succeeded: ');
            }
        });
    };
    
    this.closeDb = function(){
        this.connection.end();
    }
};
