// Global configuration

// hacks to be able to load this file from webpack as well
var wnd = {};
try { wnd = window; } catch(e) { /* ok */ }
function isDev() { return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; }

module.exports = {

  // replaced by webpack
  isDev:            isDev(),
  appName:          process.env.APP_NAME,
  appVersion:       process.env.APP_VERSION,

  // used locales (these may be included, when available, others are stripped)
  locales:          ['en', 'de', 'nl', 'fr', 'es', 'hu'],

  // configurable on global window object
  foodsoftUrl:      wnd.foodsoftUrl || (isDev() ? 'http://localhost:3000/f' : undefined),
  foodsoftClientId: wnd.foodsoftClientId || '-- please set window.foodsoftClientId --',
  foodsoftCurrency: wnd.foodsoftCurrency || '€ ',

};
