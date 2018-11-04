import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Glyphicon, Well } from 'react-bootstrap';

import Price from '../components/price';

import { t } from 'i18n-js';
const T = (s, opts) => t('totals_box.'+s, opts);

const TotalsBox = ({ group_order_articles }) => {
  const goas = group_order_articles.data || [];
  const total = goas.reduce((sum, goa) => sum + goa.total_price, 0);
  return (
    <a href='#/open/by/member'>
      <Well bsSize='sm' style={styles.container}>
        <Glyphicon glyph='shopping-cart' />
        {' '}{T('total')}
        <Price value={total} style={styles.amount} />
      </Well>
    </a>
  );
}

TotalsBox.propTypes = {
  group_order_articles: PropTypes.object.isRequired,
};

function select(state, props) {
  return { group_order_articles: state.group_order_articles };
}

export default connect(select)(TotalsBox);

const styles = {
  container: {
  },
  amount: {
    display: 'block',
    float: 'right'
  }
};
