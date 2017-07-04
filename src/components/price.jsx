import React from 'react';
import PropTypes from 'prop-types';
import {foodsoftCurrency} from '../config';

// @todo use spread operator
const Price = ({value, currency, ...props}) => value ?
  <span {...props}>{currency}{value.toFixed(2)}</span> : null;

Price.propTypes = {
  value: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
};

Price.defaultProps = {
  currency: foodsoftCurrency
};

export default Price;
