// LocastUsersView.js
// Users Info

define([
   
'backbone',
'underscore',
'config',
'core/LocastView',
'models/UsersCollection',
'core/user/views/SingleUserView',

'text!core/user/templates/usersTemplate.html',
// bootstrap js plugins
'bootstrap',

], 

function(Backbone, _, config, LocastView, UsersCollection, SingleUserView, usersTemplate) { 

    var UsersView = LocastView.extend({

        template: _.template(usersTemplate),        

        baseState: {

            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                this.view.bindCollectionEvents(this.view._users, this);
                this.view._users.on('idfetched', this.onCollectionAdd, this);
            },

            exit: function () {
                this.view.unbindCollectionEvents(this.view._users, this);
                this.view._users.off('idfetched', this.onCollectionAdd, this);
            },

            userList: function () {
                this.view.setViewState(this.view.states.list);
                this.view.resetView();
                this.view._users.fetch();
            },

            singleUser: function (userid) {
                this.view.setViewState(this.view.states.single);
                this.view.resetView();
                this.view._users.fetchID(userid);
            },

            // collection event handlers

            onCollectionReset: function (userCollection, response) {
                this.view.renderCollectionViews(this.view.usersRenderOptions); 
            },

            onCollectionAdd: function (userModel) {
                this.view.renderCollectionViews(this.view.usersRenderOptions, userModel); 
            },

        },

        usersStates: {
            base: {},
            list: {
                activate: function () {
                    this.view.usersRenderOptions.state = 'preview';
                },
            },
            single: {
                activate: function () {
                    this.view.usersRenderOptions.state = 'list';
                },
            },
        },
 
        initialize: function () { 
            this._users = new UsersCollection(); 

            this.usersRenderOptions = { 
                collection: this._users,
                selector: '.user-list',
                viewToCreate: SingleUserView,
                state:'preview', // the state the child view should enter
                $parent: this.$el, // jquery object with the parent element
            };

            this.addViewStates(this.usersStates).makeViewSwitchable().setViewState(this.states.base);
        },

        // public interface

        userList: function () {
            this.state.userList();
        },

        singleUser: function (userid) {
            this.state.singleUser(userid);
        },
       
    });

    return UsersView;
});
