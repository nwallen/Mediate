// CollectionsCollection.js
// yes, a collection of collections...

define([

'backbone',
'underscore',
'models/CollectionModel',
'config',
'core/LocastCollection',
'models/CastsCollection',

], 

function (Backbone, _, CollectionModel, config, LocastCollection, CastsCollection) {

    var CollectionsCollection = LocastCollection.extend({
        
        model: CollectionModel, 

        url: function () {
            return config.api.collection;
        },
        
        // get JSON to create a collection preview in a cast
        getCollectionPreview: function (collectionid) {
            this.getModelorFetch(collectionid, this.getCollectionPreviewJSON)
        },

        getCollectionPreviewJSON: function (model, _this) {
            var casts = model.get('casts_ids');
            var castsCollection = new CastsCollection();

            castsCollection.fetch({
                url: model.get('casts'),
                data: {
                    page:1,
                    pagesize:10,
                },
                success: function (castcollection) {
                    var collectionJSON = model.toJSON();
                    collectionJSON.castJSON = castcollection.toJSON();
                    _this.trigger('collectionpreview', collectionJSON);
                }
            });
        },
 
    });

    return CollectionsCollection;

});
