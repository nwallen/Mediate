// CastTitleView.js
// cast title

define([
        
'backbone',
'underscore',
'core/LocastView',
'moment',
'config',

'text!core/cast/templates/castTitleTemplate.html',

// backbone plugin
'backboneModal',

], 

function(Backbone, _, LocastView, moment, config, castTitleTemplate) {


    var CastTitleView = LocastView.extend({
   
        tagName: 'div',

        className: 'title',

        events: {
            'click .edit-title': 'editTitle',
            'submit': 'updateTitle',
        },

        template: _.template(castTitleTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.model.on('change:title', this.onModelChange, this);
            },

            exit: function () {
                this.view.model.off('change:title', this.onModelChange);
            },

            // interface

            render: function () {

                var updatedFormatted = moment(this.view.model.get('updated'))[config.date.momentMethod]();
                var createdFormatted = moment(this.view.model.get('created'))[config.date.momentMethod]();

                // render description template
                this.view.$el.html(this.view.template({
                    formattedDates: {
                        updated:updatedFormatted, 
                        created:createdFormatted
                    },
                    cast: this.view.model.toJSON(),
                })); 
            },

            onModelChange: function (updatedModel) {
                this.render();
            },

            editTitle: function () {
                this.view.setViewState(this.view.states.editing);
            },

            updateTitle: function (e) {
                e.preventDefault();
                var formId = '#title-form-cast-' + this.view.model.get('id');
                var data = this.view.formToObject(this.view.$el.find(formId));  
                this.view.$editModal.modal('hide'); 
                this.view.model.set(data);
                this.view.model.save(); 
            },

        },

        // cast states inherit baseState

        castTitleStates: {
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
                editTitle: function () {
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
            this.addViewStates(this.castTitleStates).setViewState(this.states.open);
        }, 

        // handlers

        editTitle: function () {
            this.state.editTitle();
        },

        updateTitle: function (e) {
            this.state.updateTitle(e);
        },

        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastTitleView;

});
