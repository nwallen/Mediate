// MapRouter.js
// controls routes in the map visualization

define([
        
'backbone', 
'backboneSubroute',
'config',
'MAP/views/MapView',

], 

function(Backbone, SubRoute, config, MapView){
    
    var MapRouter = Backbone.SubRoute.extend({
       
            _mapView: undefined,
             
            routes: {
                '':     'homeMap',
                'cast/:id':  'castMap',  
                'collection/:id':  'collectionMap',
                'collection/:collectionid/cast/:castid':  'collectionCastMap',         
            },

            homeMap: function () {
                this._mapView.showAll(); 
            },

            castMap: function (id) {
                this._mapView.showCast(id); 
            },
            
            collectionMap: function (id) {
                this._mapView.showCollection(id); 
            },

            collectionCastMap: function (collectionid, castid) {
                this._mapView.showCastinCollection(castid, collectionid); 
            },

            initialize: function (options) {
            
                // manually add routes with custom lexicon from config.js
                // prefix is because this is a subroute 
                //this.route(this.prefix + config.lexicon.cast + '/:id', 'castMap');
                //this.route(this.prefix + config.lexicon.cast + '/:id/', 'castMap'); // support backslash

                //this.route(this.prefix + config.lexicon.collection + '/:id', 'collectionMap');
                //this.route(this.prefix + config.lexicon.collection + '/:id/', 'collectionMap'); // support backslash
            
                //this.route(this.prefix + config.lexicon.collection + '/:id/' + config.lexicon.cast + '/:id', 'collectionCastMap');
                //this.route(this.prefix + config.lexicon.collection + '/:id/' + config.lexicon.cast + '/:id/', 'collectionCastMap');                 
                this._mapView = new MapView({
                    el:'#' + this.vizConfig.id, 
                    viewConfig: this.vizConfig
                });
            }

    });

    return MapRouter;

});
