// CastsCollection.js

define([

'backbone',
'underscore',
'models/UserModel',
'config',
'core/LocastCollection',

], 

function (Backbone, _, UserModel, config, LocastCollection) {

    var UsersCollection = LocastCollection.extend({
        
        model: UserModel, 

        url: function () {
            return config.api.user;
        },  
 
    });

    return UsersCollection;

});
