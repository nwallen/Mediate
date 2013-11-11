// locastMap.js
// provides a consistent API for maps in Open Locast

define([

        'leaflet',
        'underscore',
        'jquery',
        'core/LocastClass',
        'leafletMarkerCluster'

        ], function (L, _, $, LocastClass) {

    var LocastMap = LocastClass.extend({
        
        // map 
        _id: '',
        _map: '',

        // to do: these should be from the global configuration vars
        _mapDefaults: {
            center: L.latLng( 42.373851, -71.110296),
            zoom: 14,
            zoomControl: false
        },

        initialize: function (id, defaults) {
            this._id = id;
            
            this._map = L.map(this._id, this._mapDefaults);
            L.control.zoom({position: 'bottomleft'}).addTo(this._map);
            
            this._cloudmadeLayer = L.tileLayer(
                this.cloudmadeSettings.url, 
                this.cloudmadeSettings.options);

            this._map.addLayer( this._cloudmadeLayer); 
        },

        setCastMarker: function(latlng) {
            var thisLatlng = L.latLng(latlng[1], latlng[0]); 
            this._clearLayer(this._singleCastLayer);
            this._singleCastLayer = L.marker([latlng[1], latlng[0]], this.singleCastPointOptions);
            this._map.addLayer(this._singleCastLayer).panTo(thisLatlng);

        },

        renderCasts: function (data) { 
            this._clearLayer(this._castClusterLayer);

            var _this = this;
            var featureCallback = this._onFeatureClick;

            this._castLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    layer.on('click', featureCallback, {_this:_this, feature: feature});
                },
                pointToLayer: function(feature, latlng) {
                    return L.marker( latlng, this._castMarkerOptions); 
                }       
            });

            this._castClusterLayer = new L.MarkerClusterGroup(this._castClusterLayerOptions).addLayer(this._castLayer).addTo(this._map);
        },

        redrawBase: function () {
            //hack to make baselayer tiles fade in when unhiding the map
            L.Util.requestAnimFrame(this._map.invalidateSize,this._map,!1,this._map._container);
        },

        addCastPointActivate: function () {
            this._map.on('click', function (e) {
                this._clearLayer(this._addPointLayer);
                this._addPointLayer = L.marker(e.latlng, this._addPointOptions).addTo(this._map);
            }, this);
        },

        getCastPoint: function () {
            if (!this._addPointLayer) {
                return undefined;
            }
            if (this._map.hasLayer(this._addPointLayer)) {
               return this._addPointLayer.getLatLng();
            }
        },

        destroyCastPoint: function () {
            this._clearLayer(this._addPointLayer);
            this._map.off('click');
        }, 

        _onFeatureClick: function (e) {
             this._this.trigger('featureClick', this.feature);
        },

        _clearLayer: function (layer) {
            if (!layer) {
                return;
            }
            if (this._map.hasLayer(layer)) {
                  this._map.removeLayer(layer);
            }
        },

        // layers
        //_castClusterLayer: new L.MarkerClusterGroup(),
        _castClusterLayerOptions: {
            singleMarkerMode: true,
            iconCreateFunction: this._clusterIcon
        },

        //_castLayer: L.geoJson,
        _castMarkerOptions: {
            icon: L.divIcon()
        },

        //_addPointLayer: L.marker,
        _addPointOptions: {
            icon: L.divIcon({
                className:'add-cast-point leaflet-div-icon',      
            })
        },

        singleCastPointOptions: {
            icon: L.divIcon({
                className: 'single-cast-point leaflet-div-icon',      
            })
        },


        // to do: the cloudmade key and style should be in a global config
        cloudmadeSettings: {
            url: 'http://{s}.tile.cloudmade.com/{key}/{style}/256/{z}/{x}/{y}.png' ,
            options: {
            key: '<put your key here>',
            style: '997',
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>' 
            }
        }, 

        // format cluster icon
        _clusterIcon: function (cluster) {
            var castCount = cluster.getChildCount(); 
            var w = 40;
            var h = 40;    
            var c = 'cast-cluster-';
            
            if (castCount < 10) {
                c += 'small';
                w = 40;
            } else if (castCount < 100) {
                c += 'medium';
                w = 60;
            } else {
                c += 'large';
                w = 60;
            }

            if(castCount === 1){
                c += ' single-cast';
                w = 40;
            }
                     
            h = w;

            return L.divIcon({
                html: '<div class="title"><span>' + castCount + '</span></div>',
                className: 'cast-cluster ' + c,
                iconSize: L.point(w,h)
            });
        }, 

    }) 

    return LocastMap;

});
