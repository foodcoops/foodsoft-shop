import React from 'react';

// @todo use spread operator
const Price = ({value, currency, space, style}) => value ?
  <span style={style}>{currency}{space ? ' ' : null}{value.toFixed(2)}</span> : null;

Price.propTypes = {
  value: React.PropTypes.number.isRequired,
  currency: React.PropTypes.string.isRequired,
  space: React.PropTypes.bool.isRequired
};

Price.defaultProps = {
  currency: '€',
  space: true
};

export default Price;
