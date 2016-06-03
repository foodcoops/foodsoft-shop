// wrapper for countries-info
import countries from 'world-countries';
import {locales} from '../config';
import {currentLocale} from 'i18n';

// index source data by two-letter ISO-code, let packager retain only parts we use
const data = countries.reduce((data,c) => {
  const key = c.cca2.toLowerCase();
  // pick just the elements we need
  data[key] = {
    latlng: c.latlng,
    name: c.name.common,
    translations: {},
  };
  // add translations for locales of those we use, indexed by two-letter ISO-code
  locales.forEach(l => {
    const trc = countries.find((c) => c.cca2.toLowerCase() === l.toLowerCase());
    if (trc) {
      const trcc = trc.cca3.toLowerCase();
      const tr = c.translations[trcc];
      if (tr) { data[key].translations[l] = tr.common; }
    }
  });

  return data;
}, {});

export function name(cc, locale) {
  const cdata = data[cc.toLowerCase()];
  if (cdata) {
    const ll = locale || currentLocale();
    return cdata.translations[ll.toLowerCase()] || cdata.name;
  }
};

export function latlng(cc) {
  const cdata = data[cc.toLowerCase()];
  if (cdata) {
    return cdata.latlng;
  }
}

export default function(cc) {
  return data[cc.toLowerCase()];
}
