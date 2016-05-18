import React, {PropTypes} from 'react';
import {Glyphicon, Well} from 'react-bootstrap';

import {connect} from 'react-redux';

import Price from '../components/price';

const TotalsBox = ({group_order_articles}) => {
  const goas = group_order_articles.data.data || [];
  const total = goas.reduce((sum, goa) => sum + goa.total_price, 0);
  return (
    <a href='#'>
      <Well bsSize='sm' style={styles.container}>
        <Glyphicon glyph='shopping-cart' />
        {' '}Total
        <Price value={total} style={styles.amount} />
      </Well>
    </a>
  );
}

const styles = {
  container: {
  },
  amount: {
    display: 'block',
    float: 'right'
  }
}

TotalsBox.propTypes = {
  group_order_articles: PropTypes.object.isRequired,
};

export default connect((state) => {
  return {group_order_articles: state.group_order_articles}
})(TotalsBox);
