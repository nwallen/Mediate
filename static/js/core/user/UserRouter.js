// UserRouter.js
// control routes in the user module

define([
        
'backbone', 
'backboneSubroute',
'config',
'core/user/views/UsersView',

], 
        
function(Backbone, SubRoute, config, UsersView){
    
    var UserRouter = Backbone.SubRoute.extend({
        
            routes: {
                ''      :   'users',
                ':id'   :   'singleUser',
            },

            users: function () {
                this._usersView.userList(); 
            },

            singleUser: function (id) {
                this._usersView.singleUser(id); 
            },
            
            initialize: function () {
                this._usersView = this._usersView || new UsersView({
                    el: '#' + this.vizConfig.id,
                    viewConfig: this.vizConfig
                });
            }

    });

    return UserRouter;

});
