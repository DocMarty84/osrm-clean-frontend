'use strict';

var map = require('./map');
var control = require('./control');
var lang = require('./lang');

var mapWrap = map({});
var controlWrap = control(mapWrap._map, {});
var langObj = lang({}).addTo(mapWrap._map);

