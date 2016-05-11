import React, {PropTypes} from 'react';
import {Col, Row, Well} from 'react-bootstrap';

import Filters from './filters';
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
          <OrderArticles />
        </Col>
      </Row>
    );
  }

};

Orders.propTypes = {
};

export default Orders;
