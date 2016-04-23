import React from 'react';

const Price = ({value, currency, space}) => value ?
  <span>{currency}{space ? ' ' : null}{value.toFixed(2)}</span> : null;

Price.propTypes = {
  currency: React.PropTypes.string.isRequired,
  space: React.PropTypes.bool.isRequired
};

Price.defaultProps = {
  currency: '€',
  space: true
};

export default Price;
