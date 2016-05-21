import React from 'react';
import {foodsoftCurrency} from '../config';

// @todo use spread operator
const Price = ({value, currency, ...props}) => value ?
  <span {...props}>{currency}{value.toFixed(2)}</span> : null;

Price.propTypes = {
  value: React.PropTypes.number.isRequired,
  currency: React.PropTypes.string.isRequired
};

Price.defaultProps = {
  currency: foodsoftCurrency
};

export default Price;
