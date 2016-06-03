// various article description components
import React, {PropTypes} from 'react';
import {flatMap} from 'lodash';
import {name as countryName} from '../lib/countries';

import {t} from 'i18n';
const T = (s, opts) => t('article_description.'+s, opts);

// join Array<String, React.Component> as separate non-wrapping elements, returning array of elements
export function asLines(ary, sep=', ') {
  const aryf = ary.filter(o => o);
  return flatMap(aryf.map( (s,i) => (
    typeof(s) === 'string' ? <span key={i} style={styles.default}>{s}</span> : s
  )).map( (s,i) => (
    i < (aryf.length-1) ? [s, sep] : s
  )));
}

// convert origin starting with country code to full name (or origin if not found)
function country(origin) {
  if (origin) {
    const cc = origin.split(/(,|\s+)/, 1)[0];
    return countryName(cc) || origin;
  }
}

// from <supplier>
export const Supplier = ({article}) => (
  article.supplier_name ? asLines([T('supplier', {supplier: article.supplier_name})])[0] : null
);
Supplier.propTypes = {article: PropTypes.object.isRequired};

// in <origin>
export const Origin = ({article}) => (
  article.origin ? asLines([T('origin', {origin: country(article.origin)})])[0] : null
);
Origin.propTypes = {article: PropTypes.object.isRequired};

// by <manufacturer>
export const Manufacturer = ({article}) => (
  article.manufacturer ? asLines([T('manufacturer', {manufacturer: article.manufacturer})])[0] : null
);
Manufacturer.propTypes = {article: PropTypes.object.isRequired};

// by <manufacturer> in <origin>
export const ByIn = ({article}) => (
  article.origin ?
    article.manufacturer ?
      <span style={styles.default}>{T('manufacturer_with_origin', {manufacturer: article.manufacturer, origin: country(article.origin)})}</span>
      : <Origin article={article} />
    : <Manufacturer article={article} />
);
ByIn.propTypes = {article: PropTypes.object.isRequired};

// from <supplier> by <manufacturer> in <origin>
export const FromByIn = ({article}) => (
  <span>{asLines([
    <Supplier key={1} article={article} />,
    <ByIn     key={2} article={article} />,
  ])}</span>
);
FromByIn.propTypes = {article: PropTypes.object.isRequired};

const styles = {
  default: {
    whiteSpace: 'nowrap',
  }
};
