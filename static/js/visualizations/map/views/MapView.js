// MapView.js
// base view of the map visualization module

define([
        
'backbone',
'underscore',
'core/LocastMap',
'models/GeofeaturesCollection',
'core/cast/views/CastsView',
'core/LocastView',
'core/LocastDispatcher',
'moment',
'config',

'text!MAP/templates/mapVisualizationTemplate.html'

], 

function (Backbone, _, LocastMap, GeofeaturesCollection, CastsView, LocastView, LocastDispatcher, Moment, config, mapVisualizationTemplate) {

  
    var MapView = LocastView.extend({
       
        _map: undefined,

        _geofeatures: undefined,

        _castView: undefined,

        _collectionId: undefined,

        _castId: undefined,

        template: _.template(mapVisualizationTemplate),
   
        // view fragment config    

        viewFragmentBase: '!/map/',
        
        viewFragments: {
            collection: '_collectionId',
            cast: '_castId' 
        },

        // base state
        // all states inherit this state by default
        baseState: {
            
            // instantiation

            initialize: function (view) {
                this.view = view;
            },

            // setup and teardown

            enter: function () {
                // listen for map event
                this.view._map.on('featureClick', this.featureClicked, this );
                // TODO -- all of these don't have to be global events, probably
                // listen for global select event
                LocastDispatcher.on('geofeature:selected', this.geofeatureSelect, this);
                // listen for new geo json
                LocastDispatcher.on('geofeature:json', this.mapJsonRender, this)
            },

            exit: function () {
                // unbind listeners
                this.view._map.off('featureClick', this.featureClicked);
                LocastDispatcher.off('geofeature:selected', this.geofeatureSelect);
                LocastDispatcher.off('geofeature:json', this.mapJsonRender);

            },

            // interface

            showAll: function () {
                this.view._castId = undefined;
                this.view._collectionId = undefined;
                this.view.setViewState(this.view.states.fullMap);
                this.view.updateViewFragment();

                this.mapQuery('');
            },

            showCast: function (id) {
                this.view._castId = id;
                this.view._collectionId = undefined;
                this.view.setViewState(this.view.states.openCast);
                this.view.updateViewFragment();

                this.castRender(id); 
                this.mapQuery('');
            },

            showCollection: function (id) {
                this.view._castId = undefined;
                this.view._collectionId = id;
                this.view.setViewState(this.view.states.collectionMap)
                this.view.updateViewFragment();

                this.mapQuery('collection=' + id);
            },

            showCastinCollection: function (castid, collectionid) {
                this.view._castId = castid;
                this.view._collectionId = collectionid;
                this.view.setViewState(this.view.states.castInCollectionMap);
                this.view.updateViewFragment();

                this.mapQuery('collection=' + collectionid);
                this.castRender(castid); 
            },

            // helpers

            castRender: function (id) {
                // we want to reuse one instance of the CastsView since it will cache loaded casts
                this.view._castView =  this.view._castView || new CastsView({el:this.view.$cast});

                // request the collection to only show one cast
                this.view._castView.singleCast(id);
            },

            // TODO - move query checking to the geofeatures collection
            mapQuery: function (query) {
                // only load new queries to the map
                if ( query === this.view._lastQuery) {
                    return;
                }
                else {
                    this.view._geofeatures.setQuery(query);
                    this.view._lastQuery = query;
                    this.view._geofeatures.fetch(); 
                    this.view.setViewState(this.view.states.mapLoading);
                }
            },

            mapJsonRender: function (geojson) {
                if (this.view.state === this.view.states.mapLoading){
                    this.view.setViewState(this.view.previousState);
                }

                this.view._map.renderCasts(geojson.casts);
            },
            
            featureClicked: function (geofeature) {
                // select the geofeature model instead of loading the associated cast directly
                // i.e. this.view.showCast(feature.id);
                // this triggers an application-level event from the GeofeaturesCollection
                // so that other parts of the application can respond to the geofeature click
                
                // get model from the geofeature collection
                var geofeatureModel = this.view._geofeatures.get(geofeature.id);
                // tell the model it has been selected
                geofeatureModel.select();
            },

            geofeatureSelect: function (geofeature) {
                this.view.showCast(geofeature.id)
            },

            showCastPane: function () {
                this.view.$cast.fadeIn();
            },

            hideCastPane: function () {
                this.view.$cast.fadeOut();
            }

        },
    
        //  view states extend baseState

        mapStates: {
            
            fullMap: {
                activate: function () { 
                    this.hideCastPane();
                }         
            },

            openCast: {
                activate: function () {
                    this.showCastPane();
                }          
            },

            collectionMap: {
                activate: function () {
                    this.hideCastPane();
                },
                
                showCast: function (id) {
                    this.showCastinCollection(id, this.view._collectionId)
                },
            }, 

            castInCollectionMap: {
                activate: function () {
                    this.showCastPane();               
                 },

                showCast: function (id) {
                    this.showCastinCollection(id, this.view._collectionId)
                },
            }, 

            mapLoading: {
                activate: function () {
                }, 
                deactivate: function () {
                },
            },

        },    

        // instantiation

        initialize: function () {
            // unique ID
            var mapID = "#map-viz-map-" + Moment().unix();
            this.$el.html(this.template({mapID: mapID}));
            // save quick reference to jquery object selecting cast container
            this.$cast = this.$el.find('.cast-container');
            
            this._map = new LocastMap(mapID);
            this._geofeatures = this._geofeatures || new GeofeaturesCollection(); 
            
            // instantiate view states
            this.addViewStates(this.mapStates).makeViewSwitchable().setViewState(this.states.fullMap);

            this.$el.fadeIn();
            this._map.redrawBase();
        },

        // view interface

        showAll: function () {
            this.state.showAll();
            return this;
        },

        showCast: function (id) {
            this.state.showCast(id);
            return this;
        },

        showCollection: function (id) {
            this.state.showCollection(id);
            return this;            
        },

        showCastinCollection: function (castid, collectionid) {
            this.state.showCastinCollection(castid, collectionid);
            return this;            
        },    
   
    });

    return MapView;

});
