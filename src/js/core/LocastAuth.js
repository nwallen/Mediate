// LocastAuth.js
// checks authentication and provides register and login options
//


define([
    
'core/LocastClass',
'core/auth/views/LocastLoginView',
'globals', 

'backboneModal',

], 

function (LocastClass, LocastLoginView, globals) {
    
    var LocastAuth = LocastClass.extend({
   
        requireAuth: function (options) {
            options.onAuth = options.onAuth || function () {};

            if (globals.auth.loggedIn) {
                options.onAuth();
            }
            else {
                var loginView = new LocastLoginView(options);
                var loginModal = new Backbone.BootstrapModal({
                     content: new LocastLoginView(options),
                     okText: gettext('Login'),
                     okCloses: false,
                     animate: true,
                }).open(); 
            }
        },
    
    });

    return LocastAuth;


});
