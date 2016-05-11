import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from '../rest';

import CountryIcon from '../components/country_icon';
import Price from '../components/price';
import DeltaInput from '../components/delta_input';
import UnitBar from '../components/unit_bar';

// @todo get currency from api
class OrderArticles extends React.Component {

  componentDidMount() {
    this.props.dispatch(rest.actions.order_articles.sync());
    this.props.dispatch(rest.actions.group_order_articles.sync());
  }

  render() {
    if (!this.props.order_articles.data) { return <div />; }
    const anyTolerance = !!this.props.order_articles.data.find((oa) => oa.article.unit_quantity > 1);
    return (
      <Table hover>
        <thead>
          <tr>
            <th style={styles.name}>Name</th>
            <th style={styles.country} />
            <th style={styles.unit}>Unit</th>
            <th style={styles.priceWithSep}>Price</th>
            <th style={styles.amount}>Amount</th>
            {anyTolerance ? <th style={styles.amount}>Extra</th> : null}
            <th style={styles.priceWithSep}>Total</th>
            {anyTolerance ?
              <th style={styles.boxesHeading} colSpan={2}>Everyone</th> :
              <th style={styles.boxesHeading}>All</th>}
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
                {anyTolerance ?
                  <td style={styles.amount}>{hasTolerance ?
                      <DeltaInput value={goa ? goa.tolerance : 0} min={0} max={oa.article.unit_quantity}
                                  onChange={(val) => this._onChangeAmount(oa, goa, 'tolerance', val)} /> : null }
                  </td> : null }
                <td style={styles.priceWithSep}>{goa ? <Price value={goa.total_price} /> : null}</td>
                {anyTolerance ?
                  <td style={styles.unitBar}>{hasTolerance ?
                      <UnitBar unit_quantity={oa.article.unit_quantity}
                               result={oa.units_to_order * oa.article.unit_quantity}
                               quantity={oa.quantity} tolerance={oa.tolerance} /> : null }
                  </td> : null }
                <td style={Object.assign(styles.boxes, {textAlign: anyTolerance ? 'right' : 'center'})}>
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
    // @todo move order_articles.get() call to rest.js (not sure how yet)
    // @todo perhaps change api to only work with order_article_id and get rid of group_order_articles
    if (goa) {
      const goa_q = what === 'quantity' ? Number(value) : goa.quantity;
      const goa_t = what === 'tolerance' ? Number(value) : goa.tolerance;
      if (goa_q === 0 && goa_t === 0) {
        // amounts are zero, destroy it
        // (we could update it too, but the response would be that it's deleted, we can't understand that response from update)
        this.props.dispatch(rest.actions.group_order_articles.destroy(goa.id, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      } else {
        // update existing group_order_article
        this.props.dispatch(rest.actions.group_order_articles.update(goa.id, {[what]: value}, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      }
    } else if (value && value !== 0) {
      // no existing group_order_article, create one
      this.props.dispatch(rest.actions.group_order_articles.create({order_article_id: oa.id, [what]: value}, () => {
        this.props.dispatch(rest.actions.order_articles.get(oa.id));
      }));
    }
  }
}

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
    fontSize: '90%',
    color: '#7a7a7a',
    whiteSpace: 'nowrap'
  }
};

OrderArticles.propTypes = {
  order_articles: PropTypes.object.isRequired,
  group_order_articles: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect((state) => {
  return {order_articles: state.order_articles, group_order_articles: state.group_order_articles}
})(OrderArticles);
