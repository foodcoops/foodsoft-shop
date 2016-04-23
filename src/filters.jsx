import React, {PropTypes} from 'react';
import {Accordion, ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

class Filters extends React.Component {
  render() {
    let i = 0;
    return (
      <Accordion defaultActiveKey={1}>
        {this.hasCategories() ?
            this._renderPanel(i += 1, "Categories", this.props.categories.data) : null}
        {this.hasOrders() ?
            this._renderPanel(i += 1, "Suppliers", this.props.orders.data) : null}
      </Accordion>
    );
  }

  _renderPanel(key, title, items) {
    return (
      <Panel eventKey={key} header={title}>
        <ListGroup fill>
          {items.map((item) => (
            <ListGroupItem key={item.id} href='#'>{item.name}</ListGroupItem>
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
}

Filters.propTypes = {
  categories: PropTypes.object.isRequired,
  orders: PropTypes.object.isRequired
};

export default Filters;
