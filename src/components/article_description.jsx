// various article description components
import React from 'react';
import PropTypes from 'prop-types';
import {flatMap} from 'lodash';
import {name as countryName} from '../lib/countries';

import CountryIcon from './country_icon';

import {t} from 'i18n-js';
const T = (s, opts) => t('article_description.'+s, opts);

////
//// Helpers
////

// join Array<String, React.Component> as separate non-wrapping elements, returning array of elements
export function asLines(ary, sep=', ') {
  const aryf = ary.filter(o => o);
  return flatMap(aryf.map( (s,i) => (
    typeof(s) === 'string' ? <span key={i} style={styles.default}>{s}</span> : s
  )).map( (s,i) => (
    (i < (aryf.length-1) && (typeof(s) === 'string' || s.type !== 'br')) ? [s, sep] : s
  )));
}

// convert origin starting with country code to country code
function originCountryCode(origin) {
  const cc = origin ? origin.split(/(,|\s+)/, 1)[0] : null;
  return countryName(cc) ? cc : null;
}

// convert origin starting with country code to full name (or origin if not found)
function originCountryName(origin) {
  const cc = origin ? origin.split(/(,|\s+)/, 1)[0] : null;
  return countryName(cc) || origin;
}

////
//// Texts
////

const supplier     = ({article}) => article.supplier_name ? T('supplier', {supplier: article.supplier_name}) : null;
const origin       = ({article}) => article.origin ? T('origin', {origin: originCountryName(article.origin)}) : null;
const manufacturer = ({article}) => article.manufacturer ? T('manufacturer', {manufacturer: article.manufacturer}) : null;
const note         = ({article}) => article.note;
const byIn         = ({article}) => (
  article.origin ? (
    article.manufacturer ?
      T('manufacturer_with_origin', {manufacturer: article.manufacturer, origin: originCountryName(article.origin)}) :
      origin({article})
    ) :
    manufacturer({article})
);


////
//// Components
////

// from <supplier>
export const Supplier = ({article}) => (asLines([supplier({article})])[0]);
Supplier.propTypes = {article: PropTypes.object.isRequired};

// in <origin>
export const Origin = ({article}) => (asLines([origin({article})])[0]);
Origin.propTypes = {article: PropTypes.object.isRequired};

// <icon>
export const OriginIcon = ({article, ...props}) => {
  const code = article.origin ? originCountryCode(article.origin) : null;
  return code ? <CountryIcon code={code} {...props} /> : null;
};
OriginIcon.propTypes = {article: PropTypes.object.isRequired};

// by <manufacturer>
export const Manufacturer = ({article}) => (asLines([manufacturer({article})])[0]);
Manufacturer.propTypes = {article: PropTypes.object.isRequired};

// _<note>_
export const Note = ({article}) => (article.note ? <i style={styles.default}>{article.note}</i> : null);
Note.propTypes = {article: PropTypes.object.isRequired};

// by <manufacturer> in <origin>
export const ByIn = ({article}) => (asLines([byIn({article})])[0]);
ByIn.propTypes = {article: PropTypes.object.isRequired};

// from <supplier> by <manufacturer> in <origin>
export const FromByIn = ({article}) => (
  <span>{asLines([
    supplier({article}),
    byIn({article}),
  ])}</span>
);
FromByIn.propTypes = {article: PropTypes.object.isRequired};

// from <supplier> by <manufacturer> in <origin> / _<note>_
export const FromByInNote = ({article}) => (
  <span>{asLines([
    supplier({article}),
    byIn({article}),
    article.note ? <br key='br' /> : null,
    article.note ? <Note key='note' article={article} /> : null,
  ])}</span>
)

const styles = {
  default: {
    whiteSpace: 'nowrap',
  }
};
