import React from 'react';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';

import moment from 'moment';
import twix from 'twix';
import {uniq} from 'lodash';
import {connect} from 'react-redux';

import i18n, {t} from 'i18n-js';
const T = (s, opts) => t('orders_title.'+s, opts);

const OrdersTitleMember = ({orders}) => (
  <h2 style={styles.container}>
    <Glyphicon glyph='shopping-cart' style={styles.icon} />
    {T('title.member')}
    <small style={styles.closingDesc}>{closingDesc(orders)}</small>
  </h2>
);

const OrdersTitleEveryone = ({orders}) => (
  <h2 style={styles.container}>
    <Glyphicon glyph='th-large' style={styles.icon} />
    {T('title.all')}
    <small style={styles.closingDesc}>{closingDesc(orders)}</small>
  </h2>
);

const OrdersTitle = ({orders, filter}) => {
  // @todo update filters only after store was updated to avoid title update before articles update
  if (filter.ordered === 'member') {
    return <OrdersTitleMember orders={orders} />;
  } else if (filter.ordered === 'all') {
    return <OrdersTitleEveryone orders={orders} />;
  } else {
    return null;
  }
};

const closingDesc = (orders) => {
  // @todo move to separate file, and test properly
  if (!orders.sync) { return; }
  const hasOpen = !!orders.data.data.find((o) => o.is_open);
  const hasClosed = !!orders.data.data.find((o) => !o.is_open);
  const dates = uniq(orders.data.data.map((o) => moment(o.ends).second(0)).filter((o) => o.isValid()).sort());
  const T = (s, opts) => t('orders_title.sub.'+s, opts);

  // @todo get timezone from settings
  if (dates.length === 0) {
    return;
  }

  const from = dates[0];
  const to = dates.length > 1 ? dates[dates.length - 1] : from;
  if (to <= moment()) {
    if (!hasOpen) {
      // all orders were closed in the past
      return T('since', {date: to.fromNow(true)});
    } else {
      // all orders were supposed to have closed in the past
      return T('expect_since', {date: to.fromNow()});
    }
  }
  if (from === to || from.toNow() === to.fromNow()) {
    // same (fuzzy) representation
    return T('closing', {date: from.toNow()});
  }
  if (from < moment() && to > moment()) {
    if (hasClosed) {
      // some orders have closed, others haven't yet
      return T('partly', {date: to.fromNow()});
    } else {
      // some orders would have expected to be closed, others not yet
      return T('partly_expect_since', {date: to.fromNow()});
    }
  }

  // all orders are currently open and there is a date range
  const twx = moment.twix(from, to);
  return T('closing', {date: twx.format()});
}

OrdersTitle.propTypes = {
  orders: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired
};

function select(state, props) {
  return {orders: state.orders, filter: state.filter}
}

export default connect(select)(OrdersTitle);

const styles = {
  container: {
    marginTop: 0,
  },
  icon: {
    color: '#aaa',
    marginRight: '0.25em',
  },
  closingDesc: {
    marginLeft: '0.5em'
  }
};
