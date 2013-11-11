// CastMediaModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var CastCommentModel = Backbone.Model.extend({

        url: function () {
            return this.get('uri');
        },

        select: function () {
            this.collection.selectCastComment(this);
        } 

    });

    return CastCommentModel;

});
