'use strict';

require('leaflet');
require('lodash');

var Print = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
  },

  initialize: function(controlWrap, parsedOptions) {
    this.options = L.extend(this.options, parsedOptions);
    this._controlWrap = controlWrap;
    this._container = this._controlWrap._control._container;

    this._createButton();
    this.addEvents();
  },

  _createButton: function() {
    var printButton = L.DomUtil.create('button', 'fa fa-print', this._container.firstChild);
    printButton.setAttribute('type', 'button');
    L.DomEvent.on(printButton, 'click', function(e){
      this.fire('print', {});
    }, this);
  },

  addEvents: function() {
    this.on('print', function(e) {
      if (this._controlWrap.alternative === undefined) {
        return;
      } else {
        var baseURL = window.location.href.replace('/map/', '/print/');
        window.open(baseURL);
      }
    }, this);
  },
});

module.exports = function(parsedOptions) {
  return new Print(parsedOptions);
};
