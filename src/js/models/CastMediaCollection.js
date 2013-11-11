// CastMediaCollection.js

define([

'backbone',
'underscore',
'core/LocastCollection',
'models/CastMediaModel',
'config',
'core/LocastDispatcher'


], 

function (Backbone, _, LocastCollection, CastMediaModel, config, LocastDispatcher) {

    var CastMediaCollection = LocastCollection.extend({
        
        model: CastMediaModel, 

        selectCastMedia: function (castMediaModel) {
            LocastDispatcher.trigger('castMedia:selected', castMediaModel);
        } 
 
    });

    return CastMediaCollection;

});
