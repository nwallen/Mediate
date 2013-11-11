// CastModel.js
//

define([
        
'backbone', 
'config'

], 

function(Backbone, config) { 
 
    var CastModel = Backbone.Model.extend({

        castMedia: undefined,

        // add a slash to end of the url
        url: function () {
            return Backbone.Model.prototype.url.call(this) + '/' ;
        },

        favorite: function (data) {
            this.save(null, {
                data: 'favorite=' + data,
                url: this.url() + 'favorite/',
                type: 'POST',
                success: function (model) {
                    model.fetch();
                }
            });
        },

        flag: function () {
            this.save(null, {
                url: this.url() + 'flag/',
                type: 'POST',
                success: function (model) {
                    model.fetch();
                }
            });
        }

    });

    return CastModel;

});
