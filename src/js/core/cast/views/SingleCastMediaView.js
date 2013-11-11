// SingleCastMediaView.js
// view for a cast media

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CastMediaModel',

'text!core/cast/templates/castSingleMediaTemplate.html',

// backbone plugin
'backboneModal',
// jquery plugins
'flowplayer',
'jqueryOembed',

], 

function(Backbone, _, LocastView, CastMedia, castSingleMediaTemplate) {


    var SingleCastMediaView = LocastView.extend({
 
        tagName: 'li',

        // set the el class based on model 
        attributes: function () {
            return{
                class: 'media ' + this.model.get('id') + ' ' + this.model.get('content_type')
            }
        },

        template: _.template(castSingleMediaTemplate),

        events: {
            'click .delete': 'mediaDelete', 
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
                this.view.$el.html(this.view.template({ 
                    data: this.view.model.toJSON(),
                }));
                // create flowplayer for locast video
                this.view.$el.find('.web_stream').flowplayer();
                // process oembed links for linked media
                this.view.$el.find('.oembed_media').oembed();
            },

            mediaSelect: function () {
                console.log('media select');
                new Backbone.BootstrapModal({
                    content:this.view,
                    animate: true,
                }).open();
                // select model to trigger application event
                //this.view.model.select();
            },

            mediaDelete: function () {

                var _this = this;
                var $modal = this.view.$el.find('#delete-modal-media-' + this.view.model.get('id'));
               
                $modal.on('show', function () {
                    var html =  _this.view.$el.find('.media-info').clone();
                    $modal.find('.modal-body').html(html);
                }) 
                
                $modal.modal();
                
                $modal.find('.delete-confirm').on('click', function () {
                    // destroy the model and remove the view
                    _this.view.model.destroy({
                        success: function (model, response) {
                             $modal.modal('hide');
                            _this.view.remove();
                        }    
                    });

                });
                $modal.find('.cancel').on('click', function () {
                    $modal.modal('hide');
                });
                $modal.on('hidden', function () {
                    $modal.off('show');
                    $modal.find('.delete-confirm').off('click');
                    $modal.find('.cancel').off('click');
                }); 
            }

        },

        // cast states inherit baseState

        singleCastMediaStates: {
            preview: {},
            expanded: {}, 
        },

        // setup

        initialize: function () {
            // instantiate view states
            this.addViewStates(this.singleCastMediaStates).setViewState(this.states.preview); 
        }, 

        mediaSelect: function () {
            this.state.mediaSelect();
        },

        mediaDelete: function () {
            this.state.mediaDelete();
        },

        // public interface

        render: function () {
            this.state.render();
            return this;
        }
        
    });

    return SingleCastMediaView;

});
