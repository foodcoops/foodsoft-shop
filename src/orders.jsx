import React, {PropTypes} from 'react';
import {Col, Row, Well} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from './rest';

import Filters from './filters';
import OrderArticles from './order_articles';

class Orders extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.orders.sync());
    this.props.dispatch(rest.actions.categories.sync());
    this.props.dispatch(rest.actions.order_articles.sync());
    this.props.dispatch(rest.actions.group_order_articles.sync());
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <Filters categories={this.props.categories} orders={this.props.orders} onChange={this._onFilterChange.bind(this)} />
        </Col>
        <Col md={9}>
          <OrderArticles order_articles={this.props.order_articles} group_order_articles={this.props.group_order_articles} />
        </Col>
      </Row>
    );
  }

  _onFilterChange(key, value) {
    this.props.order_articles.sync = false; // @todo fix this hack to force sync with changed args https://github.com/lexich/redux-api/issues/70
    this.props.dispatch(rest.actions.order_articles.sync({[`q[${key}_eq]`]: value}));
  }
};

Orders.propTypes = {
  orders: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect((state) => {
  return {orders: state.orders, categories: state.categories, order_articles: state.order_articles, group_order_articles: state.group_order_articles}
})(Orders);
