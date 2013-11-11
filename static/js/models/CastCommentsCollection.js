// CastCommentsCollection.js

define([

'backbone',
'underscore',
'core/LocastCollection',
'models/CastCommentModel',
'core/LocastDispatcher',
'moment'


], 

function (Backbone, _, LocastCollection, CastCommentModel, LocastDispatcher, moment) {

    var CastCommentsCollection = LocastCollection.extend({
        
        model: CastCommentModel, 

        comparator: function(comment) {
            var created = comment.get('created');
            return -moment(created).unix();
        }, 

        selectCastComment: function (castCommentModel) {
            LocastDispatcher.trigger('castcomment:selected', castCommentModel);
        } 
 
    });

    return CastCommentsCollection;

});
