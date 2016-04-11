import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import rest from './rest';

class Orders extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.orders.sync());
  }

  render() {
    return (
      <ul>
        <li>Hi there!</li>
        {this.props.orders.data.map((order, i) => (
          <li key={i}>{order.name}</li>
        ))}
      </ul>
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
  return {orders: state.orders}
})(Orders);
