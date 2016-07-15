'use strict';

require('leaflet');

var MapWrapper = L.Class.extend({
  options: {
    center: L.latLng(50.846516, 4.351273),
    zoom: 13,
  },

  initialize: function(parsedOptions) {
    this.layers = {
      'Mapbox Streets': L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1Ijoibmljb21hcnRpIiwiYSI6ImNpb2VibnlyMjAwMXV2Z2x4bXNwNHN2cnMifQ.jKWiJsDzLostG0Xngxawrw', {
      }),
    };
    this.overlays = {
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

    // Add scale
    L.control.scale().addTo(map);

    return map;
  },
});

module.exports = function(parsedOptions) {
  return new MapWrapper(parsedOptions);
};
