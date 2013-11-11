// SingleCollectionView.js
//


define([

'core/LocastView',
'core/cast/views/CastsView',

'text!core/collection/templates/singleCollectionTemplate.html',

], 

function (LocastView, CastsView, singleCollectionTemplate, collectionCastPreviewTemplate) {

    var SingleCollectionView = LocastView.extend({
    
        template: _.template(singleCollectionTemplate),

        tagName: 'li',

        // set the el class based on model 
        attributes: function () {
            return{
                class: 'collection collection-' + this.model.get('id')
            }
        },
        
        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
            },

            exit: function () {
            },
        },

        collectionStates: {
            
            preview: {
                render: function () {
                    this.view.resetView(null, {collection: this.view.model.toJSON()});

                    var castView = new CastsView({
                        el:this.view.$el.find('.collection-casts'),
                    });

                    castView.castPreview({
                        numCasts: 10,
                        collection: this.view.model.get('id'),
                    });        
                },
            
            },
            
            list: {
                render: function () {
                    this.view.resetView(null, {collection: this.view.model.toJSON()});

                    var castView = new CastsView({
                        el:this.view.$el.find('.collection-casts'),
                        $scroll:this.view.options.$parent, // the scrolling element
                    });

                    castView.castList();       
                }, 
            },

        },

        initialize: function () {
            this.addViewStates(this.collectionStates).setViewState(this.states.preview);
            if (this.options.state) {
                this.setViewState(this.states[this.options.state]);
            } 
        },

        render: function () {
            this.state.render();
            return this;
        },

    });

    return SingleCollectionView;

});
