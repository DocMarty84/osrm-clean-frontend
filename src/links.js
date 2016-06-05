'use strict';

var qs = require('qs');
require('lodash');
require('leaflet-routing-machine');

_.mixin({
  delUndefined: function(o) {
    _.each(o, function(v, k) {
      if(v === undefined) {
        delete o[k];
      }
    });
    return o;
  }
});

function _formatCoord(latLng) {
  if (!latLng) {
    return;
  }
  return latLng.lat.toFixed(6) + "," + latLng.lng.toFixed(6);
}

function _parseCoord(coordStr) {
  var latLng = coordStr.split(',');
  var lat = parseFloat(latLng[0]);
  var lon = parseFloat(latLng[1]);
  if (_.isNaN(lat) || _.isNaN(lon)) {
    return undefined;
  }
  return L.latLng(lat, lon);
}

function _formatWaypoints(wp) {
  wp = _.filter(wp, function(p) {
    return p.latLng !== undefined;
  });
  return _.map(wp, function(p) {
    return _formatCoord(p.latLng);
  });
}

function _parseWaypoints(wp) {
  wp = _.filter(wp, function(p) {
    return !!p;
  });
  return _.map(wp, function(p) {
    return L.Routing.waypoint(_parseCoord(p));
  });
}

function formatLink(options) {
  var linkOptions = {
      z: options.zoom || undefined,
      c: options.center && _formatCoord(options.center) || undefined,
      loc: options.waypoints && _formatWaypoints(options.waypoints) || undefined,
      hl: options.language || 'en',
      alt: options.alternative,
  };
  return qs.stringify(linkOptions, {indices: false});
}

function parseLink(link) {
  var q = qs.parse(link);
  var parsedOptions = {};
  parsedOptions.map = _.delUndefined({
    'zoom': _.isInteger(parseInt(q.z)) && _.parseInt(q.z) || undefined,
    'center': q.c && _parseCoord(q.c) || undefined,
  });
  parsedOptions.control = _.delUndefined({
    'waypoints': q.loc && _parseWaypoints(q.loc) || undefined,
    'language': q.hl || undefined,
    'alternative': q.alt,
  });
  parsedOptions.lang = _.delUndefined({
    'language': q.hl || undefined,
  });
  return parsedOptions;
}

module.exports = {
  'parse': parseLink,
  'format': formatLink,
};
