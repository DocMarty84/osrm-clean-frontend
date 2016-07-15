'use strict';

require('./app.css');

var angular = require('angular');
var $ = require('jquery');
require('leaflet');

var control = require('./control');
var map = require('./map');
var lang = require('../../map/src/lang');
var links = require('../../map/src/links');
var state = require('../../map/src/state');

angular
  .module('osrmPrintApp', [require('angular-animate')])
  .controller('RouteDetails', function RouteDetails($scope) {

    // Leaflet-related objects
    var parsedOptions = links.parse(window.location.search.slice(1, -1));
    var mapWrap = map(parsedOptions.map);
    var controlWrap = control(mapWrap._map, $scope, parsedOptions.control);
    var langObj = lang(parsedOptions.lang).addTo(mapWrap._map);
    var stateObj = state(
      mapWrap._map, controlWrap._control, langObj, L.extend(parsedOptions.map, parsedOptions.control)
    );

    // Working objects
    var marker = undefined;

    // Angular objects
    $scope.routeToPrint = undefined;
    $scope.instructionsToPrint = {};

    // Filling Angular object when route is ready
    controlWrap._control.on('routeready', function() {
      $scope.routeToPrint = undefined;
      $scope.instructionsToPrint = {};
      $scope.instructionsToPrint.showDetail = {};

      if (Object.keys(controlWrap._tmpWaypoints).length >= 2) {
        $scope.routeToPrint = controlWrap._control._routes[controlWrap.alternative];

        var tmpInstructions = $('.leaflet-routing-alt')[controlWrap.alternative];
        $scope.instructionsToPrint.title = $(tmpInstructions).children('h2').html();
        $scope.instructionsToPrint.subtitle = $(tmpInstructions).children('h3').html();

        $scope.instructionsToPrint.waypoints = [];
        $.each(controlWrap._plan._waypoints, function(i, v) {
          $scope.instructionsToPrint.waypoints.push(v.name);
        });

        var count_wp = 1;
        $scope.instructionsToPrint.steps = [];
        $.each($(tmpInstructions).find('tr'), function(i, v) {
          var elem = $(v).children('td');
          elem[0] = $(elem[0]).children('span').attr('class');
          elem[1] = $(elem[1]).html();
          elem[2] = $(elem[2]).html();
          if (elem[0] === 'leaflet-routing-icon leaflet-routing-icon-via') {
            elem[1] = elem[1] + ' - ' + $scope.instructionsToPrint.waypoints[count_wp];
            count_wp++;
          } else if (elem[0] === 'leaflet-routing-icon leaflet-routing-icon-arrive') {
            elem[1] = elem[1] + ' - ' + $scope.instructionsToPrint.waypoints[count_wp];
          }
          $scope.instructionsToPrint.steps.push(elem);
        });
      }
      $scope.$digest();
    });

    $scope.addMarker = function(index) {
      var indexInstruction = index;
      var indexCoordinate = $scope.routeToPrint.instructions[indexInstruction].index;
      marker = L.circleMarker($scope.routeToPrint.coordinates[indexCoordinate]).addTo(mapWrap._map)
    }

    $scope.removeMarker = function(index) {
      if (marker) {
        mapWrap._map.removeLayer(marker);
      }
    }

    $scope.showDetails = function(index) {
      var indexInstruction = index;
      var indexCoordinate = $scope.routeToPrint.instructions[indexInstruction].index;

      // Hide detailed step
      if ($scope.instructionsToPrint.showDetail[String(indexInstruction)]) {
        delete $scope.instructionsToPrint.showDetail[String(indexInstruction)];
        return;
      }

      // Save global map state
      var map_center = mapWrap._map.getCenter();
      var map_zoom = mapWrap._map.getZoom();

      // Zoom to details
      mapWrap._map.setView($scope.routeToPrint.coordinates[indexCoordinate], 17);
      mapWrap._map.eachLayer(function(l) {
        if (l._url) {
          l.once('load', function(e) {
            // Copy the map, clean it and insert it in table
            var mapDetail = $(mapWrap._map._container).clone()
              .removeAttr('id')
              .removeClass('map')
              .addClass('map-detail');
            $(mapDetail).find('.leaflet-top').remove();

            $('.map-step-' + String(indexInstruction)).html(mapDetail);

            // Manual call to updatee the view to get faster update and reset the original map
            $scope.instructionsToPrint.showDetail[String(indexInstruction)] = true;
            $scope.$digest();

            // Reset global map
            mapWrap._map.setView(map_center, map_zoom);
          });
        }
      });
    }
});
