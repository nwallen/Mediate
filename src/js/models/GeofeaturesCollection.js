// GeofeaturesCollection.js
//

define([
        
'backbone', 
'config',
'models/GeofeatureModel',
'core/LocastDispatcher'
        
], 

function(Backbone, config, GeofeatureModel, LocastDispatcher) { 
 
    var GeofeaturesCollection = Backbone.Collection.extend({
        
        model: GeofeatureModel, 

        query: undefined,
        
        url: function () {
            return config.api.geofeatures + ((this.query) ? ('?' + this.query):'');
        },
 
        setQuery: function (query) {
            this.query = query || undefined;
        },

        parse: function (response, xhr) {
             LocastDispatcher.trigger('geofeature:json', response);
             // have backbone generate models from the geoJSON for casts
             return response.casts.features;
        },

        selectGeofeature: function(geofeature){
            LocastDispatcher.trigger("geofeature:selected", geofeature);
        }
        

    });

    return GeofeaturesCollection;

});
