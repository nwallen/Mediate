// CastRouter.js
// control routes in the cast visualization

define([
        
'backbone', 
'backboneSubroute',
'config',
'core/cast/views/CastsView'

], 
        
function(Backbone, SubRoute, config, CastsView){
    
    var CastRouter = Backbone.SubRoute.extend({
        
            routes: {
                '': 'base',
                'add/': 'addCast',
                ':id':     'cast',
            },

            base: function () {
                this._castView.castList(); 
            },

            cast: function (id) {
                this._castView.singleCast(id); 
            },

            addCast: function () {
                this._castView.addCast();                      
            },
            
            initialize: function () {
                this._castView = this._castView || new CastsView({
                    el: '#' + this.vizConfig.id,
                    viewConfig: this.vizConfig
                });
            }

    });

    return CastRouter;

});
