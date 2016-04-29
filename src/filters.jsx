import React, {PropTypes} from 'react';
import {Accordion, ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

class Filters extends React.Component {
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

  hasOrders() {
    return !this.props.orders.loading && this.props.orders.data.length > 1;
  }
  hasCategories() {
    return !this.props.categories.loading && this.props.categories.data.length > 1;
  }

  _onClick(key, value) {
    if (this.props.onChange) {
      this.props.onChange(key, value);
    }
  }
}

Filters.propTypes = {
  categories: PropTypes.object.isRequired,
  orders: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default Filters;
