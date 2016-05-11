import React, {PropTypes} from 'react';
import {Glyphicon, Well} from 'react-bootstrap';

import Price from './price';

const TotalsBox = ({group_order_articles}) => {
  const total = (group_order_articles.data || []).reduce((sum, goa) => sum + goa.total_price, 0);
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

TotalsBox.propTypes = {
  group_order_articles: PropTypes.object.isRequired,
};

const styles = {
  container: {
  },
  amount: {
    display: 'block',
    float: 'right'
  }
}

export default TotalsBox;
