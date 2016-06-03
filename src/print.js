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

      var routeToPrint = this._container
        .getElementsByClassName('leaflet-routing-alt')[this._controlWrap.routeSelected.routesIndex];
      routeToPrint.className = '';

      // See this._controlWrap.routeSelected.routesIndex to know which one was selected
      console.log(this._container);
      var tmplCompiled = _.template(this._createTemplate());
      var tmplRendered = tmplCompiled({foo: routeToPrint});
      document.getElementsByClassName('map')[0].setAttribute('style', 'display: none;');
      document.getElementsByClassName('print')[0].appendChild(routeToPrint);
    }, this);

  },

  _createTemplate: function() {
    return '' +
      '<%= foo %>'
    ;
  }

});

module.exports = function(parsedOptions) {
  return new Print(parsedOptions);
};
