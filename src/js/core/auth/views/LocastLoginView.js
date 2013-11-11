// LocastLoginView.js
// checks authentication and provides register and login options
//


define([

'core/LocastView',
'config',
'core/LocastDispatcher',

'text!core/auth/templates/locastLoginTemplate.html',

], 

function (LocastView, config, LocastDispatcher, locastLoginTemplate) {
   

    var LocastLoginView = LocastView.extend({
  
        template: _.template(locastLoginTemplate),
        
        baseState: {

            initialize: function (view) {
                this.view = view;
            },

            enter: function () {
                // listener for backbone bootstrap modal click                
                this.view.on('ok', this.submitLogin, this);
            },

            exit: function () {
                this.view.off('ok', this.submitLogin);
            },

            render: function () {
                //console.log(this.view.options.onAuth);
                this.view.$el.html(this.view.template());
            },

            submitLogin: function (modal) {
                var data = this.view.formToObject(this.view.$el.find('form'));

                // do some dumb validation
                var canLogin = true;
                if (data.username === '' || data.username === undefined){
                    this.view.$el.find('.alert.username').removeClass('hide');
                    canLogin = false
                }
                else {
                    this.view.$el.find('.alert.username').addClass('hide');
                }

                if (data.password === '' || data.password === undefined) {
                    this.view.$el.find('.alert.password').removeClass('hide');
                    canLogin = false
                }
                else {
                    this.view.$el.find('.alert.password').addClass('hide');
                }

                if (canLogin) {
                    var _this = this;
                    $.ajax({
                        url: config.url.login,
                        data: data,
                        type: 'POST',

                        // TODO this needs some modifications on the server side to work properly  
                        success: function (response) {
                            // get info about authenticated user from api
                            // (this is bad) if user is not authenticated
                            // server returns 401 which triggers browser login window
                            $.ajax({
                                url:config.api.me,
                                error: function () {
                                    _this.view.$el.find('.alert.login').removeClass('hide'); 
                                },
                                success: function (userJSON) {
                                    LocastDispatcher.trigger('user:login', userJSON);
                                    modal.close();
                                    // fire callback to continue app activity
                                    _this.view.options.onAuth();
                                },
                            });
                        },     
                    })

                }
            },

        },

        locastLoginStates: {
            base: {},
        },

        initialize: function () {
            this.addViewStates(this.locastLoginStates).setViewState(this.states.base);
            this.state.render();          
        }, 
    
    });

    return LocastLoginView;


});
