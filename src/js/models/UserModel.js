// UserModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var UserModel = Backbone.Model.extend({

        url: function () {
            return config.api.user + this.get('id') + '/';
        },
    
    });

    return UserModel;

});
