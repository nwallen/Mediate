// CastCollectionView.js
// base view cast tags

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CollectionsCollection',

'text!core/cast/templates/castCollectionPreviewTemplate.html',

], 

function(Backbone, _, LocastView, CollectionsCollection, castCollectionPreviewTemplate) {


    var CastCollectionView = LocastView.extend({
   
        tagName: 'div',

        className: 'collection',

        previewTemplate: _.template(castCollectionPreviewTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.model.on('change:collections_ids', this.onModelChange, this);
                this.view._collectionsCollection.on('collectionpreview', this.onCollectionPreview, this);
            },

            exit: function () {
                this.view.model.off('change:collections_ids', this.onModelChange);
                this.view._collectionsCollection.off('collectionpreview', this.onCollectionPreview);
            },

            // interface

            render: function () {
                this.view.resetView();
                var collectionids = this.view.model.get('collections_ids');
                _.each(collectionids, function (collectionid, index) {
                    this.view._collectionsCollection.getCollectionPreview(collectionid);
                }, this);
            },

            onModelChange: function (updatedModel) {
                this.render();
            },

            onCollectionPreview: function (json) {
                this.view.$el.append(this.view.previewTemplate({collection:json}));
            },
        },

        // cast states inherit baseState

        castCollectionStates: {
            open: {},
        },

        // setup

        initialize: function () { 

            this._collectionsCollection = new CollectionsCollection();

            // instantiate view states
            this.addViewStates(this.castCollectionStates).setViewState(this.states.open);

            
        }, 

        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastCollectionView;

});
