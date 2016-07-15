'use strict';

require('leaflet');
require('lodash');

var languages = {
  'de': 'German / Deutsch',
  'el': 'Greek / Ελληνικά',
  'en': 'English',
  'fr': 'French / Français',
  'it': 'Italian / Italiano',
  'nl': 'Dutch / Nederlands',
  'pt': 'Portuguese / Português',
  'sv': 'Swedish / svenska',
  'sp': 'Spanish / Español',
  'sk': 'Slovak / Slovenský jazyk',
}

var Lang = L.Control.extend({
  includes: L.Mixin.Events,
  options: {
    language: 'en',
    position: 'topleft',
  },

  initialize: function(parsedOptions) {
    this.options = L.extend(this.options, parsedOptions);
  },

  onAdd: function(map) {
    var containerElements = this._createContainer();

    var _showList = function(e) {
      containerElements.languageList.setAttribute('style', 'display: block;');
      containerElements.languageCurrent.setAttribute('style', 'display: none;');
    };

    var _hideList = function(e) {
      containerElements.languageList.setAttribute('style', 'display: none;');
      containerElements.languageCurrent.setAttribute('style', 'display: block;');
    };

    L.DomEvent
      .on(containerElements.container, 'click', L.DomEvent.stopPropagation)
      .on(containerElements.container, 'click', L.DomEvent.stopPropagation)
      .on(containerElements.container, 'mouseenter', _showList)
      .on(containerElements.container, 'mouseleave', _hideList);

    return containerElements.container;

  },

  _createContainer: function() {
    var self = this;
    var language = this.options.language

    // Global container
    var container = L.DomUtil.create('div');
    container.setAttribute('class', 'language-container leaflet-bar leaflet-control');

    // Selected language
    var languageCurrent = L.DomUtil.create('div', '', container);
    languageCurrent.setAttribute('class', 'language-current');
    var a = L.DomUtil.create('a', '', languageCurrent);
    a.setAttribute('href', '#');
    a.innerHTML = language;

    // Language list
    var languageList = L.DomUtil.create('div', '', container);
    languageList.setAttribute('class', 'language-list');
    languageList.setAttribute('style', 'display: none;');
    L.DomEvent.on(languageList, 'click', self._changeLanguage, self);

    var languagesCopy = _.clone(languages)
    delete languagesCopy[language]

    var a = L.DomUtil.create('a', '', languageList);
    a.setAttribute('href', '#');
    a.setAttribute('title', languages.language);
    a.setAttribute('class', 'language-item');
    a.innerHTML = language;

    _.each(languagesCopy, function(v, k){
      var a = L.DomUtil.create('a', '', languageList);
      a.setAttribute('href', '#');
      a.setAttribute('title', v);
      a.setAttribute('class', 'language-item');
      a.innerHTML = k;
    });

    return {
      'container': container,
      'languageCurrent': languageCurrent,
      'languageList': languageList,
    };
  },

  _changeLanguage: function(e) {
    if (this.options.language !== e.target.innerHTML) {
      this.fire("languagechanged", {language: e.target.innerHTML});
    }
  },

});

module.exports = function(parsedOptions) {
  return new Lang(parsedOptions);
};
