// UserMenuView.js
// user menu shown when user is logged in

define([
   
'backbone',
'underscore',
'core/LocastDispatcher',
'core/LocastView',
'config',
'globals',
'models/UserModel',

'text!core/user/templates/userMenuTemplate.html',

// bootstrap js plugins
'bootstrap',

], 

function(Backbone, _, LocastDispatcher, LocastView, config, globals, UserModel, userMenuTemplate) { 


    var UserMenuView = LocastView.extend({

        model: UserModel,

        template: _.template(userMenuTemplate),
        
        el: '#' + config.userMenu.id,

        events: {
            'click .dropdown-toggle' : 'dropdownToggle',
        },

        baseState: {

            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                // listener for backbone bootstrap modal click                
                this.view.model.on('change', this.onUserFetch, this);
            },

            exit: function () {
                this.view.model.off('change', this.onUserFetch);
            },

            render: function () {
                this.view.$el.html(this.view.template({user:{}}));
                if (globals.auth.loggedIn) {
                    this.view.model.set('id', globals.auth.loggedIn);
                    this.view.model.fetch();
                }
            },

            onUserFetch: function (userModel) {
                this.view.$el.html(this.view.template({
                    user: this.view.model.toJSON(),
                }));
            },

            dropdownToggle: function () {
                this.view.$el.find('.dropdown-toggle').dropdown();
            },
        },

        UserMenuStates: {
            base: {},
        },
 
        initialize: function () { 
            this.model = new UserModel({id:globals.auth.loggedIn}); 
            this.addViewStates(this.UserMenuStates).setViewState(this.states.base);
            this.state.render();
        },

        // handlers 

        dropdownToggle: function () {
            this.state.dropdownToggle();
        },

        // public interface

        render: function () {
            this.state.render();
        }
       
    });

    return UserMenuView;
});
