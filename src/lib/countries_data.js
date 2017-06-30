// generator for countries.json data
// this file is included by webpack.config.js, and its result is served as countries_data.json
var countries = require('world-countries');
var locales = require('../config').locales;

// index source data by two-letter ISO-code, and retain only parts we use
module.exports = countries.reduce((data,c) => {
  var key = c.cca2.toLowerCase();
  // pick just the elements we need
  data[key] = {
    latlng: c.latlng,
    name: c.name.common,
    translations: {},
  };
  // add translations for locales of those we use, indexed by two-letter ISO-code
  locales.forEach(l => {
    const trc = countries.find(function (c) {
      return c.cca2.toLowerCase() === l.toLowerCase()
    });
    if (trc) {
      var trcc = trc.cca3.toLowerCase();
      var tr = c.translations[trcc];
      if (tr) { data[key].translations[l] = tr.common; }
    }
  });

  return data;
}, {});
