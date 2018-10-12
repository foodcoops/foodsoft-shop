import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'react-bootstrap'

import {connect} from 'react-redux';

import i18n, {t} from 'i18n-js';
const T = (s, opts) => t('orders_boxfill_notice.'+s, opts);

const OrdersBoxfillNotice = ({orders}) => {
  if (!orders.data.data) { return null; }
  const numOrders = orders.data.data.length;
  const numBoxfill = orders.data.data.filter((o) => o.is_boxfill).length;
  if (numBoxfill === 0) { return null; }
  return (
    <Alert bsStyle='info'>
      {numBoxfill === 1 ?
        T('boxfill1.one', {order: orders.data.data.find((o) => o.is_boxfill).name}) :
        (numBoxfill < numOrders ? T('boxfill1.some') : T('boxfill1.all'))}
      {' '}{T('boxfill2')}
    </Alert>
  );
};

OrdersBoxfillNotice.propTypes = {
  orders: PropTypes.object.isRequired
};

function select(state, props) {
  return {orders: state.orders}
}

export default connect(select)(OrdersBoxfillNotice);
