// UserUserView.js
// User Info

define([
   
'backbone',
'underscore',
'config',
'core/LocastView',
'core/cast/views/CastsView',

'text!core/user/templates/singleUserTemplate.html',
// bootstrap js plugins
'bootstrap',

], 

function(Backbone, _, config, LocastView, CastsView, singleUserTemplate) { 

    var SingleUserView = LocastView.extend({

        template: _.template(singleUserTemplate),

        tagName: 'li',

        // set the el class based on model 
        attributes: function () {
            return{
                class: 'user user-' + this.model.get('id')
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

        singleUserStates: {

            preview: {
                render: function () {
                    this.view.resetView(null, {user:this.view.model.toJSON()});

                    var castView = new CastsView({
                        el:this.view.$el.find('.user-casts'),
                    });

                    castView.castPreview({
                        numCasts: 10,
                        user: this.view.model.get('id'),
                    });
                },     
            },

            list: {
                render: function () {
                    this.view.resetView(null, {user:this.view.model.toJSON()});
                   
                    var castView = new CastsView({
                        el:this.view.$el.find('.user-casts'),
                        $scroll:this.view.options.$parent, // the scrolling element
                    });

                    castView.castList();
                },     
            },

        },
 
        initialize: function () { 
            this.addViewStates(this.singleUserStates).setViewState(this.states.preview);
            if (this.options.state) {
                this.setViewState(this.states[this.options.state]);
            }
        },

        // public interface
        
        render: function () {
            this.state.render();
            return this;        
        },

       
    });

    return SingleUserView;
});
