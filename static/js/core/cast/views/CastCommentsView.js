// CastCommentsView.js
// base view cast comments 

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CastCommentsCollection',
'core/cast/views/SingleCastCommentView',
'markdown',

'text!core/cast/templates/castCommentsTemplate.html'

], 

function(Backbone, _, LocastView, CastCommentsCollection, SingleCastCommentView, Markdown, castCommentsTemplate) {


    var CastCommentsView = LocastView.extend({

        template: _.template(castCommentsTemplate),

        events: {
            'submit': 'addComment',
            'focus textarea': 'onWrite',
            'focusout textarea': 'offWrite',
        },
        
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                // adds 'add', 'change' and 'reset' event listeners                  
                // corresponding to onAdd, onChange and onReset callbacks   
                this.view.bindCollectionEvents(this.view.model.comments, this);
            },

            exit: function () {
                this.view.unbindCollectionEvents(this.view.model.comments, this);
            },

            // interface

            render: function () {
                // if there aren't any models in the collection: do a fetch
                // otherwise, update        
                var update = (this.view.model.comments.length === 0) ? false : true;
                this.view.model.comments.fetch({update:update, removeMissing:true});

                // base html
                this.renderTemplate();
                // subviews
                this.view.renderCollectionViews(this.view.commentRenderOptions);
                
            },

            renderTemplate: function () {
                // setup markdown editor
                this.view.markdownConverter = new Markdown.getSanitizingConverter();
                var uniqueId = 'comment-' + this.view.model.get('id') + '-' + moment().unix(); 
                this.view.markdownEditor = new Markdown.Editor(this.view.markdownConverter, '-'+uniqueId); 
                // base template
                this.view.$el.html(this.view.template({comments:{
                    uniqueId: uniqueId,
                    cast: this.view.model.toJSON(),
                }}));   
            },

            onCollectionReset: function (collection, response) {
                this.view.renderCollectionViews(this.view.commentRenderOptions); 
            },

            onCollectionChange: function (commentModel) {
                // subView handles model update
            },

            onCollectionAdd: function (commentModel) {
                // add specific model subview
                this.view.renderCollectionViews(this.view.commentRenderOptions, commentModel); 
            },

            // handlers
            
            onWrite: function () {
                this.view.setViewState(this.view.states.writing);
            },

            offWrite: function () {
                this.view.setViewState(this.view.states.open);
            },

            addComment: function (e) {
                e.preventDefault();

                var formId = '#comment-form-cast-' + this.view.model.get('id');
                var data = this.view.formToObject(this.view.$el.find(formId));  
                _this = this;
                this.view.model.comments.create(data,{
                    url: this.view.model.comments.url,
                    wait:true,
                    success: function () {
                        _this.render();
                    }
                });
            }, 
        },

        // cast states inherit baseState

        castCommentsStates: {

            open: {}, 

            writing: {
                activate: function () {
                    this.view.markdownEditor.run();
                 },
            },

        },

        // setup

        initialize: function () {

            // adds CastCommentsCollection 'comments' to this view's model
            this.addCollectiontoViewModel({ 
                collectionType: CastCommentsCollection, 
                name: 'comments', 
                urlFunction: function (model) {
                    return model.get('comments'); // comments uri in cast model
                }
            });

            this.commentRenderOptions = { 
                collection: this.model.comments,
                selector: '.comment-list',
                viewToCreate: SingleCastCommentView
            }

            // instantiate view states
            this.addViewStates(this.castCommentsStates).setViewState(this.states.open);
        }, 

        addComment: function(e) {
            this.state.addComment(e); 
        },

        onWrite: function (e) {
           this.state.onWrite();  
        },

        offWrite: function (e) {
           this.state.offWrite();  
        },
        // public interface

        render: function() {
            this.state.render();
            return this;
        },
        
    });

    return CastCommentsView;

});
