// LocastDispatcher.js
// global object to pass events between parts of the application 


define([
    'backbone',
    'underscore'    
], 

function (Backbone, _) {
   
    // use backbone's events 
    var LocastDispatcher = _.extend({}, Backbone.Events);

    return LocastDispatcher;

});
