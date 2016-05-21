import React, {PropTypes} from 'react';
import {Col, Row, Well} from 'react-bootstrap';

import filter from '../store/filter';

import Filters from './filters';
import OrdersTitle from './orders_title';
import OrdersBoxfillNotice from './orders_boxfill_notice';
import OrderArticles from './order_articles';
import TotalsBox from './totals_box';

class Orders extends React.Component {

  render() {
    return (
      <Row>
        <Col md={3}>
          <TotalsBox />
          <Filters />
        </Col>
        <Col md={9}>
          <OrdersTitle />
          <OrdersBoxfillNotice />
          <OrderArticles />
        </Col>
      </Row>
    );
  }

};

Orders.propTypes = {
};

export default Orders;
