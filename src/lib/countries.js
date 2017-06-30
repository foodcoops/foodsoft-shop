// wrapper for countries-info
import data from './countries_data.json';
import { currentLocale } from 'i18n';

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
