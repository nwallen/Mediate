// CastTagsCollection.js

define([

'backbone',
'underscore',
'core/LocastCollection',
'models/CastTagModel',
'core/LocastDispatcher'


], 

function (Backbone, _, LocastCollection, CastTagModel, LocastDispatcher) {

    var CastTagsCollection = LocastCollection.extend({
        
        model: CastTagModel, 

        syncTagsFromModel: function (thisModel) {
            var thisModel = thisModel || this.parentModel;
            var _this = this;
            // add a model to the collection for each tag if there is not one already
            _.each(thisModel.get('tags'), function (tag, index) {
                var currentModel = _this.where({tag:tag});
                if (currentModel.length === 0) {
                    var newTagModel = new CastTagModel({tag:tag, id:index});
                    _this.add(newTagModel);
                }
            });
        },

        selectCastTags: function (castTagModel) {
            LocastDispatcher.trigger('casttag:selected', castTagModel);
        } 
 
    });

    return CastTagsCollection;

});
