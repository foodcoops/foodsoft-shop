// generator for countries data
// this file is process by val-loader in webpack.config.js at build time, and its result is used
var countries = require('world-countries');
var locales = require('../config').locales;

// index source data by two-letter ISO-code, and retain only parts we use
module.exports = function() {
  const data = countries.reduce((data,c) => {
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
  return { code: "module.exports = " + JSON.stringify(data) + ";" };
}
