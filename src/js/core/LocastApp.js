// locastApp.js
// base view for the locast app

define([
   
'backbone',
'underscore',
'core/LocastDispatcher',
'core/LocastRouter',
'core/LocastView',
'config',
'globals',
'core/nav/views/LocastNavView',
'core/user/views/UserMenuView',

// load subrouters
'loadRoutes',
], 

function(Backbone, _, LocastDispatcher, LocastRouter, LocastView, config, globals, LocastNavView, UserMenuView) { 
    
    var LocastApp = LocastView.extend({
        
        el: '#' + config.app.id,

        router: '',

        baseState: {
            initialize: function (view) {
                this.view = view;
            },
        },

        appStates: {
            loggedOut: {},
            loggedIn: {}, 
        },

        initialize: function () {

            // app events 
            LocastDispatcher.on('visualization:active', this.onActiveViz, this);
            LocastDispatcher.on('cast:delete', this.onCastDelete, this);
            LocastDispatcher.on('cast:create', this.onCastCreate, this);
            LocastDispatcher.on('user:login', this.onLogin, this);

            // instantiate main Router and UI
            this.nav =  new LocastNavView();
            this.userMenu = new UserMenuView();
            this.router = new LocastRouter();
        },

        onCastDelete: function () {
            // redirect app to base visualization on deleting cast
            var currentSlug = this.nav.getCurrentSlug();
            Backbone.history.navigate('#!/' + currentSlug + '/', {trigger: true});
        },

        onCastCreate: function (newCastModel) {
            // redirect app to view the created cast
            var castId = newCastModel.get('id');
            Backbone.history.navigate('#!/' + config.lexicon.cast + '/' + castId + '/', {trigger: true});
        },

        onLogin: function (userJSON) {
            globals.auth.loggedIn = userJSON.id;
            this.userMenu.render();
        },

        onActiveViz: function (vizSlug) {
            this.nav.setItem(vizSlug);
            LocastDispatcher.trigger('visualization:change', vizSlug);
        }

    });

    return LocastApp;
});
