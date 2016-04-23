import React, {PropTypes} from 'react';
import {Col, Row, Well} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from './rest';

import Filters from './filters';

class Orders extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.orders.sync());
    this.props.dispatch(rest.actions.categories.sync());
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <Filters categories={this.props.categories} orders={this.props.orders} />
        </Col>
        <Col md={9}>
        </Col>
      </Row>
    );
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
  return {orders: state.orders, categories: state.categories}
})(Orders);
