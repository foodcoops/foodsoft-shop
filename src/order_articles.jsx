import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';

import CountryIcon from './country_icon';
import Price from './price';
import DeltaInput from './delta_input';
import UnitBar from './unit_bar';

// @todo get currency from api
// @todo tolerance_is_costly
// @todo compute what user would get in model
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
            <th style={styles.boxesHeading} colSpan={2}>Everyone</th>
          </tr>
        </thead>
        <tbody>
          {this.props.order_articles.data.map((oa) => {
            const hasTolerance = oa.article.unit_quantity > 1;
            const goa = (this.props.group_order_articles.data||[]).find((goa) => goa.order_article_id == oa.id);
            return (
              <tr key={oa.id}>
                <td style={styles.name}>{oa.article.name}</td>
                <td style={styles.country}><CountryIcon code={oa.article.origin} /></td>
                <td style={styles.unit}>{oa.article.unit}</td>
                <td style={styles.priceWithSep}><Price value={oa.price} /></td>
                <td style={styles.amount}>
                  <DeltaInput value={goa ? goa.quantity : 0} min={0}
                              onChange={(val) => this._onChangeAmount(oa, goa, 'quantity', val)} />
                </td>
                <td style={styles.amount}>{hasTolerance ?
                    <DeltaInput value={goa ? goa.tolerance : 0} min={0} max={oa.article.unit_quantity}
                                onChange={(val) => this._onChangeAmount(oa, goa, 'tolerance', val)} /> : null }
                </td>
                <td style={styles.priceWithSep}>{goa ? <Price value={oa.price * goa.quantity} /> : null}</td>
                <td style={styles.unitBar}>{hasTolerance ?
                    <UnitBar unit_quantity={oa.article.unit_quantity}
                             result={oa.units_to_order * oa.article.unit_quantity}
                             quantity={oa.quantity} tolerance={oa.tolerance} /> : null }
                </td>
                <td style={styles.boxes}>
                  {hasTolerance ? <span>+ </span> : null}
                  <span>{oa.units_to_order}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  _onChangeAmount(oa, goa, what, value) {
    console.log('update', oa, goa, what, value);
  }
}

OrderArticles.propTypes = {
  order_articles: PropTypes.object.isRequired,
  group_order_articles: PropTypes.object.isRequired
};

const styles = {
  name: {
    verticalAlign: 'middle'
  },
  country: {
    verticalAlign: 'middle',
    width: 18,
    opacity: 0.5
  },
  unit: {
    verticalAlign: 'middle',
    width: '4.5em',
    textAlign: 'right'
  },
  price: {
    verticalAlign: 'middle',
    width: '5em',
    textAlign: 'right'
  },
  priceWithSep: {
    verticalAlign: 'middle',
    width: '6em',
    textAlign: 'right',
    borderRight: '1px dashed #ddd',
    paddingRight: 14
  },
  amount: {
    verticalAlign: 'middle',
    width: 94,
    textAlign: 'center'
  },
  unitBar: {
    verticalAlign: 'middle',
    paddingLeft: 14,
    paddingRight: 0
  },
  boxesHeading: {
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  boxes: {
    verticalAlign: 'middle',
    paddingLeft: 0,
    textAlign: 'right',
    verticalAlign: 'middle',
    fontSize: '90%',
    color: '#7a7a7a'
  }
};

export default OrderArticles;
