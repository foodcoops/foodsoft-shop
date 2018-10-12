import React from 'react';
import PropTypes from 'prop-types';
import lastBox from '../lib/last_box';
import {asLines} from './article_description';

import {t} from 'i18n-js';
const T = (s, opts) => t('article_description.quantities.'+s, opts);

// no-one ordered this yet
// <3> x <kg> ordered by all members
function unitsToOrderDesc(order_article) {
  const {quantity, units_to_order} = order_article;
  const {unit, unit_quantity} = order_article.article;

  if (unit_quantity === 1 || quantity === 0) {
    return T('quantity', {count: units_to_order, amount: T('amount', {count: units_to_order, unit})});
  } else {
    return T('units_to_order', {count: units_to_order, box_amount: T('amount', {count: unit_quantity, unit})});
  }
}

// Roughly, these are the options:
//-- unit_quantity = 1 --
// (nothing)
//-- unit_quantity > 1, units_to_order = 0, quantity = 0 --
// no-one ordered this yet, <8> x <kg> is needed to complete a box
// no-one ordered this yet (+ <2> extra), <6> x <kg> are still needed to complete a box
// no-one ordered this yet (+ <10> extra), ????? [--> 0 x <kg> are still needed to complete a box]
//-- unit_quantity > 1, units_to_order = 0, quantity > 0 --
// <1> x <kg> requested by all members, <7> are still needed to complete a box
// <1> x <kg> (+ <2> extra) requested by all members, <5> are still needed to complete a box
//-- unit_quantity > 1, units_to_order > 0 --
// with <1> x <kg> in the remaining box (+ <1> extra), <6> are needed to completion; all members are ordering <2> boxes of <3> x <kg>
function lastBoxDescs(order_article) {
  const {quantity, tolerance, units_to_order} = order_article;
  const {unit, unit_quantity} = order_article.article;
  const box = lastBox(order_article);

  const amount = T('amount', {count: quantity, unit});
  const missing_amount = T('amount', {count: box.missing, unit});
  const extra  = tolerance > 0 ? (' ' + T('extra', {count: tolerance})) : '';

  if (unit_quantity === 1) {
    return [];
  }
  if (quantity === 0) {
    return [
      T('quantity', {count: 0}) + extra,
      T(tolerance === 0 ? 'need_full' : 'need_still', {count: box.missing, amount: missing_amount}),
    ];
  }
  if (units_to_order === 0) {
    return [
      T('requested', {count: quantity, amount, extra}),
      T('need_still', {count: box.missing, amount: box.missing}),
    ];
  }
  const remaining_amount = T('amount', {count: box.quantity, unit});
  if (box.quantity === 0) {
    const remaining_extra = box.tolerance > 0 ? (' ' + T('extra', {count: T('amount', {count: box.tolerance, unit})})) : '';
    const missing_amount  = T('amount', {count: Math.max(1, box.missing), unit});
    return [
      T('with_remaining_box', {count: 0, extra: remaining_extra}),
      T('with_remaining_box_fill', {count: Math.max(1, box.missing), amount: missing_amount}),
    ];
  } else {
    const remaining_extra = box.tolerance > 0 ? (' ' + T('extra', {count: box.tolerance})) : '';
    return [
      T('with_remaining_box', {count: box.quantity, amount: remaining_amount, extra: remaining_extra}),
      T('with_remaining_fill', {count: box.missing}),
    ];
  }
};

export const UnitsToOrderDesc = ({order_article}) => (
  asLines([unitsToOrderDesc(order_article)])[0]
);
UnitsToOrderDesc.propTypes = {order_article: PropTypes.object.isRequired};

export const LastBoxDesc = ({order_article}) => (
  <span>{asLines(lastBoxDescs(order_article))}</span>
);
LastBoxDesc.propTypes = {order_article: PropTypes.object.isRequired};
