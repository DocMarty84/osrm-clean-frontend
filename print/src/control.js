'use strict';

var icon = require('../../map/src/icon');
require('leaflet-control-geocoder');
require('leaflet-routing-machine');
var $ = require('jquery');

var iconObj = icon({});

var ControlWrapper = L.Class.extend({
  options: {
    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    createMarker: function(i, wp, n) {
      var options = {
        draggable: true,
        icon: iconObj.makeIcon(i, n),
      };
      return L.marker(wp.latLng, options);
    },
  },

  initialize: function(map, scope, parsedOptions) {
    this.options = L.extend(this.options, parsedOptions);
    this._map = map;
    this._scope = scope;
    this._control = this.createControl();
    this._plan = this._control.getPlan();
    this.alternative = this.options.alternative || 0;
    this.instructionsToPrint = {};
    this._tmpWaypoints = {};
    this._defWp = $.Deferred();

    this.addEvents();
  },

  createControl: function() {
    var control = L.Routing.control(this.options);
    control.addTo(this._map);
    $('.leaflet-top').hide();
    $('.leaflet-routing-alternatives-container').hide();
    return control;
  },

  addEvents: function() {
    var self = this;

    // Show / hide the routing panel
    $(self._map._container).hover(
      function() {
        $('.leaflet-top').fadeIn();
      }, function() {
        $('.leaflet-top').fadeOut();
      }
    );

    // Save the alternative selected for further use
    this._control.on('routeselected', function(e){
      self._defWp.done(function() {
        self._control.fire('routeready');
      });
    }, this);

    // Reset deferred if waypoints changed, e.g. destination is removed
    this._control.on('waypointschanged', function(e) {
      // Reset deferred
      self._tmpWaypoints = {}
      $.each(e.waypoints, function(i, v) {
        if (v.name) {
          self._tmpWaypoints[String(v.latLng.lat) + ',' + String(v.latLng.lng)] = true;
        }
      });
      if (Object.keys(self._tmpWaypoints).length > self._control.getPlan()._waypoints.length) {
        self._defWp = $.Deferred();
      } else if (Object.keys(self._tmpWaypoints).length < 2) {
        self._control.fire('routeready');
      }
    }, this);

    // Resolve the deferred when all points are geocoded
    this._plan.on('waypointgeocoded', function(e) {
      self._tmpWaypoints[String(e.waypoint.latLng.lat) + ',' + String(e.waypoint.latLng.lng)] = true;
      if (Object.keys(self._tmpWaypoints).length === self._control.getPlan()._waypoints.length) {
        self._defWp.resolve();
      }
    }, this);

  },
});

module.exports = function(map, scope, parsedOptions) {
  return new ControlWrapper(map, scope, parsedOptions);
};
