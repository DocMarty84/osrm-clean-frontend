'use strict';

var map = require('./map');
var control = require('./control');

var mapWrap = map({});
var controlWrap = control(mapWrap._map, {});

