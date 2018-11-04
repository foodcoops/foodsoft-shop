import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Col, Row, Well} from 'react-bootstrap';

import { fetchOrders } from '../actions/orders';
import { fetchCategories } from '../actions/categories';
import { fetchOrderArticles } from '../actions/order_articles';
import { fetchGroupOrderArticles } from '../actions/group_order_articles';
import OrdersTitle from './orders_title';
import OrdersBoxfillNotice from './orders_boxfill_notice';
import OrderArticles from './order_articles';
import Filters from './filters';
import TotalsBox from './totals_box';

class Orders extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchOrders({ state_eq: 'open' }));
    this.props.dispatch(fetchCategories({ orders_state_eq: 'open' }));
    this.props.dispatch(fetchOrderArticles({ orders_state_eq: 'open' }));
    this.props.dispatch(fetchGroupOrderArticles()); // @todo only open !!!!
  }

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

export default connect()(Orders);
