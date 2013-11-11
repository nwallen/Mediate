// CastLocationView.js
// cast title

define([
        
'backbone',
'underscore',
'core/LocastView',
'moment',
'config',
'core/LocastMap',
'moment',

'text!core/cast/templates/castLocationTemplate.html',

// backbone plugin
'backboneModal',

], 

function(Backbone, _, LocastView, moment, config, LocastMap, Moment, castLocationTemplate) {


    var CastLocationView = LocastView.extend({
   
        tagName: 'div',

        className: 'title',

        events: {
            'click .edit-location': 'editLocation',
            'submit': 'updateLocation',
        },

        template: _.template(castLocationTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.model.on('change:location', this.onModelChange, this);
            },

            exit: function () {
                this.view.model.off('change:location', this.onModelChange);
            },

            // interface

            render: function () {
                this.view._mapID = 'map-cast-' + this.view.model.get('id') + '-' + _.random(0, Moment().unix());
                // render location template
                this.view.$el.html(this.view.template({
                    cast: this.view.model.toJSON(),
                    mapID: this.view._mapID,
                }));

                // may optionally not init map by default
                if (!this.view.options.hideMap) {
                    this.showMap(true);
                    var init = function (context) { 
                        context.initMap();
                    };
                    _.delay( init, 100, this);
                }
            },

            initMap: function () {
                this.showMap(true);
                this.view._map = new LocastMap(this.view._mapID);
                this.view._map.setCastMarker(this.view.model.get('location'));
            },

            showMap: function (shouldShow) {
                var showFunc = (shouldShow) ? 'removeClass' : 'addClass';
                this.view.$el.find('#' + this.view._mapID)[showFunc]('hide');
            },

            onModelChange: function (updatedModel) {
                if (this.view._map) {
                    this.view._map.setCastMarker(this.view.model.get('location'));
                }
            },

            editLocation: function () {
                this.view.setViewState(this.view.states.editing);
            },

            updateLocation: function (e) {
                e.preventDefault();
                var ll =  this.view._map.getCastPoint();
        
                var _this = this;
                this.view.model.set('location', [ll.lng, ll.lat]);
                this.view.model.save(null, {
                    success: function () { 
                        _this.view.setViewState(_this.view.states.open);
                    },
                });
                 
            },

        },

        // cast states inherit baseState

        castLocationStates: {
            open: {},
            editing: {
                 activate: function () {
                   
                    if (!this.view._map) {
                        this.initMap();
                    }
                    if (this.view.options.hideMap) {
                        this.showMap(true);
                    }  

                    this.view._map.addCastPointActivate();

                    this.view.$editForm = this.view.$el.find('#location-form-cast-' + this.view.model.get('id'));
                    this.view.$editForm.removeClass('hide');
                    var _this = this;
                    this.view.$editForm.find('.cancel').on('click', function () {
                        _this.view.$editForm.find('.cancel').off('click');
                        if (_this.view.options.hideMap) {
                            _this.showMap(false);
                        } 
                        _this.view.setViewState(_this.view.states.open);
                    });
                        
                    // code for editing location on a map in a modal
                    //
                    // unresolved bug in leaflet ties marker added on click 
                    // to scroll position of the page eventhough the map is
                    // in a fixed position modal      
                    /*  
                    this.view.$editModal = this.view.$el.find('#location-form-cast-' + this.view.model.get('id'));
                    
                    this.view._editMap = new LocastMap('location-edit-map-cast-' + this.view.model.get('id'));
                    this.view._editMap.addCastMarker(this.view.model.get('location'));

                    var _this = this;
                   this.view.$editModal.on('shown', function () {
                        _this.view._editMap.redrawBase();
                        _this.view._editMap.addCastPointActivate();
                    });
                    this.view.$editModal.on('hide', function () {
                        _this.view.setViewState(_this.view.states.open);
                    });
                    this.view.$editModal.find('.cancel').on('click', function () {
                        _this.view.$editModal.find('.cancel').off('click');
                        _this.view.$editModal.modal('hide');                       
                        _this.view.setViewState(_this.view.states.open);
                    });
                    this.view.$editModal.find('.submit').on('click', function () {
                        _this.view.$editModal.find('.submit').off('click');
                        _this.view.$editModal.modal('hide');
                        _this.updateLocation();                       
                    });
                    this.view.$editModal.modal();*/
                },
                editLocation: function () {
                    //this.view.setViewState(this.view.states.open);
                },
                deactivate: function () { 
                    this.view._map.destroyCastPoint();
                    this.view.$editForm.addClass('hide');               
                },
            }, 
        },

        // setup

        initialize: function () { 
           
            // instantiate view states
            this.addViewStates(this.castLocationStates).setViewState(this.states.open);
        }, 

        // handlers

        editLocation: function () {
            this.state.editLocation();
        },

        updateLocation: function (e) {
            this.state.updateLocation(e);
        },

        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastLocationView;

});
