'use strict';

require('leaflet');

var Icon = L.Class.extend({
  options: {
  },

  initialize: function(parsedOptions) {
    this.options = L.extend(this.options, parsedOptions);
  },

  makeIcon: function(i, n) {
    var markerList = [
      '../bin/images/marker-from.png',
      '../bin/images/marker-to.png',
      '../bin/images/marker-via.png',
    ];
    if (i === 0) {
      return L.icon({
        iconUrl: markerList[0],
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    } else if (i === n - 1) {
      return L.icon({
        iconUrl: markerList[1],
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    } else {
      return L.icon({
        iconUrl: markerList[2],
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    }
  }

});

module.exports = function(parsedOptions) {
  return new Icon(parsedOptions);
};
