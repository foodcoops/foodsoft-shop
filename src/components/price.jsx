import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// @todo use spread operator
const Price = ({value, currency, ...props}) => value ?
  <span {...props}>{currency}{value.toFixed(2)}</span> : null;

Price.propTypes = {
  value: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
};

Price.defaultProps = {
  currency: ''
};

function select(state, props) {
  const config = state.config.data;
  if (config.currency_unit) {
    return { currency: config.currency_unit + (config.currency_space ? '\u202f' : '') };
  } else {
    return {};
  }
}

export default connect(select)(Price);
