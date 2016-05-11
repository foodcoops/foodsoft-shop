import React, {PropTypes} from 'react';
import {Accordion, ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from '../rest';

class Filters extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.categories.sync({q: {orders_state_eq: 'open'}}));
    this.props.dispatch(rest.actions.orders.sync());
  }

  render() {
    let i = 0;
    return (
      <Accordion defaultActiveKey={1}>
        {this.hasCategories() ?
            // @todo move knowledge of search param key to rest.js
            this._renderPanel('article_article_category_id', i += 1, "Categories", this.props.categories.data) : null}
        {this.hasOrders() ?
            this._renderPanel('order_id', i += 1, "Suppliers", this.props.orders.data) : null}
      </Accordion>
    );
  }

  _renderPanel(id, key, title, items) {
    return (
      <Panel eventKey={key} header={title}>
        <ListGroup fill>
          {items.map((item) => (
            <ListGroupItem key={item.id} href='#' onClick={this._onClick.bind(this, id, item.id)}>{item.name}</ListGroupItem>
          ))}
        </ListGroup>
      </Panel>
    );
  }

  hasCategories() {
    return !this.props.categories.loading && this.props.categories.data.length > 1;
  }
  hasOrders() {
    return !this.props.orders.loading && this.props.orders.data.length > 1;
  }

  _onClick(key, value) {
    this.props.dispatch(rest.actions.order_articles.reset('sync'));
    this.props.dispatch(rest.actions.order_articles.sync({q: {[`${key}_eq`]: value}}));
  }
}

Filters.propTypes = {
  orders: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect((state) => {
  return {orders: state.orders, categories: state.categories}
})(Filters);
