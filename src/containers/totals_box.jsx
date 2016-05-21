import React, {PropTypes} from 'react';
import {Glyphicon, Well} from 'react-bootstrap';

import {connect} from 'react-redux';
import filter from '../store/filter';

import Price from '../components/price';

import {t} from 'i18n';
const T = (s, opts) => t('totals_box.'+s, opts);

const TotalsBox = ({group_order_articles, dispatch}) => {
  const goas = group_order_articles.data.data || [];
  const total = goas.reduce((sum, goa) => sum + goa.total_price, 0);
  return (
    <a href='#' onClick={onClick.bind(this, dispatch)}>
      <Well bsSize='sm' style={styles.container}>
        <Glyphicon glyph='shopping-cart' />
        {' '}{T('total')}
        <Price value={total} style={styles.amount} />
      </Well>
    </a>
  );
}

function onClick(dispatch, e) {
  dispatch(filter.actions.replace({ordered: 'member'}));
}

TotalsBox.propTypes = {
  group_order_articles: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect((state) => {
  return {group_order_articles: state.group_order_articles}
})(TotalsBox);

const styles = {
  container: {
  },
  amount: {
    display: 'block',
    float: 'right'
  }
};
