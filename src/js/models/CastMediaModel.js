// CastMediaModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var CastMediaModel = Backbone.Model.extend({

        url: function () {
            return this.get('uri');
        },

        select: function () {
            this.collection.selectCastMedia(this);
        } 

    });

    return CastMediaModel;

});
