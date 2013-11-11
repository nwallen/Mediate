// CastMediaView.js
// base view cast media display 

define([
        
'backbone',
'underscore',
'core/LocastView',
'models/CastMediaCollection',
'core/cast/views/SingleCastMediaView',
'pluploadHtml5',
'config',

'text!core/cast/templates/castMediaTemplate.html',
'text!core/cast/templates/castMediaUploadFormTemplate.html',
'text!core/cast/templates/castLinkFormTemplate.html',

// backbone plugin
'backboneModal',

], 

function(Backbone, _, LocastView, CastMediaCollection, SingleCastMediaView, plupload, config, castMediaTemplate, castMediaUploadFormTemplate, castLinkFormTemplate) {

    // TODO it would be nice to have uploader code as a seperate module -- could be used in other parts
    // of the app too. e.g. profile picture selection

    var LocalDispatcher = _.clone(Backbone.Events);

    var UploadFormModel = Backbone.Model.extend({});

    var MediaUploadFormView = LocastView.extend({
        
        model: UploadFormModel,

        template: _.template(castMediaUploadFormTemplate),

        events: {
            'submit' : 'onSubmit',
            'click .remove-media' : 'removeMedia',
            'keyup input[name="title"]' : 'updateTitle',
        },

        render: function () {
            this.$el.html(this.template({form:this.model.toJSON()}));
            return this;
        },

        updateTitle: function () {
            var data =  this.formToObject(this.$el.find('form'));
            this.model.set('title', data.title);
        },

        removeMedia: function (){
            this.model.collection.remove(this.model);
        },

        onSubmit: function (e) {
            e.preventDefault();
        },

    });


    var MediaUploadFormCollection = Backbone.Collection.extend({
        model: UploadFormModel,
    });

    var LinkFormView = LocastView.extend({
        
        template: _.template(castLinkFormTemplate),

        events: {
            'submit' : 'onSubmit',
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.trigger('linksubmitted', this);
        },
    
    });

    var CastMediaView = LocastView.extend({

        template: _.template(castMediaTemplate),

        events: {
            'click .upload-form-list-submit' : 'mediaAdd',
            'click .link-media' : 'linkAdd',
        },
   
        // all states inherit baseState

        baseState: {
            
            initialize: function (view) {
                this.view = view;
            },
    
            // setup and teardown    

            enter: function () {
                this.view.bindCollectionEvents(this.view.model.media, this);
                this.view._mediaUploadForms.on('remove', this.removeMediaUploadForm, this);  
            },

            exit: function () {
                this.view.unbindCollectionEvents(this.view.model.media, this);            
                this.view._mediaUploadForms.off('remove', this.removeMediaUploadForm);  
            },

            // interface

            render: function () {
                // do an update fetch if there are items in the collection
                var update = (this.view.model.media.length === 0) ? false : true;
                this.view.model.media.fetch({update:update, removeMissing:true}); 

                // base html
                this.renderTemplate();
                // subviews
                this.view.renderCollectionViews(this.view.mediaRenderOptions);
            },

            renderTemplate: function () {
                this.view.$el.html(this.view.template({media:{
                    cast: this.view.model.toJSON(),
                }}));
               
                if (this.view.model.get('allowed_edit')) {
                    this.initUploaders();
                }
            },

            onCollectionReset: function (collection, castMediaObject) {
                this.view.renderCollectionViews(this.view.mediaRenderOptions);
            },
            
            onCollectionChange: function (castMediaModel) {
                // subView handles model update
            },

            onCollectionAdd: function (castMediaModel) {
                this.view.renderCollectionViews(this.view.mediaRenderOptions, castMediaModel);
            },

            onCollectionDestroy: function (castMediaModel) {
            },

            // link adding
            
            linkAdd: function () {
                this.view._linkForm = new LinkFormView();
                this.view.$el.find('.link-form-list').append(this.view._linkForm.render().el);
                this.view._linkForm.on('linksubmitted', this.linkSubmit, this);

                var _this = this;
                this.view.$linkModal =  this.view.$el.find('#linker-modal-cast-' + this.view.model.get('id'));

                this.view.$linkModal.modal();
                this.view.$linkModal.find('.cancel').on('click', function () {
                    _this.view.$linkModal.find('.cancel').off('click');
                    _this.view.$linkModal.modal('hide');
                });
                this.view.$linkModal.on('hidden', function () {
                    _this.view.$linkModal.off('hidden');
                    _this.render();
                }); 
            },

            linkSubmit: function () {
                this.view._linkForm.off('linksubmitted', this.linkSubmit);
                this.view.$linkModal.modal('hide');

                var formData = this.view.formToObject(this.view._linkForm.$el.find('form'));
                var _this = this;
                this.view.model.media.create(formData,{
                    url: this.view.model.media.url,
                    wait:true,
                    success: function (model, response, options) {
                        _this.render();                    
                    }
                });

            },

            // media uploading

            initUploaders: function () {
                this.view._photoUploader =  this.createUploader(this.view.photoUploaderOptions);
                this.view._videoUploader = this.createUploader(this.view.videoUploaderOptions);
            },

            renderMediaUploadForms: function () {
                this.view.$el.find('.upload-form-list').html('');
                this.view._mediaUploadForms.each(function (form) {
                    var newForm = new MediaUploadFormView({model:form});
                    this.view.$el.find('.upload-form-list').append(newForm.render().el);
                },this);
            },

            removeMediaUploadForm: function (removeModel) {
                // remove file from corresponding uploader
                var content_type = removeModel.get('content_type');
                if (content_type === 'videomedia') {
                    var imagefile = this.view._videoUploader.getFile(removeModel.get('fileId'));
                    this.view._videoUploader.removeFile(imagefile);
                }
                if (content_type === 'imagemedia')  {
                    var imagefile = this.view._photoUploader.getFile(removeModel.get('fileId'));
                    this.view._photoUploader.removeFile(imagefile);
                }

                this.renderMediaUploadForms();
            },

            createUploader: function (options) {
                var container = options.container;
                var chooser = options.chooser;
                var content_type = options.content_type;

                var filters = config.mediaUpload[content_type].filters;                 
                var maxFileSize = config.mediaUpload[content_type].maxFileSize;

                var uploader =  new plupload.Uploader({
                    runtimes: 'html5,flash',
                    browse_button: chooser,
                    container: container,
                    max_file_size: maxFileSize,
                    url: this.view.model.get('media'),
                    filters: [filters],
                    
                     // Flash settings
                    urlstream_upload: true,
                    flash_swf_url : config.url.libs + '/plupload/plupload.flash.swf',
                });

                uploader.content_type = content_type;

                uploader.bind('FilesAdded', this.onUploaderFile, this);
                uploader.bind('BeforeUpload', this.onBeforeUpload, this);
                uploader.bind('FileUploaded', this.onFileUpload, this);
                uploader.bind('Error', this.onUploadError, this);
                uploader.bind('UploadProgress', this.onUploadProgress, this);
                uploader.bind('UploadComplete', this.onUploadComplete, this);

                // delay init to avoid positioning issues
                var init = function () {
                    uploader.init();
                } 
                _.delay(init, 100);
                return uploader;
            },

            onUploadComplete: function (up, files) {
                this.view._mediaUploadForms.reset( null ,{silent:true});
                this.view.$uploadModal.modal('hide');
                this.render();
            },

            onUploadProgress: function (up, file) {
                this.view.$el.find('#upload-form-' + file.id + ' .bar').width(file.percent + '%'); 
            },

            onUploadError: function (up, error) {
                var msg = error.message;
                if ( error.code == -600 ) {
                    //file size error
                    msg = gettext('File too large. Max size is: ')+max_file_size;
                }
                if ( error.code == -601 ) {
                    //file type error, this is checked before hand
                    msg = gettext('Invalid file');
                }

                this.view.$el.find('#upload-form-' + file.id + ' upload-error').html(msg); 
            },

            onFileUpload: function (up, file, response) {
                this.view.$el.find('#upload-form-' + file.id + ' sub').html('Done'); 
            },

            onUploaderFile: function (up, files) {
                // create new upload form for each file selected 
                _.each(files, function (file, index) {

                    this.view._mediaUploadForms.add({
                        title: file.name,
                        fileId: file.id,
                        fileName: file.name,
                        fileSize: plupload.formatSize(file.size),
                        content_type: up.content_type, 
                    });
                
                }, this)

                this.renderMediaUploadForms();
               
                var _this = this;
                this.view.$uploadModal = this.view.$el.find('#uploader-modal-cast-' + this.view.model.get('id'));
                
                this.view.$uploadModal.modal();
                this.view.$uploadModal.find('.cancel').on('click', function () {
                    _this.view.$uploadModal.find('.cancel').off('click');
                    _this.view.$uploadModal.modal('hide');
                });
                this.view.$uploadModal.on('hidden', function () {
                    _this.view.$uploadModal.off('hidden');
                    _this.view._mediaUploadForms.reset();
                    _this.render();
                });
            },

            mediaAdd: function (uploaderView) {
                // get the data from each form model and append to corresponding plupload object
                this.view._mediaUploadForms.each( function (formModel) {
                    var content_type = formModel.get('content_type');
                    if (content_type === 'videomedia') {
                        this.view._videoUploader.formData = this.view._videoUploader.formData || [];
                        this.view._videoUploader.formData[formModel.get('fileId')] = formModel.toJSON();
                    }
                    if (content_type === 'imagemedia')  {
                        this.view._photoUploader.formData = this.view._photoUploader.formData || [];
                        this.view._photoUploader.formData[formModel.get('fileId')] = formModel.toJSON();
                    }
                }, this);

                // start the uploaders
                this.view._photoUploader.start();
                this.view._videoUploader.start();
            },

            onBeforeUpload: function (up, file) {
                // data stored on uploader object
                var formData = up.formData[file.id];

                // create media and update uploader url on success
                var _this = this;
                this.view.model.media.create(formData,{
                    url: this.view.model.media.url,
                    wait:true,
                    success: function (model, response, options) {
                        var content_type = model.get('content_type');
                        if (content_type === 'videomedia') {
                            _this.view._videoUploader.settings.url = response.uri;
                            _this.view._videoUploader.trigger('UploadFile', file);
                        }
                        if (content_type === 'imagemedia') {
                             _this.view._photoUploader.settings.url = response.uri;
                            _this.view._photoUploader.trigger('UploadFile', file);
                        }
                    }
                });
                
                // stop the upload event chain so we can change the url
                return false
            },

        },

        // cast states inherit baseState

        castMediaStates: {
            open: {}, 
        },

        // setup

        initialize: function () {
            // adds CastCommentsCollection 'media' to this view's model
            this.addCollectiontoViewModel({ 
                collectionType: CastMediaCollection, 
                name: 'media', // this determines the name of the attribute holding the collection in the view's model 
                urlFunction: function (model) {
                    return model.get('media');
                }
            });

            this.mediaRenderOptions = { 
                collection: this.model.media,
                selector: '.media-list',
                viewToCreate: SingleCastMediaView
            };

            this.photoUploaderOptions = {
                container: 'photo-uploader-cast-' + this.model.get('id'),
                content_type: 'imagemedia',
                chooser: 'photo-chooser-cast-' + this.model.get('id'),
            };

            this.videoUploaderOptions = {
                container: 'video-uploader-cast-' + this.model.get('id'),
                content_type: 'videomedia',
                chooser: 'video-chooser-cast-' + this.model.get('id'),
            };

            this._mediaUploadForms = new MediaUploadFormCollection;

            // instantiate view states
            this.addViewStates(this.castMediaStates).setViewState(this.states.open);

        }, 

        mediaAdd: function () {
            this.state.mediaAdd();
        },

        linkAdd: function () {
            this.state.linkAdd();
        },
        // public interface

        render: function () {
            this.state.render();
            return this;
        },
        
    });

    return CastMediaView;

});
