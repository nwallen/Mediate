// LocastState.js
// base state for application states

define(['core/LocastClass'], function (LocastClass) {

    var LocastState =  LocastClass.extend({
          
        // called when the state is instantiated 
        initialize: function (owner) {
            this.owner = owner;
        },   

        // called after enter
        activate: function () {},    

        // called before exit
        deactivate: function () {},            

        // sets up the state when it is activated
        enter: function () {},    
        
        // cleans up the state when it is deactivated
        exit: function () {} 

    });

    return LocastState;

});
