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
        // renew the identity of usreInfo
        LoginHelper.userInfo.identity = identity;
        console.log('[MainController] LoginHelper.userInfo: ', LoginHelper.userInfo)
        
        if (LoginHelper.isLoggedIn){
            FindHelper.emit('set:identity', LoginHelper.userInfo);
        }
    }
});