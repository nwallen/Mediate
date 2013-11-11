// CollectionsView.js
// base view for showing collections 

define([
        
'backbone',
'underscore',
'core/LocastDispatcher',
'core/LocastView',
'models/CollectionsCollection',
'core/collection/views/SingleCollectionView',
'config',

'text!core/collection/templates/collectionsTemplate.html'

], 

function(Backbone, _, LocastDispatcher, LocastView, CollectionsCollection, SingleCollectionView, config, collectionsTemplate) {
 
    
    var CollectionsView = LocastView.extend({
   
        template: _.template(collectionsTemplate),
        
        _collections: undefined,
 
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                // collection listeners
                this.view.bindCollectionEvents(this.view._collections, this);
                this.view._collections.on('idfetched', this.onCollectionAdd, this); 
            },

            exit: function () {
                // unbind listeners
                this.view.unbindCollectionEvents(this.view._collections, this);
                this.view._collections.off('idfetched', this.onCollectionAdd);
            },

            // interface

            collectionList: function () {
                this.view.setViewState(this.view.states.list);
                this.view.resetView();
                this.view._collections.fetch();
            },

            singleCollection: function (collectionid) {
                this.view.setViewState(this.view.states.single); 
                this.view.resetView();
                this.view._collections.fetchID(collectionid);
            },

            collectionPreviewList: function (collectionids) {
                this.view.setViewState(this.view.states.listPreview); 
                this.view.resetView();
                _.each(collectionids, function (collectionid, index) {
                    this.view._collections.fetchID(collectionid);
                }, this);
            },

            // handlers

            onCollectionReset: function (castCollection, response) {
                this.view.renderCollectionViews(this.view.collectionsRenderOptions); 
            },

            onCollectionAdd: function (castModel) {
                this.view.renderCollectionViews(this.view.collectionsRenderOptions, castModel); 
            },
        
        },

        // cast states inherit baseState

        collectionstates: {
            base: {},
            list: {
                activate: function () {
                    this.view.collectionsRenderOptions.state = 'preview';
                },
            },
            listPreview: {
                activate: function () {
                    this.view.collectionsRenderOptions.state = 'preview';
                },
            },
            single: {
                activate: function () {
                    this.view.collectionsRenderOptions.state = 'list';
                },
            },
        },       
       
        // setup

        initialize: function () {
            // instantiate collections collection 
            this._collections = new CollectionsCollection;

            // options for rendering collections from _collections collection
            this.collectionsRenderOptions = { 
                collection: this._collections,
                selector: '.collections-list',
                viewToCreate: SingleCollectionView,
                state:'preview', // the state the child view should enter
                $parent: this.$el, // jquery object with the parent element
            }
            
            // instantiate view states
            this.addViewStates(this.collectionstates).makeViewSwitchable().setViewState(this.states.base); 
            this.resetView();
        }, 

        // public interface

        singleCollection: function (id) {
            this.state.singleCollection(id);
        },
        
        collectionList: function () {
            this.state.collectionList();
        },

        collectionPreviewList: function (collectionids) {
            this.state.collectionPreviewList(collectionids);
        },
 
    });

    return CollectionsView;

});
