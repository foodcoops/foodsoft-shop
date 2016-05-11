import React, {PropTypes} from 'react';
import {Col, Row, Well} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from './rest';

import Filters from './filters';
import TotalsBox from './totals_box';
import OrderArticles from './order_articles';

class Orders extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.orders.sync());
    this.props.dispatch(rest.actions.categories.sync({q: {orders_state_eq: 'open'}}));
    this.props.dispatch(rest.actions.order_articles.sync());
    this.props.dispatch(rest.actions.group_order_articles.sync());
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <TotalsBox
            group_order_articles={this.props.group_order_articles} />
          <Filters
            orders={this.props.orders}
            categories={this.props.categories}
            onChange={this._onChangeFilter.bind(this)} />
        </Col>
        <Col md={9}>
          <OrderArticles
            order_articles={this.props.order_articles}
            group_order_articles={this.props.group_order_articles}
            onChangeAmount={this._onChangeAmount.bind(this)} />
        </Col>
      </Row>
    );
  }

  _onChangeFilter(key, value) {
    this.props.dispatch(rest.actions.order_articles.reset('sync'));
    this.props.dispatch(rest.actions.order_articles.sync({q: {[`${key}_eq`]: value}}));
  }

  _onChangeAmount(oa, goa, what, value) {
    // @todo move order_articles.get() call to rest.js (not sure how yet)
    // @todo perhaps change api to only work with order_article_id and get rid of group_order_articles
    if (goa) {
      const goa_q = what === 'quantity' ? Number(value) : goa.quantity;
      const goa_t = what === 'tolerance' ? Number(value) : goa.tolerance;
      if (goa_q === 0 && goa_t === 0) {
        // amounts are zero, destroy it
        // (we could update it too, but the response would be that it's deleted, we can't understand that response from update)
        this.props.dispatch(rest.actions.group_order_articles.destroy(goa.id, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      } else {
        // update existing group_order_article
        this.props.dispatch(rest.actions.group_order_articles.update(goa.id, {[what]: value}, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      }
    } else if (value && value !== 0) {
      // no existing group_order_article, create one
      this.props.dispatch(rest.actions.group_order_articles.create({order_article_id: oa.id, [what]: value}, () => {
        this.props.dispatch(rest.actions.order_articles.get(oa.id));
      }));
    }
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
