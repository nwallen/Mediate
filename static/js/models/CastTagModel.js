// CastMediaModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var CastTagModel = Backbone.Model.extend({

        url: function () {
            // this is a url to query casts based on tag
            return config.api.cast + '?tags=' + this.get('tag');
        },

        select: function () {
            this.collection.selectCastTag(this);
        } 

    });

    return CastTagModel;

});
