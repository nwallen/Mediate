// CastDescriptionView.js
// base view cast tags

define([
        
'backbone',
'underscore',
'core/LocastView',
'markdown',
'moment',

'text!core/cast/templates/castDescriptionTemplate.html',

// backbone plugin
'backboneModal',

], 

function(Backbone, _, LocastView, Markdown, moment, castDescriptionTemplate) {


    var CastDescriptionView = LocastView.extend({
   
        tagName: 'div',

        className: 'description',

        events: {
            'click .edit': 'editDescription',
            'submit': 'updateDescription',
        },

        template: _.template(castDescriptionTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.model.on('change:description', this.onModelChange, this);
            },

            exit: function () {
                this.view.model.off('change:description', this.onModelChange);
            },

            // interface

            render: function () {
                // instantiate a markdown converter
                this.view.markdownConverter = new Markdown.getSanitizingConverter();
                // create a unique id to use for the markup editor elements 
                var uniqueId = 'description-' + this.view.model.get('id') + '-' + moment().unix(); 
                // initialize a new markdown editior with the unique id
                this.view.markdownEditor = new Markdown.Editor(this.view.markdownConverter, '-'+uniqueId);

                // process description markdown
                var description = this.view.model.get('description');
                if (description) {
                    var descriptionHtml = this.view.markdownConverter.makeHtml(description);
                }
                else {
                    var descriptionHtml = '';
                }

                // render description template
                this.view.$el.html(this.view.template({description:{
                    uniqueId: uniqueId,
                    Html: descriptionHtml,
                    cast: this.view.model.toJSON(),
                }})); 
            },

            onModelChange: function (updatedModel) {
                this.render();
            },

            editDescription: function () {
                this.view.setViewState(this.view.states.editing);
            },

            updateDescription: function (e) {
                e.preventDefault();
                var formId = '#description-form-cast-' + this.view.model.get('id');
                var data = this.view.formToObject(this.view.$el.find(formId));  
                
                this.view.$editModal.modal('hide'); 
                this.view.model.set(data);
                this.view.model.save(); 
            },

        },

        // cast states inherit baseState

        castDescriptionStates: {
            open: {},
            editing: {
                 activate: function () {
                    this.view.markdownEditor.run();
                    this.view.$editModal = this.view.$el.find('#description-form-cast-' + this.view.model.get('id'));
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
                editDescription: function () {
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
            this.addViewStates(this.castDescriptionStates).setViewState(this.states.open);
        }, 

        // handlers

        editDescription: function () {
            this.state.editDescription();
        },

        updateDescription: function (e) {
            this.state.updateDescription(e);
        },

        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastDescriptionView;

});
