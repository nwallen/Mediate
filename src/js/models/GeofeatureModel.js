// GeofeatureModel.js
//

define(['backbone'], function(Backbone) { 
 
    var GeofeatureModel = Backbone.Model.extend({

        url: function () {
            return FEATURES_API_URL + '/';
        },

        select: function () {
            this.collection.selectGeofeature(this);
        },

    });

    return GeofeatureModel;

});
