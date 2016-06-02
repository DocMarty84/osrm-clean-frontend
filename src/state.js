var links = require('./links');

var State = L.Class.extend({
  options: {
  },

  initialize: function(map, control, lang, parsedOptions) {
    this._map = map;
    this._control = control;
    this._plan = this._control.getPlan();
    this._lang = lang;
    this.options = L.extend(this.options, parsedOptions);

    this.addEvents();
  },

  // Update browser url
  update: function() {
    var baseURL = window.location.href.split('?')[0];
    var newParms = links.format(this.options);
    window.location.hash = newParms;
    history.replaceState({}, 'OSRM Frontend', baseURL + '?' + newParms);
  },

  addEvents: function() {
    var self = this;

    this._plan.on('waypointschanged', function() {
      self.options.waypoints = self._control.getWaypoints();
      self.update();
    }, this);

    this._map.on('zoomend', function() {
      self.options.zoom = self._map.getZoom();
      self.update();
    }, this);

    this._map.on('moveend', function() {
      self.options.center = self._map.getCenter();
      self.update();
    }, this);

    this._lang.on('languagechanged', function(e) {
      self.options.language = e.language;
      self.update();
      window.location.reload();
    }, this);
  },

});

module.exports = function(map, control, lang, parsedOptions) {
  return new State(map, control, lang, parsedOptions);
};
