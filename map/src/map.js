'use strict';

require('leaflet-routing-machine');
require('leaflet.locatecontrol');

var MapWrapper = L.Class.extend({
  options: {
    center: L.latLng(50.846516, 4.351273),
    zoom: 13,
  },

  initialize: function(parsedOptions) {
    this.layers = {
      'Mapbox Streets': L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1Ijoibmljb21hcnRpIiwiYSI6ImNpb2VibnlyMjAwMXV2Z2x4bXNwNHN2cnMifQ.jKWiJsDzLostG0Xngxawrw', {
        attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a>'
      }),
      'Mapbox Outdoors': L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1Ijoibmljb21hcnRpIiwiYSI6ImNpb2VibnlyMjAwMXV2Z2x4bXNwNHN2cnMifQ.jKWiJsDzLostG0Xngxawrw', {
        attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a>'
      }),
      'Mapbox Streets Satellite': L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1Ijoibmljb21hcnRpIiwiYSI6ImNpb2VibnlyMjAwMXV2Z2x4bXNwNHN2cnMifQ.jKWiJsDzLostG0Xngxawrw', {
          attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a>'
      }),
      'openstreetmap.org': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors'
      }),
      'openstreetmap.de.org': L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
          attribution: '© <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors'
      }),
    };
    this.overlays = {
      'Touring': L.tileLayer('https://c.be-mobile.biz/d/public/BENELUX_20140901_0/all/LOS/{z}/{x}/{y}.png', {}),
      'Touring Extended': L.tileLayer('https://c.be-mobile.biz/d/public/endare/LOS/{z}/{x}/{y}.png', {}),
      'Clouds': L.tileLayer('http://a.maps.owm.io/current/CLOUDS_STYLE/{z}/{x}/{y}?appid=b1b15e88fa797225412429c1c50c122a', {}),
      'Precipitations': L.tileLayer('http://b.maps.owm.io/current/PRECIPITATION_STYLE/{z}/{x}/{y}?appid=b1b15e88fa797225412429c1c50c122a', {}),
    };
    this.options = L.extend(this.options, parsedOptions);
    this._map = this.createMap();
  },

  createMap: function() {
    var map = L.map('map', {
      layers: this.layers['Mapbox Streets'],
      center: this.options.center,
      zoom: this.options.zoom,
    });

    // Add the map control at botton left to switch between layers
    L.control.layers(this.layers, this.overlays, {
      position: 'bottomleft'
    }).addTo(map);

    // Add scale
    L.control.scale().addTo(map);

    // Add 'Show me where I am'.
    L.control.locate({
      keepCurrentZoomLevel: true,
    }).addTo(map);

    return map;
  },
});

module.exports = function(parsedOptions) {
  return new MapWrapper(parsedOptions);
};
