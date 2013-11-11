// LocastRouter.js
// handle application urls

define([
'require',       
'backbone',
'config',
'core/LocastDispatcher',
], 

function(require, Backbone, config, LocastDispatcher){ 
 
    var LocastRouter = Backbone.Router.extend({
           
        //main routes for the application 
        routes: {
            '!/:viz/*subroute':  'visualization'     
        },

        subRouters: {},
        initializedSubRouters: {},

        // if there is a subroute create it and pass the corresponding options from config.js
        visualization: function (viz, subroute) {
            if( this.subRouters[viz] ){
                if( !this.initializedSubRouters[viz] ){ 
                    this.initializedSubRouters[viz] = new this.subRouters[viz]['router']('!/' + viz + '/', {createTrailingSlashRoutes: true, vizConfig: this.subRouters[viz]['config']}); 
                }
            } 
        },

        // register subRouters defined in config.js
        registerSubRouters: function () {
            _.each(config.visualization, function (vizConfig, key, list) {
                this.subRouters[vizConfig.slug] = {};
                this.subRouters[vizConfig.slug]['router'] = require(vizConfig.routerPath);
                this.subRouters[vizConfig.slug]['config'] = vizConfig;  
            }, this);
        },

        initialize: function () {
            this.registerSubRouters();
            Backbone.history.start();
        },    

    });

    return LocastRouter;

});
