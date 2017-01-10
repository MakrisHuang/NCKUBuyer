var mysql = require('mysql');
var config = {
    host: 'localhost', 
    user: 'root', 
    password: 'password', 
    database: 'nckubuyer'
}
var connection = mysql.createConnection(config);

(function handleConnect(){
    connection.connect(function(err){
        if (err) {
            console.log('connecting error');
            // 2秒後重連
            setTimeout(handleConnect(), 2000);
        }
        console.log('connecting success'); 
    });
    
    connection.on('error', function(err){
       console.log('db error', err) ;
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleConnect();
        }else{
            throw err;
        }
    });
    
}());

module.exports = {
    config: config,
    connection: connection,
    queryUserExist: function(table, account, password){
        var querySql = "SELECT * FROM " + table + " WHERE account = " + "\'" + account + "\'" + " AND password = " + "\'" + password + "\'";
        
        connection.query(querySql, function(error, results){
            if (error){
               console.log('Query fail: ' + querySql)
               throw error;
            }
            console.log('results: ', results);
            callback(error, results);
        });
    },
    
    insertUser: function(table, data, callback){
        var insertSql = 'INSERT INTO ' + table + ' SET ? ';
        console.log('new user: ' + data)
//        var data = {
//            account: 'steve',
//            password: '123',
//            telephone: '32433', 
//            dorm: 'kuFong-2'
//        };
        
        connection.query(insertSql, data, function(error, results){
            if (error){
                console.log('Insert fail: ' + insertStr);
                throw error;
            }
            console.log('create new user succeeded');
            callback(results);
        });
    },
    
    deleteUser: function(table, account, callback){
        var deleteSql = 'DELETE FROM ' + table + ' WHERE account = ' + "\'" + account + "\'";
        
        connection.query(deleteSql, function(error, results){
            if (error){
                console.log('Delete fails: ', deleteSql);
            }
            console.log('delete user succeeded');
            callback(results);
        })
    },
    
    closeDb: function(){
        connection.end();
        console.log('database close')
    }
};
