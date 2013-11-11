// CollectionRouter.js
// control routes in the cast visualization

define([
        
'backbone', 
'backboneSubroute',
'config',
'core/collection/views/CollectionsView',

], 
        
function(Backbone, SubRoute, config, CollectionsView){
    
    var CollectionRouter = Backbone.SubRoute.extend({
        
            routes: {
                ''      :   'collections',
                ':id'   :   'singleCollection',
            },

            collections: function () {
                this._collectionView.collectionList(); 
            },

            singleCollection: function (id) {
                this._collectionView.singleCollection(id); 
            },
            
            initialize: function () {
                this._collectionView = this._collectionView || new CollectionsView({
                    el: '#' + this.vizConfig.id,
                    viewConfig: this.vizConfig
                });
            }

    });

    return CollectionRouter;

});
