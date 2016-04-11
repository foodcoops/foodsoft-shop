import React, {PropTypes} from 'react';
import {Nav, NavItem, Tab, Tabs} from 'react-bootstrap';

class Filters extends React.Component {
  render() {
    let i = 0;
    return (
      <Tabs defaultActiveKey={1}>
        {this.hasOrders() ? 
            this.renderTab(i += 1, "Suppliers", this.props.orders.data) : null}
        {this.hasCategories() ?
            this.renderTab(i += 1, "Categories", this.props.categories.data) : null}
      </Tabs>
    );
  }

  renderTab(key, title, items) {
    return (
      <Tab eventKey={key} title={title}>
        <Nav bsStyle="pills" stacked>
          {items.map((item) => (
            <NavItem key={item.id}>{item.name}</NavItem>
          ))}
        </Nav>
      </Tab>
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
