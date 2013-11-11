// LocastCollection.js
// Extends Backbone collection to allow special fetch({update:true, removeMissing:true}) 
// syncs collection models with server without a 'reset'
// based on: https://github.com/dalyons/backbone/commit/0af0e23ba52eaccf2a30869c06ad9b3a54776e65

define([

'backbone', 
'underscore',

], 

function (Backbone, _) {

    var LocastCollection = Backbone.Collection.extend({

        // When you have an existing set of models in a collection, 
        // you can do in-place updates of these models, reusing existing instances.
        // - Items are matched against existing items in the collection by id
        // - New items are added
        // - matching models are updated using set(), triggers 'change'.
        // - existing models not present in the update are removed if 'removeMissing' is passed.
        // - a collection change event will be dispatched for each add() and remove()
        update : function(models, options) {
            models  || (models = []);
            options || (options = {});

            //keep track of the models we've updated, cause we're gunna delete the rest if 'removeMissing' is set.
            var updateMap = _.reduce(this.models, function(map, model){ map[model.id] = false; return map },{});

            _.each( models, function(model) {

                var idAttribute = this.model.prototype.idAttribute;
                var modelId = model[idAttribute];

                if ( modelId == undefined ) throw new Error("Can't update a model with no id attribute. Please use 'reset'.");
                    
                if ( this._byId[modelId] ) {
                    var attrs = (model instanceof Backbone.Model) ? _.clone(model.attributes) : _.clone(model);
                    delete attrs[idAttribute];
                    this._byId[modelId].set( attrs );
                    updateMap[modelId] = true;
                }
                else {
                    this.add( model );
                }
            }, this);

            if ( options.removeMissing ) {
                _.select(updateMap, function(updated, modelId){
                    if (!updated) this.remove( modelId );
                }, this);
            }

            return this;
        },

        // override Backbone fetch to add 'update' option
        fetch : function(options) {
            options || (options = {});
            var collection = this;
            var success = options.success;
            options.success = function(resp, status, xhr) {
                collection[options.update ? 'update' : options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
                if (success) success(collection, resp);
            };
            options.error = Backbone.wrapError(options.error, collection, options);
            return (this.sync || Backbone.sync).call(this, 'read', this, options);
        },

        fetchID: function (id) {
            var fetchIDcallback = function (model, context) {
                context.trigger('idfetched', model);
            };

            this.getModelorFetch(id, fetchIDcallback);  
        },

        // fetch model by id or get from server
        getModelorFetch: function (modelid, callback) {
            modelid = (typeof modelid !== 'number') ? parseInt(modelid) : modelid;
            var theModel = this.where({id:modelid});
            if (theModel.length === 0) {
                var newModel = new this.model({id:modelid});
                this.add(newModel, {silent: true});
                var _this = this; 
                newModel.fetch({
                    success: function (newModel) {
                        if (callback !== undefined) {
                            callback(newModel, _this);
                        } 
                    }
                });
            }
            else {
                callback(theModel[0], this);
            }   
        },
    
    });

    return LocastCollection;

});
