import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';

import CountryIcon from './country_icon';
import Price from './price';

// @todo get currency from api
// @todo tolerance_is_costly
// @todo compute what user would get in model
// @todo unit bar
class OrderArticles extends React.Component {
  render() {
    if (!this.props.order_articles.data) { return <div />; }
    return (
      <Table hover>
        <thead>
          <tr>
            <th style={styles.name}>Name</th>
            <th style={styles.country} />
            <th style={styles.unit}>Unit</th>
            <th style={styles.priceWithSep}>Price</th>
            <th style={styles.amount}>Amount</th>
            <th style={styles.amount}>Extra</th>
            <th style={styles.priceWithSep}>Total</th>
            <th colSpan={2}>Everyone</th>
          </tr>
        </thead>
        <tbody>
          {this.props.order_articles.data.map((oa) => {
            const hasTolerance = oa.unit_quantity > 1;
            return (
              <tr key={oa.id}>
                <td style={styles.name}>{oa.article.name}</td>
                <td style={styles.country}><CountryIcon code={oa.article.origin} /></td>
                <td style={styles.unit}>{oa.article.unit}</td>
                <td style={styles.priceWithSep}><Price value={oa.price} /></td>
                <td style={styles.amount}>{oa.quantity}</td>
                <td style={styles.amount}>{hasTolerance ? oa.tolerance : null}</td>
                <td style={styles.priceWithSep}><Price value={oa.price * oa.quantity} /></td>
                <td></td>
                <td>{hasTolerance ? 'x' : null }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

OrderArticles.propTypes = {
  order_articles: PropTypes.object.isRequired,
};

const styles = {
  name: {
  },
  country: {
    width: 18,
    opacity: 0.5
  },
  unit: {
    width: '4.5em',
    textAlign: 'right'
  },
  price: {
    width: '5em',
    textAlign: 'right'
  },
  priceWithSep: {
    width: '6em',
    textAlign: 'right',
    borderRight: '1px dashed #ddd',
    paddingRight: 14
  },
  amount: {
    width: 94,
    textAlign: 'center'
  }
};

export default OrderArticles;
