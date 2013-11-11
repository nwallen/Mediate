// LocastView.js
// Base class for all views. Adds support for view states to Backbone view.


define([
        
'backbone',
'underscore',
'core/LocastClass',
'core/LocastState',
'core/LocastDispatcher',
'jquerySerializeobject',
        
], 

function (Backbone, _, LocastClass, LocastState, LocastDispatcher) {
    
    var LocastView = Backbone.View.extend({
      
        //view states

        // base of view fragment url
        viewFragmentBase: '',

        // fragment elements to keep url updated
        // { urlName: 'viewVar' } becomes urlName/viewVar/
        viewFragments: {},

        // state that all view states inherit
        baseState: {},

        // active state
        state: undefined,

        // state selected before current state
        previousState: undefined,

        // adds new states to the view 
        // expects { statename:{statemethods} }
        addViewStates: function (states) {
            // iterate through the states argument object
            _.each( states, function (state, name) {
                    // copy base state object
                    var baseState = _.clone(this.baseState);
                    // extend the copied base state
                    var mergedState = _.extend(baseState, state);
                    // create a locast state
                    var thisState = LocastState.extend(mergedState);
                    // instantiate and add to available states
                    if (this.states) { 
                        this.states[name] = new thisState(this);
                    } 
                    else {
                        this.states = {};
                        this.states[name] = new thisState(this);
                    }

            }, this);


            return this;
        },

        // sets active state
        setViewState: function (state) {
            if(this.state !== state){
                if(this.state){
                    // keep a reference to the previous state
                    this.previousState = this.state;
                    this.state.deactivate();
                    this.state.exit();
                }
                this.state = state;
                this.state.enter();
                this.state.activate();
            }

            return this;
        },


        // visualization switching is achieved via global events passed over LocastDispatcher.
        // this helper adds the needed states and event listener to make the view responsive to 
        // global visualization events
        //
        // call in your view 'initialize' to add required states and events
        // IMPORTANT change states when calling your view's public methods or the view will stay in the 'hidden' state
        makeViewSwitchable: function () {
            // only make the view switchable if the view has been passed a viewConfig option
            if (this.options.viewConfig) {
                this.addViewStates(this.switchStates).setViewState(this.states.initialized);
                LocastDispatcher.on('visualization:change', this.onVisualizationChange, this);
            }

            return this;
        },

        // set view to deactivated state if its slug does not match change event
        onVisualizationChange: function (slug) {
            if (this.options.viewConfig.slug !== slug) {
                this.setViewState(this.states.hidden);
            }
        },
        
        // states that show and hide view
        // editing will change the transition for all views
        switchStates: {
            hidden: {
                activate: function () {
                    this.view.$el.fadeOut();
                },
                deactivate: function () {
                    LocastDispatcher.trigger('visualization:active', this.view.options.viewConfig.slug); 
                    this.view.$el.fadeIn();
                },
            },

            initialized: {
                activate: function () {
                },
                deactivate: function () {
                    LocastDispatcher.trigger('visualization:active', this.view.options.viewConfig.slug); 
                    this.view.$el.fadeIn();
                },
            }, 
        },

        // helper to update url and history to represent application state
        updateViewFragment: function () {
            // start url fragment with fragment base
            var thisFragment = this.viewFragmentBase;
            // iterate through fragments
            _.each( this.viewFragments, function (fragmentVar, name) {
                    // get fragment value from view
                    var fragmentValue = this[fragmentVar] ;
                    // add to url
                    if (fragmentValue) { 
                        thisFragment += name + '/' + fragmentValue + '/';
                    }
            }, this);
            // set url (does not call the url callback in the router)
            Backbone.history.navigate(thisFragment);
        },

        // helper for getting data out of view forms
        formToObject: function ($form) {
            return obj = $form.serializeObject();
            //return JSON.stringify(obj, null, 2);            
        },

        // helper to reset the view el with the desired underscore template and optional data object
        //
        resetView: function (template, dataObj) {
            var template = template || this.template || undefined;
            if (template) {
                this.$el.html(template(dataObj));
            }
            else {
                this.$el.html('');
            }
        },

        // function suggested by http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
        // renders a subview to thisView's element indentified by the given selector
        // using setElement on the subView will retain event bindings
        //
        // since you are only calling render again on the subview and moving it to an
        // update DOM element (instead of destroying and re-rendering) there are possibilities 
        // to optimize render in the subview to be called multiple times but not do too much
        // extra work
        renderSubView: function (subView, selector, thisView) {
            if (selector) {
                if (thisView.$el.find(selector).length > 0) {
                    subView.setElement(thisView.$el.find(selector)).render();
                }
            }
            else {
                subView.setElement(thisView.$el).render();
            }
        },        

        // helpers for adding a collection to the view's model and binding events to the collection

        // name of the property that will be added 
        // on the view's model to hold the collection and bind events
        collectionNameinModel : undefined,
            
        // helper to instantiate and insert collection into the view's model

        addCollectiontoViewModel: function ( options) {
            this.collectionNameinModel = options.name || this.collectionNameinModel; 
            this.model[this.collectionNameinModel] = new options.collectionType;
            // url function should return url for collection
            this.model[this.collectionNameinModel].url = options.urlFunction(this.model);
            // add a reference to the parent model
            this.model[this.collectionNameinModel].parentModel = this.model;
        },

        // collection event binding helpers for use in view states

        bindCollectionEvents: function (targetCollection, viewState) {
             // when a collection model is updated 
            targetCollection.on('change', viewState['onCollectionChange'], viewState);
            // when a collection model is added
            targetCollection.on('add', viewState['onCollectionAdd'], viewState);
            //  when the collection is reloaded
            targetCollection.on('reset', viewState['onCollectionReset'], viewState);
            //  when something is deleted 
            targetCollection.on('destroy', viewState['onCollectionDestroy'], viewState);
        },

        // please be kind, unbind 
        unbindCollectionEvents: function (targetCollection, viewState) {
            targetCollection.off('change', viewState['onCollectionChange']);
            targetCollection.off('add', viewState['onCollectionAdd']);
            targetCollection.off('reset', viewState['onCollectionReset']);
            targetCollection.off('destroy', viewState['onCollectionDestroy']);

        },


        // helper used in various views to render a bunch of subviews from a collection
        // takes the approach that it's better to completely destroy and re-render subviews
        // instead of trying to cache and reuse subviews (creates complexity and bugs).
        // subviews should handle their own updates based on changes to their model(s).
        renderCollectionViews: function (options, singleModel) {
            var collection = options.collection;
            var selector = options.selector;
            var viewToCreate = options.viewToCreate;
            var template = options.template;
            var $parent = options.$parent;
            var state = options.state;
            var singleModel = singleModel;
            
            var tracker = '_' + selector;

            this[tracker] = this[tracker] || [];

            if (singleModel && collection.length > 1) {
                // insert html for a specific model 
                //var index = collection.indexOf(singleModel);
                this[tracker][singleModel.id] = new viewToCreate({model:singleModel, template:template, state:state,  $parent: $parent});

                 this.$el.find(selector).append(
                    this[tracker][singleModel.id].render().el      
                );
                //this.$el.find(selector).children().eq(index).before(
                    //this[tracker][singleModel.id].render().el      
                //);
            }
            else {

                collection.each( function (thisModel) {      
                     // destroy the existing view, thoroughly  
                    if (this[tracker][thisModel.id] != undefined) {
                        this[tracker][thisModel.id].undelegateEvents();
                        this[tracker][thisModel.id].$el.removeData().unbind();
                        this[tracker][thisModel.id].remove();
                    }

                    this[tracker][thisModel.id] = new viewToCreate({model:thisModel, template:template, state:state, $parent: $parent});
                    this.$el.find(selector).append(
                        this[tracker][thisModel.id].render().el
                    );
                }, this);
            }
        },
         
    });

    return LocastView;

});
