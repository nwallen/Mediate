// SingleCastCommentView.js
// view for a cast comment

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CastCommentModel',
'markdown',

'text!core/cast/templates/castSingleCommentTemplate.html',

// jquery plugins
'jqueryOembed',

], 

function(Backbone, _, LocastView, CastCommentModel, Markdown, castSingleCommentTemplate) {


    var SingleCastCommentView = LocastView.extend({
 
        tagName: 'li',
        
        // set the el class based on model 
        attributes: function () {
            return{
                class: 'comment ' + this.model.get('id')
            }
        },
         
        template: _.template(castSingleCommentTemplate),

        events: {
            'click .open': 'commentExpand', 
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
                this.view.markdownConverter = new Markdown.getSanitizingConverter();
                var content = this.view.model.get('content');
                if (content) {
                    var contentHtml = this.view.markdownConverter.makeHtml(content);
                }
                else {
                    var contentHtml = '';
                }

                this.view.$el.html(this.view.template({ comment:{ 
                    html: contentHtml,
                    data: this.view.model.toJSON(), 
                }}));

                // TODO : we can do this and it's cool, but it kills the page
                // perhaps oembed-able links can have an icon appended which
                // will render the embed when clicked? (need a way to test if a link
                // matches a provider)
                // this.view.$el.find('.comment-content a').oembed();
            },

            commentExpand: function (commentModel) {
                this.view.setViewState(this.view.states.expanded);
            }

        },

        // cast states inherit baseState

        singleCastCommentStates: {
            
            preview: {},

            expanded: {
                activate: function () {
                    //this.view.$el.find('.comment-content a').oembed();
                },
                commentExpand: function () {
                    this.view.setViewState(this.view.states.preview);
                },
                deactivate: function () {
                    this.view.render();
                }
            }
        },

        // setup

        initialize: function () {
            // instantiate view states
            this.addViewStates(this.singleCastCommentStates).setViewState(this.states.preview); 
        }, 

        commentExpand: function (commentModel) {
            this.state.commentExpand(commentModel);
        },

        // public interface

        render: function () {
            this.state.render();
            return this;
        }
        
    });

    return SingleCastCommentView;

});
