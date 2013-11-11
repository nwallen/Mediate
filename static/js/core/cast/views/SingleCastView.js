// SingleCastView.js
// base view for a single cast 

define([
        
'backbone',
'underscore',
'core/LocastDispatcher',
'core/LocastView',
'core/cast/views/CastMediaView',
'core/cast/views/CastCommentsView',
'core/cast/views/CastTagsView',
'core/cast/views/CastDescriptionView',
'core/cast/views/CastTitleView',
'core/cast/views/CastActionsView',
'core/cast/views/CastLocationView',
'core/cast/views/CastCollectionView',

'text!core/cast/templates/castTemplate.html',

], 

function(Backbone, _, LocastDispatcher, LocastView, CastMediaView, CastCommentsView, CastTagsView, CastDescriptionView, CastTitleView, CastActionsView, CastLocationView, CastCollectionView, castTemplate) {

    var SingleCastView = LocastView.extend({
   
        _casts: undefined,

        template: _.template(castTemplate),
    
        tagName: "li",

        // set the el class based on model 
        attributes: function () {
            return{
                class: 'cast cast-' + this.model.get('id')
            }
        },

        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
            },

            exit: function () {
                
            },
            
            render: function (options) {
                if (this.view.options.template) {
                    this.view.$el.html(this.view.options.template({cast:this.view.model.toJSON()}));
                }
                else {
                    this.view.$el.html(this.view.template({cast:this.view.model.toJSON()}));
                }
                // renderSubView() is in LocastView
                this.view.renderSubView(this.view._castTagsView, '.cast-tags', this.view); 
                this.view.renderSubView(this.view._castMediaView, '.cast-media', this.view);
                this.view.renderSubView(this.view._castCommentsView, '.cast-comments', this.view); 
                this.view.renderSubView(this.view._castDescriptionView, '.cast-description', this.view);
                this.view.renderSubView(this.view._castTitleView, '.cast-title', this.view);
                this.view.renderSubView(this.view._castActionsView, '.cast-actions', this.view);
                this.view.renderSubView(this.view._castLocationView, '.cast-location', this.view);
                this.view.renderSubView(this.view._castCollectionView, '.cast-collections', this.view);
            }, 
        },

        // cast states inherit baseState

        castStates: {
            base: {},
        },

        // setup

        initialize: function () {
            // instantiate subviews 
            this._castMediaView = new CastMediaView({model:this.model});
            this._castCommentsView = new CastCommentsView({model:this.model});
            this._castTagsView = new CastTagsView({model:this.model});
            this._castDescriptionView = new CastDescriptionView({model:this.model});
            this._castTitleView = new CastTitleView({model:this.model});
            this._castActionsView = new CastActionsView({model:this.model, parentCastView:this});
            this._castLocationView = new CastLocationView({model:this.model});
            this._castCollectionView = new CastCollectionView({model:this.model});


            // instantiate view states
            this.addViewStates(this.castStates).setViewState(this.states.base); 
        }, 

        // public interface

        render: function () {
            this.state.render(); 
            return this;   
        },
 
    });

    return SingleCastView;

});
