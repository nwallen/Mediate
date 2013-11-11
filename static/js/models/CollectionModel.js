// CollectionModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var CollectionModel = Backbone.Model.extend({

        // add a slash to end of the url
        url: function () {
            return Backbone.Model.prototype.url.call(this) + '/' ;
        },

    });

    return CollectionModel;

});
