/*
 * OPEN LOCAST WEB APPLICATION
 *
 * Copyright (C) 2012 MIT Mobile Experience Lab
 *
 * written by Amar Boghani & Nicholas Wallen
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */


// locast.js
// configure module loader and start app

requirejs.config({
 
  paths: {
    
    // libraries and plugins
    domReady: 'libs/require/domReady',
    text: 'libs/require/text',
    
    moment: 'libs/moment/moment.min',
    
    jquery: 'libs/jquery/jquery-1.8.2.min',
    jquerySerializeobject: 'libs/jquery/jquery.serializeobject',
    jqueryOembed: 'libs/jquery/jquery.oembed', // https://github.com/starfishmod/jquery-oembed-all

    bootstrap: 'libs/bootstrap/bootstrap-components.min',
    
    underscore: 'libs/underscore/underscore-min',
    
    backbone: 'libs/backbone/backbone-min',
    backboneSubroute: 'libs/backbone/backbone-subroute', // https://github.com/ModelN/backbone.subroute
    backboneModal: 'libs/backbone/backbone.bootstrap-modal', // https://github.com/powmedia/backbone.bootstrap-modal
    
    leaflet: 'libs/leaflet/leaflet',
    leafletMarkerCluster: 'libs/leaflet/markerCluster/leaflet.markercluster',
    
    markdownConverter: 'libs/pagedown/Markdown.Converter',
    markdown: 'libs/pagedown/Markdown.Sanitizer',
    markdownEditor: 'libs/pagedown/Markdown.Editor',

    flowplayer: 'libs/flowplayer/flowplayer.min',

    plupload: 'libs/plupload/plupload',
    pluploadHtml5: 'libs/plupload/plupload.html5',
    pluploadFlash: 'libs/plupload/plupload.flash',

    less: 'libs/less/less.1.5.0',


    // visualizations

    MAP: 'visualizations/map',
       
  },

  //support non-AMD libraries
  shim: {
    // core
    'underscore': {
        exports: '_'
    },
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    // leaflet
    'leaflet': {
        exports: 'L'
    },
    'leafletMarkerCluster': ['leaflet'],
    // jquery plugins
    'jquerySerializeobject': ['jquery'],
    'jqueryOembed': ['jquery'],
    'flowplayer': ['jquery'],
    // bootstrap
    'bootstrap': ['jquery'],
    'backboneModal': ['bootstrap'],
    // markdown
    'markdownConverter': {
        exports: 'Markdown'
    },
    'markdownEditor': {
        deps: ['markdownConverter'],
        exports: 'Markdown',
    },
    // requiring this will give you the markdown object with all the goodies
    'markdown': {
        deps: ['markdownConverter', 'markdownEditor'],
        exports: 'Markdown',
    },
    'plupload':{
        exports: 'plupload',
    },
    'pluploadFlash': ['plupload'],
    'pluploadHtml5':{
        deps: ['plupload','pluploadFlash'],
        exports: 'plupload',
    },
  }

});

//init locast app

require(['core/LocastApp', 'less'], function (LocastApp) {
    less.watch();
    console.log('less');
    var App = new LocastApp();

});

