'use strict';

require('leaflet-control-geocoder');
require('leaflet-routing-machine');

L.Icon.Default.imagePath = '../node_modules/leaflet/dist/images';

var ControlWrapper = L.Class.extend({
  options: {
    geocoder: L.Control.Geocoder.nominatim(),
    reverseWaypoints: true,
    routeWhileDragging: true,
    routeDragInterval: 250,
    showAlternatives: true,
    altLineOptions: {
      styles: [
        {color: 'black', opacity: 0.15, weight: 9},
        {color: 'white', opacity: 0.8, weight: 6},
        {color: 'blue', opacity: 0.5, weight: 2}
      ]
    }
  },

  initialize: function(map, parsedOptions) {
    this.options = L.extend(this.options, parsedOptions);
    this._map = map;
    this._control = this.createControl();
    this._plan = this._control.getPlan();
    this.routeSelected = undefined;

    this.addEvents();
  },

  createControl: function() {
    var control = L.Routing.control(this.options);
    control.addTo(this._map);
    L.Routing.errorControl(control).addTo(this._map);
    return control;
  },

  addEvents: function() {
    var self = this;

    // Add From/To destination whan clicking on the map
    this._map.on('click', function(e) {
      function createButton(label, container) {
        var btn = L.DomUtil.create('button', '', container);
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'btn btn-default');
        btn.innerHTML = label;
        return btn;
      }
      var container = L.DomUtil.create('div');
      var startBtn = createButton('Start from this location', container);
      var destBtn = createButton('Go to this location', container);

      L.DomEvent.on(startBtn, 'click', function() {
        self._control.spliceWaypoints(0, 1, e.latlng);
        self._map.closePopup();
      }, self);

      L.DomEvent.on(destBtn, 'click', function() {
        self._control.spliceWaypoints(self._control.getWaypoints().length - 1, 1, e.latlng);
        self._map.closePopup();
      }, self);

      L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(self._map);
    }, this);

    // Focus when geocoded
    this._plan.on('waypointschanged', function(e) {
      var waypoints = self._plan._waypoints.filter(function(wp) {
        return !!wp.latLng;
      });
      if (waypoints.length === 1) {
        self._map.panTo(waypoints[0].latLng);
      }
    }, this);

    // Save the route selected for further use
    this._control.on('routeselected', function(e){
      self.routeSelected = e.route;
    }, this);

  },

});

module.exports = function(map, parsedOptions) {
  return new ControlWrapper(map, parsedOptions);
};
