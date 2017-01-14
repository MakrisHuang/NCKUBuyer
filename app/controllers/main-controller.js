angular.module('NCKUBuyer').controller('MainController', function(LoginHelper, FindHelper){
    var self = this;
    self.loginHelper = LoginHelper;
    
    // check if the user is logged in when the application loads
    // LoginHelper will automatically update isLoggedIn
    // after this call finishes
    self.session = LoginHelper.session();
    console.log('session: ', self.session)
    
    // set identity
    self.setIdentity = function(identity){
        if (LoginHelper.isLoggedIn){
            // renew the identity of usreInfo
            LoginHelper.userInfo.identity = identity;
            FindHelper.emit('set:identity', LoginHelper.userInfo);
        }
        
        // change brand color
        if (identity == 'buyer'){
            self.buyerIdentity = {'color': "#FF9090"}
            self.helperIdentity = {'color': ""}            
        }
        if (identity == 'helper'){
            self.buyerIdentity = {'color': ""}
            self.helperIdentity = {'color': "#FF9090"}            
        }
        
    }
    
    // create ng-style if the identity is selected
    self.buyerIdentity = {'color': "#FF9090"}
    self.helperIdentity = {'color': ""}
});