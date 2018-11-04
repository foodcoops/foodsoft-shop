import { isEqual } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Col, Row, Well} from 'react-bootstrap';

import { fetchOrders } from '../actions/orders';
import { fetchCategories } from '../actions/categories';
import { fetchOrderArticles } from '../actions/order_articles';
import { fetchGroupOrderArticles } from '../actions/group_order_articles';
import { replaceFilter } from '../actions/filter';
import OrdersTitle from './orders_title';
import OrdersBoxfillNotice from './orders_boxfill_notice';
import OrderArticles from './order_articles';
import Filters from './filters';
import TotalsBox from './totals_box';

class OrdersOpen extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchOrders({ state_eq: 'open' }));
    this.props.dispatch(fetchCategories({ orders_state_eq: 'open' }));
    this.updateFilter(); // also fetches order articles
    this.props.dispatch(fetchGroupOrderArticles({ group_order_order_state: 'open' }));
  }

  componentDidUpdate(prevProps, prevState) {
    // update filter from URL (no need to reload the other data)
    if (!isEqual(prevProps.filter, this.props.filter)) {
      this.updateFilter();
    }
  }

  updateFilter(filter) {
    const { order_id, article_category_id, ordered } = this.props.filter;
    const oa_params = { order_id_eq: order_id, article_article_category_id_eq: article_category_id, ordered: ordered };
    this.props.dispatch(replaceFilter(oa_params)); // also fetches order articles
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

OrdersOpen.propTypes = {
  filter: PropTypes.shape({
    order_id: PropTypes.number,
    article_category_id: PropTypes.number,
    ordered: PropTypes.oneOf(['all', 'member']),
  })
};

function select(state, props) {
  const { order_id, article_category_id, ordered, search } = props.match.params;
  return { filter: {
    order_id: parseInt(order_id) || null,
    article_category_id: parseInt(article_category_id) || null,
    ordered,
  } };
}

export default connect(select)(OrdersOpen);
