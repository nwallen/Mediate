// CastAddView.js
// base view cast tags

define([
        
'backbone',
'underscore',
'core/LocastView',
'config',
'core/LocastMap',
'core/LocastDispatcher',

'text!core/cast/templates/castAddFormTemplate.html',

], 

function(Backbone, _, LocastView, config, LocastMap, LocastDispatcher, castAddFormTemplate) {


    var CastAddView = LocastView.extend({
   
        tagName: 'div',

        className: 'cast-add',
        
        template: _.template(castAddFormTemplate),
  
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                // listener for modal ok                
                this.view.on('ok', this.createCast ,this);
                this.view.on('shown', this.onShown ,this);
            },

            exit: function () {
                this.view.off('ok', this.createCast );
                this.view.off('shown', this.onShown );
            },

            // interface

            render: function () {
                // render description template
                this.view.$el.html(this.view.template({lexicon: config.lexicon})); 
            },

            // handlers

            onShown: function () {
                this.view._map = new LocastMap('new-cast-location-map');
                this.view._map.addCastPointActivate();
            },
            
            createCast: function (modal) {
                var data = this.view.formToObject(this.view.$el.find('form'));
                var ll =  this.view._map.getCastPoint();

                // do some dumb validation
                var canCreate = true;
                if (data.title === '' || data.title === undefined){
                    this.view.$el.find('.alert.title').removeClass('hide');
                    canCreate = false
                }
                else {
                    this.view.$el.find('.alert.title').addClass('hide');
                }

                if (ll === undefined){
                    this.view.$el.find('.alert.location').removeClass('hide');
                    canCreate = false
                }
                else {
                    data.location = [ll.lng, ll.lat];                    
                    this.view.$el.find('.alert.location').addClass('hide');
                }

                if (canCreate) {
                    // unbind listener to avoid multiple submits
                    this.view.off('ok', this.createCast);
                    // create the cast
                    this.view.collection.create(data, {
                        url: this.view.collection.url(),
                        wait: true,
                        success: function (model, response, options) {
                            LocastDispatcher.trigger('cast:create', model);
                            modal.close();
                        }
                    });
                }
            },
        },

        // cast states inherit baseState

        castAddStates: {
            open: {},
        },

        // setup

        initialize: function () { 


            // instantiate view states
            this.addViewStates(this.castAddStates).setViewState(this.states.open);
        }, 


        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastAddView;

});
