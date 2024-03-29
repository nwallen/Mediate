// LocastClass.js
// class object to provide backbone-like class-inheritance behavior
// based on: github.com/jimmydo/js-toolbox/blob/master/toolbox.js


define([
        
        'backbone',
        'underscore'
        
        ], function (Backbone, _) {


    // `ctor` and `inherits` are from Backbone (with some modifications):
    // http://documentcloud.github.com/backbone/

    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function () {};

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var inherits = function (parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call `super()`.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Self-propagating extend function.
    // Create a new class that inherits from the class found in the `this` context object.
    // This function is meant to be called in the context of a constructor function.
    function extend(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        child.extend = this.extend;
        return child;
    }

    // A primitive base class for creating subclasses.
    // All subclasses will have the `extend` function.
    // Example:
    //     var MyClass = Class.extend({
    //         someProp: 'My property value',
    //         someMethod: function () { ... }
    //     });
    //     var instance = new MyClass();



    // fire initialize when Class is invoked
    var LocastClass = function (options) {
        this.initialize.apply(this, arguments);
    };

    // add extend and include methods to base class
    LocastClass.extend = extend;
    LocastClass.include = function (props) {
        _.extend(this.prototype, props);
    }
    
    // add empty initialize
    LocastClass.include({
        initialize:function () {}
    });
    
    // mixin backbone events
    LocastClass.include(Backbone.Events);
   

    /*_.extend(Class.prototype, {
        initialize:function(){}, 
    });*/


    return LocastClass;
    
});

