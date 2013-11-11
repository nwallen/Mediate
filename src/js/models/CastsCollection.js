// CastsCollection.js

define([

'backbone',
'underscore',
'models/CastModel',
'core/LocastDispatcher',
'config',
'core/LocastCollection',

], 

function (Backbone, _, CastModel, LocastDispatcher, config, LocastCollection) {

    var CastsCollection = LocastCollection.extend({
        
        model: CastModel, 

        url: function () {
            return config.api.cast;
        },

        fetchPage: function(pageOptions) {
            // defaults
            pageOptions.infiniteScroll =  pageOptions.infiniteScroll || true;
            pageOptions.page = pageOptions.page || 1;
            pageOptions.pagesize = pageOptions.pagesize || 10;
            
            // asking for page 1 resets the collection             
            var _addCasts = (pageOptions.page == 1) ? false : true ;

            var _this = this;

            var _xhr = this.fetch({
                 data: {
                    author: pageOptions.user || undefined,
                    tags: pageOptions.tags || undefined, // TODO make this able to accept and format an array of tags
                    collection: pageOptions.collection || undefined,
                    page: pageOptions.page,
                    orderby: pageOptions.orderby || 'created',
                    pagesize: pageOptions.pagesize,      
                },
                success: function () {
                    var totalCasts = parseInt(_xhr.getResponseHeader('X-Object-Total'));
                    var morePages = (pageOptions.page * pageOptions.pagesize >= totalCasts) ? false : true;
                    
                    // dispatch event with query for next page, if there is a next page...
                    if (morePages && pageOptions.infiniteScroll) {
                        var nextPageOptions = pageOptions;
                        nextPageOptions.page = nextPageOptions.page + 1;
                        _this.trigger('nextcastpage', nextPageOptions);
                    }
                    else {
                        _this.trigger('pagesloaded', pageOptions);
                    }         
                }, 
                // fires a 'reset' event if false or an 'add' event if true   
                add:_addCasts
            });

        },  
 
    });

    return CastsCollection;

});
