'use strict';

require('./app.css');

var control = require('./control');
var lang = require('./lang');
var links = require('./links');
var map = require('./map');
var print = require('./print');
var state = require('./state');

var parsedOptions = links.parse(window.location.search.slice(1));

var mapWrap = map(parsedOptions.map);
var controlWrap = control(mapWrap._map, parsedOptions.control);
var langObj = lang(parsedOptions.lang).addTo(mapWrap._map);
var stateObj = state(
  mapWrap._map, controlWrap._control, langObj, L.extend(parsedOptions.map, parsedOptions.control)
);
var printObj = print(controlWrap, {});
