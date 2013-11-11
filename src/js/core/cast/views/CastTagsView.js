// CastTagsView.js
// base view cast tags

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CastTagsCollection',
'core/cast/views/SingleCastTagView',

'text!core/cast/templates/castTagsTemplate.html'

], 

function(Backbone, _, LocastView, CastTagsCollection, SingleCastTagView, castTagsTemplate) {


    var CastTagsView = LocastView.extend({
   
        template: _.template(castTagsTemplate),

        events: {
            'submit': 'updateTags',
        },

        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.bindCollectionEvents(this.view.model.tags, this);
                this.view.model.on('change:tags', this.onModelChange, this);
            },

            exit: function () {
                this.view.unbindCollectionEvents(this.view.model.tags, this);
                this.view.model.off('change:tags', this.onModelChange);
            },

            // interface

            render: function () {
                // because tags don't have an api the collection needs 
                // to be populated from a cast model
                var populated = (this.view.model.tags.length === 0) ? false : true;
                this.view.model.tags.syncTagsFromModel(this.view.model);
                 
                // base html
                this.renderTemplate();
                // subviews
                this.view.renderCollectionViews(this.view.tagRenderOptions);
            },
            
            renderTemplate: function () {
                this.view.$el.html(this.view.template({tags:{
                    cast: this.view.model.toJSON(),            
                }}));
            }, 

            onCollectionDestroy: function (tagModel) {
                var tagToRemove = tagModel.get('tag');
                var tags = this.view.model.get('tags');
                var data = {tags: _.without(tags, tagToRemove) };

                this.view.model.set(data);
                this.view.model.save();
            },
            
            onCollectionReset: function (collection, response) {
                // the tags collection is never populated with a fetch 
                // so this is not called 
            },

            onCollectionChange: function (commentModel) {
                // tag subviews handle change events
            },

            onCollectionAdd: function (commentModel) {
                this.view.renderCollectionViews(this.view.tagRenderOptions, commentModel);
            },

            updateTags: function (e) {
                e.preventDefault();
                
                var formId = '#tag-form-cast-' + this.view.model.get('id');
                var data = this.view.formToObject(this.view.$el.find(formId));  
                // make array of new and existing tags
                var tags = this.view.model.get('tags');
                data = {tags: _.compact(_.union(tags, data.tags.split(',')))};

                this.view.model.set(data);
                this.view.model.save();
            },

            onModelChange: function () {
                this.render();
            },
        },

        // cast states inherit baseState

        castTagsStates: {
            open: {}, 
        },

        // setup

        initialize: function () {
            // adds CastTagsCollection 'tags' to this view's model
            this.addCollectiontoViewModel({ 
                collectionType: CastTagsCollection, 
                name: 'tags', 
                urlFunction: function (model) {
                    return model.url(); // cast model url
                }
            });

            this.tagRenderOptions = { 
                collection: this.model.tags,
                selector: '.tag-list',
                viewToCreate: SingleCastTagView
            }

            // instantiate view states
            this.addViewStates(this.castTagsStates).setViewState(this.states.open);
        }, 

        updateTags: function (e) {
            this.state.updateTags(e);
        },

        // public interface

        render: function () {
            this.state.render();
            return this;
        },
        
    });

    return CastTagsView;

});
