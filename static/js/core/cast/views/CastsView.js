// CastsView.js
// base view for showing casts 

define([
        
'backbone',
'underscore',
'config',
'core/LocastDispatcher',
'core/LocastView',
'models/CastModel',
'models/CastsCollection',
'core/cast/views/SingleCastView',
'core/cast/views/CastAddView',
'core/LocastAuth',
'backboneModal',

'text!core/cast/templates/castsTemplate.html',
'text!core/cast/templates/castTemplate.html',
'text!core/cast/templates/castPreviewTemplate.html',

], 

function(Backbone, _, config, LocastDispatcher, LocastView, CastModel, CastsCollection, SingleCastView, CastAddView, LocastAuth, backboneModal, castsTemplate, castTemplate, castPreviewTemplate) {
 
    
    var CastsView = LocastView.extend({
   
        template: _.template(castsTemplate),

        singleCastTemplate: _.template(castTemplate),

        singleCastPreviewTemplate: _.template(castPreviewTemplate),
        
        _casts: undefined,
 
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                // collection listeners
                this.view.bindCollectionEvents(this.view._casts, this);
                this.view._casts.on('idfetched', this.onCollectionAdd, this);
                this.view._casts.on('nextcastpage', this.onNextCastPage, this);
                this.view._casts.on('pagesloaded', this.onPagesLoaded, this);
            },

            exit: function () {
                // unbind listeners
                this.view.unbindCollectionEvents(this.view._casts, this);
                this.view._casts.off('idfetched', this.onCollectionAdd);
                this.view._casts.off('nextcastpage', this.onNextCastPage);
                this.view._casts.off('pagesloaded', this.onPagesLoaded);
            },

            // interface

            castList: function () {
                this.view.resetView();
                this.view.setViewState(this.view.states.list);

                this.view._casts.fetchPage({});
            },

            singleCast: function (castid) {
                this.view.resetView();
                this.view.setViewState(this.view.states.single);
               
                this.view._casts.fetchID(castid);
            },

            castPreview: function (options) {
                this.view.resetView();
                this.view.setViewState(this.view.states.preview);

                this.view._casts.fetchPage({
                    infiniteScroll: false,
                    pagesize: options.numCasts,
                    collection: options.collection,
                    user: options.user,
                    tags: options.tags,
                });
            },

            addCast: function () {
                // pass current collection of casts to cast add modal
                this.view._addCastModal = new Backbone.BootstrapModal({
                     content: new CastAddView({collection:this.view._casts}),
                     okText: gettext('Start ' + config.lexicon.cast ),
                     okCloses: false,
                     animate: true,
                });
 
                this.view._auth = new LocastAuth();
                var _this = this;
                this.view._auth.requireAuth({
                    onAuth: function () { 
                        _this.view._addCastModal.open();
                    },
                });          
            },

            // paging / infinite scroll handlers 

            onPagesLoaded: function () {
                this.view.setViewState(this.view.states.list);
            },

            onNextCastPage: function (nextPageOptions) {
                this.view.setViewState(this.view.states.list);
                this.enableInfiniteScroll(nextPageOptions);
            },

            // collection event handlers (rendering)

            onCollectionReset: function (castCollection, response) {
                this.view.renderCollectionViews(this.view.castsRenderOptions); 
            },

            onCollectionAdd: function (castModel) {
                this.view.renderCollectionViews(this.view.castsRenderOptions, castModel); 
            },

            // helpers
            
            enableInfiniteScroll: function (pageOptions) {
                var _this = this;
                var _pageOptions = pageOptions || {};

                // throttle to ensure that scroll events don't outpace our logic
                this.view.$scroll.scroll( _.throttle(function () {
                    var scrollTop = _this.view.$scroll.scrollTop();
                    var contentHeight = _this.view.$scroll[0].scrollHeight - _this.view.$scroll.height() - 10;
                    if ( scrollTop >= contentHeight) {
                        // disable to avoid multiple fetches
                        _this.disableInfiniteScroll();
                        // fetch page from cast collection
                        _this.view._casts.fetchPage(_pageOptions); 
                        _this.view.setViewState(_this.view.states.listLoading);
                    }
                }, 300));
            },

            disableInfiniteScroll: function () {
                this.view.$el.unbind('scroll');
            }, 
        },

        // cast states inherit baseState

        castStates: {
            
            single: {
                activate: function () {
                    this.disableInfiniteScroll();
                    this.view.castsRenderOptions.template = this.view._customCastTemplate || this.view.singleCastTemplate; 
                },
                
                deactivate: function () {
                },
            },

            preview: {
                activate: function () {
                     this.view.castsRenderOptions.template = this.view._customCastTemplate || this.view.singleCastPreviewTemplate; 
                },
                deactivate: function () {
                },
            },

            listLoading: {
                activate: function () {
                    // todo: put this in a template
                    this.view.$el.find('.casts').append('<h1 class="loader" >LOAD BABY LOAD!</h1>')
                },
                
                deactivate: function () {
                    this.view.$el.find('.loader').remove();
                },
            },

            list: {
                activate: function () {
                    this.view.castsRenderOptions.template = this.view._customCastTemplate || this.view.singleCastTemplate; 
                },
 
                deactivate: function () {
                },
            }, 
        },

        // setup

        initialize: function () {
            // instantiate casts collection 
            this._casts = new CastsCollection;

            this._customCastTemplate = this.options.castTemplate || undefined;

            // options for rendering casts from _casts collection
            this.castsRenderOptions = { 
                collection: this._casts,
                selector: '.cast-list',
                viewToCreate: SingleCastView,
                template: this._customCastTemplate,
            }

            // infinite scroll container if set in options
            this.$scroll = this.options.$scroll || this.$el;
            
            // instantiate view states
            this.addViewStates(this.castStates).setViewState(this.states.preview);
            this.makeViewSwitchable(); 
            this.resetView();
        }, 

        // public interface

        castList: function () {
            this.state.castList();
        },

        singleCast: function (castid) {
            this.state.singleCast(castid);
        },

        castPreview: function (options) {
            this.state.castPreview(options);
        },

        addCast: function () {
            this.state.addCast();
        },
 
    });

    return CastsView;

});
