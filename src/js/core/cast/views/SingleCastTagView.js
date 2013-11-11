// SingleCastTagView.js
// view for a cast tag

define([
        
'backbone',
'underscore',
'core/LocastView',

'text!core/cast/templates/castSingleTagTemplate.html',

], 

function(Backbone, _, LocastView, castSingleTagTemplate) {


    var SingleCastTagView = LocastView.extend({
 
        tagName: 'li',
        
        // set the el class based on model 
        attributes: function () {
            return{
                class: 'tag ' + this.model.get('id')
            }
        },
         
        template: _.template(castSingleTagTemplate),

        events: {
            'click .delete': 'tagDelete', 
        },
    
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                this.view.model.on('change', this.onModelChange, this);
            },

            exit: function () {
                 this.view.model.off('change', this.onModelChange);
            },

            onModelChange: function (thisModel) {
                 this.render();
            },

            render: function () {
                this.view.$el.html(this.view.template({ tag:{ 
                    cast: this.view.model.collection.parentModel.toJSON(),
                    data: this.view.model.toJSON() 
                }}));
            },

            tagDelete: function () {
                this.view.model.trigger('destroy', this.view.model);
            }

        },

        // cast states inherit baseState

        singleCastTagStates: {
            preview: {},
        },

        // setup

        initialize: function () {
            // instantiate view states
            this.addViewStates(this.singleCastTagStates).setViewState(this.states.preview); 
        }, 

        tagDelete: function () {
            this.state.tagDelete();
        },

        // public interface

        render: function () {
            this.state.render();
            return this;
        }
        
    });

    return SingleCastTagView;

});
