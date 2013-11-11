// CastActionsView.js
// cast actions

define([
        
'backbone',
'underscore',
'core/LocastView',
'config',
'core/LocastDispatcher',

'text!core/cast/templates/castActionsTemplate.html',

// backbone plugin
'backboneModal',

], 

function(Backbone, _, LocastView, config, LocastDispatcher, castActionsTemplate) {


    var CastActionsView = LocastView.extend({
   
        tagName: 'div',

        className: 'title',

        events: {
            'click .favorite': 'favoriteCast',
            'click .flag': 'flagCast',
            'click .delete': 'deleteCast',
        },

        template: _.template(castActionsTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.model.on('change', this.onModelChange, this);
            },

            exit: function () {
                this.view.model.off('change', this.onModelChange);
            },

            // interface

            render: function () {
                // render description template
                this.view.$el.html(this.view.template({
                    cast: this.view.model.toJSON(),
                })); 
            },

            onModelChange: function (updatedModel) {
                this.render();
            },

            // handlers
            
            favoriteCast: function () {
                var data = this.view.model.get('is_favorite');
                this.view.model.favorite(!data);
            },
            
            flagCast: function () {
                // this should trigger a modal with, ideally, a form for the
                // user to write a message to the admin
                this.view.model.flag();
            },

            deleteCast: function () {
                this.view.$deleteModal = this.view.$el.find('.delete-modal');
                var _this = this;

                this.view.$deleteModal.modal();
                // delete
                this.view.$deleteModal.find('.confirm-delete').on('click', function () {
                    _this.view.$deleteModal.find('.confirm-delete').off('click');
                    _this.view.model.destroy({
                        success: function (model, response) {
                            _this.view.$deleteModal.modal('hide');
                            // remove the parent view from DOM
                            if (_this.view.options.parentCastView) {
                                _this.view.options.parentCastView.remove();
                            }
                            LocastDispatcher.trigger('cast:delete', _this.view.model);   
                        }
                    });
                });
                // cancel
                this.view.$deleteModal.find('.cancel').on('click', function () {
                    _this.view.$deleteModal.find('.cancel').off('click');
                    _this.view.$deleteModal.modal('hide');
                });
            },

            editActions: function () {
                this.view.setViewState(this.view.states.editing);
            },

           

        },

        // cast states inherit baseState

        castActionsStates: {
            open: {},
            editing: {
                 activate: function () {
                    this.view.$editModal = this.view.$el.find('#title-form-cast-' + this.view.model.get('id'));
                    this.view.$editModal.modal();
                    var _this = this;
                    this.view.$editModal.on('hide', function () {
                        _this.view.setViewState(_this.view.states.open);
                    });
                     this.view.$editModal.find('.cancel').on('click', function () {
                        _this.view.$editModal.find('.cancel').off('click');
                        _this.view.$editModal.modal('hide');                       
                        _this.view.setViewState(_this.view.states.open);
                     });
                 },
                editActions: function () {
                    this.view.setViewState(this.view.states.open);
                },
                deactivate: function () { 
                    this.view.render();
                },
            }, 
        },

        // setup

        initialize: function () { 
            // instantiate view states
            this.addViewStates(this.castActionsStates).setViewState(this.states.open);
        }, 

        // handlers

        favoriteCast: function () {
            this.state.favoriteCast();
        },

        flagCast: function () {
            this.state.flagCast();
        },

        deleteCast: function () {
            this.state.deleteCast();
        },

        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastActionsView;

});
